/**
 * Contains all helper functions that analyses deck,card and frame data
 */

import {
    CACard,
    CACardAnalyse, CACardAnalyseOverview, CACardCombinationOverview, CACardFrameOverview, CACardIdeaOverview,
    CAData,
    CADeck,
    CAFrame, CAIdea,
    CASnapshot,
    CASnapshotAnalyse, CASnapshotCardAnalyseWithCount, FrameCombinationAnalysis
} from "../../types/ProcessedDataTypes";
import {
    CDGDeck,
    CDGDeckBrief,
    CDGSession,
    CDGSnapshot, MiroBoardData,
} from "../../types/CardographerPlatformTypes";
import {extractCardNameFromURL, isCardCombinationEqual} from "./Util";
import {byPropertiesOf} from "./sort";

export const generateCAData = (sessions: CDGSession[], snapshots: CDGSnapshot[], decks: CDGDeck[]): CAData => {
    const caSnapshots: CASnapshot[] = []
    const caDecks: CADeck[] = []
    let caCards: CACard[] = []
    for (const snapshot of snapshots) {
        const session = sessions.find(s => s._id === snapshot.sessionId) as CDGSession
        console.log(session)
        const _caSnapshotDecks: CADeck[] = []
        let _caSnapshotCards: CACard[] = []
        const deckBriefs = session?.decks as CDGDeckBrief[]
        for (const d of deckBriefs) {
            const deck = decks.find(dk => dk.deckId === d.deckId && dk.revision === d.revision) as CDGDeck
            const exist = caDecks.find(d => d.id === deck.deckId && deck.revision === d.revisionId)
            console.log(`Deck ${d.deckId} exist is ${exist}`)
            const _caDeck: CADeck = {
                id: deck.deckId,
                revisionId: deck.revision,
                created: deck.created,
                lastModified: deck.lastModified,
                name: deck.deckName,
                description: deck.deckDescription,
                cards: deck.cards.map(card => {
                    return {
                        id: card.id,
                        revision: card.revision,
                        name: card.name,
                        description: card.description,
                        category: card.category,
                        back: card.back,
                        frontFile: card.frontFile,
                        frontUrl: card.frontUrl,
                        deckId: deck.deckId,
                        deckRevisionId: deck.revision,
                        deckName: deck.deckName
                    }
                })
            }
            if (exist) {
                _caSnapshotDecks.push(exist)
                _caSnapshotCards = [..._caSnapshotCards, ..._caDeck.cards]
                continue
            }
            _caSnapshotDecks.push(_caDeck)
            _caSnapshotCards = [..._caSnapshotCards, ..._caDeck.cards]
            caDecks.push(_caDeck)
            caCards = [...caCards, ..._caDeck.cards]
        }
        const {frames, ideas} = parseSnapshotBoard(snapshot.data, _caSnapshotCards)

        caSnapshots.push({
            id: snapshot._id,
            description: snapshot.snapshotDescription,
            originallyCreated: snapshot.originallyCreated,
            created: snapshot.created,
            rawBoardData: snapshot.data,
            sessionId: session._id,
            sessionName: session.name,
            sessionDescription: session.description,
            decks: _caSnapshotDecks,
            cards: _caSnapshotCards,
            frames: frames,
            ideas: ideas,
        })
    }


    return {
        snapshots: caSnapshots,
        decks: caDecks,
        cards: caCards
    }
}


export const parseSnapshotBoard = (board: MiroBoardData, cards: CACard[]) => {

    const frames: { [name: string]: CAFrame } = {}
    const rawFrames = board.widgets.filter(w => w.type.toUpperCase() === "FRAME")
    const imagesNodes = board.widgets.filter(w => w.type.toUpperCase() === "IMAGE")
    const noteNodes = board.widgets.filter(w => w.type.toUpperCase() === "STICKY_NOTE")
    const caIdeas: CAIdea[] = []
    for (const rawFrame of rawFrames) {
        const {title, childrenIds} = rawFrame
        const childrenImagesNodes = imagesNodes.filter(i => childrenIds?.includes(i.id))
        const childrenNoteNodes = noteNodes.filter(i => childrenIds?.includes(i.id))
        childrenNoteNodes.forEach(n => {
            caIdeas.push({
                parentFrameName: title,
                content: n.content!,
            })
        })
        frames[title] = {
            name: title,
            cards: childrenImagesNodes.map(i => {
                const name = extractCardNameFromURL(i.url!)
                if (!name) return ""
                const card = cards.find(c => c.id === name)
                if (!card) return ""
                return card
            }).filter(i => i != "") as CACard[],
            ideas: childrenNoteNodes.map(i => {
                return {
                    content: i.content!,
                    parentFrameName: title,
                }
            })
        }
    }

    console.log('parseSnapshotBoard', frames)
    return {
        frames: frames,
        ideas: caIdeas,
    }

}


export const analyseCAFrame = (frame: CAFrame): CACardAnalyse[] => {
    const {name, cards, ideas} = frame
    return cards.map(card => {
        return {
            ...card,
            combination: cards.filter(c => c.id !== card.id),
            frame: name,
            idea: ideas,
        }
    })
}

export const analyseCASnapshot = (snapshot: CASnapshot): CASnapshotAnalyse => {
    const {frames} = snapshot
    let analysedCards: Map<string, CACardAnalyse> = new Map()
    const analysedFrames: Map<string, CACardAnalyse[]> = new Map()

    for (const [name, frame] of Object.entries(frames)) {
        const cards = analyseCAFrame(frame)
        analysedCards = new Map([...analysedCards, ...new Map(cards.map(c => [c.id, c]))])
        analysedFrames.set(name, cards)
    }
    return {
        ...snapshot,
        analysedCards: analysedCards,
        analysedFrames: analysedFrames,
    }
}

export const analyseCAData = (analyses: CASnapshotAnalyse[]) => {
    const cardsMap: Map<string, CACardAnalyseOverview> = new Map()
    for (const analyse of analyses) {
        const {analysedCards} = analyse
        for (const [name, card] of analysedCards) {
            const cardAnalyse = cardsMap.get(name)
            if (!cardAnalyse) {
                let ideaData: CACardIdeaOverview[] = []
                card.idea.forEach(i => {
                    const exist = ideaData.find(x => x.content === i.content)
                    if (exist) {
                        ideaData = [...ideaData.filter(y => y.content !== i.content), {
                            ...i,
                            count: exist.count + 1
                        }]
                    } else {
                        ideaData.push({
                            ...i,
                            count: 1
                        })
                    }
                })
                const cardData = {
                    id: card.id,
                    revision: card.revision,
                    name: card.name,
                    description: card.description,
                    category: card.category,
                    back: card.back,
                    frontFile: card.frontFile,
                    frontUrl: card.frontUrl,
                    deckId: card.deckId,
                    deckRevisionId: card.deckRevisionId,
                    deckName: card.deckName,
                    combinations: [{
                        combinations: card.combination,
                        count: 1
                    }],
                    frames: [{
                        name: card.frame,
                        count: 1,
                    }],
                    ideas: ideaData,
                }
                cardsMap.set(name, cardData)
                continue
            }
            // Add up combination occurrence count
            const existedCombinations = cardAnalyse.combinations
            let hasSameCombination = false
            for (const [index, combination] of existedCombinations.entries()) {
                if (isCardCombinationEqual(combination.combinations, card.combination)) {
                    hasSameCombination = true
                    existedCombinations[index].count++
                    break
                }
            }
            if (!hasSameCombination) {
                existedCombinations.push({
                    combinations: card.combination,
                    count: 1
                })
            }
            // Add up frame occurrence count
            const existedFrames = cardAnalyse.frames
            let hasSameFrame = false
            for (const [index, frame] of existedFrames.entries()) {
                if (frame.name === card.frame) {
                    hasSameFrame = true
                    existedFrames[index].count++
                    break
                }
            }
            if (!hasSameFrame) {
                existedFrames.push({
                    name: card.frame,
                    count: 1
                })
            }
            // Add up frame occurrence idea
            let uncheckedIdea = [...card.idea]
            const existedIdeas = cardAnalyse.ideas
            for (const [index, idea] of existedIdeas.entries()) {
                if (card.idea.find(i => i.content === idea.content && i.parentFrameName === idea.parentFrameName)) {
                    existedIdeas[index].count++
                    uncheckedIdea = uncheckedIdea.filter(i => i.content !== idea.content)
                    break
                }
            }
            for (const i of uncheckedIdea) {
                const exist = existedIdeas.find(x => x.content === i.content && x.parentFrameName === i.parentFrameName)
                if (exist) {
                    for (const y of existedIdeas) {
                        if (y.content === i.content && y.parentFrameName === i.parentFrameName) {
                            y.count++
                            break
                        }
                    }
                    continue
                }
                existedIdeas.push({
                    ...i,
                    count: 1
                })
            }
            // Update Map
            cardsMap.set(name, {
                ...cardAnalyse,
                combinations: existedCombinations,
                frames: existedFrames,
                ideas: existedIdeas,
            })

        }
    }
    return cardsMap
}


export const getSortedCardCombinations = (combinationOverviews: CACardCombinationOverview[]) => {
    return combinationOverviews.sort(byPropertiesOf<CACardCombinationOverview>(['count']))
}

export const getMostOccurredCardCombinations = (sortedCombinations: CACardCombinationOverview[]) => {
    if (sortedCombinations.length === 0) return []
    return sortedCombinations.filter(combination => combination.count === sortedCombinations[sortedCombinations.length - 1].count)
}

export const getSortedCardFrames = (frameOverviews: CACardFrameOverview[]) => {
    return frameOverviews.sort(byPropertiesOf<CACardFrameOverview>(['count']))
}

export const getMostOccurredCardFrames = (sortedFrameOverviews: CACardFrameOverview[]) => {
    if (sortedFrameOverviews.length === 0) return []
    return sortedFrameOverviews.filter(frameOverview => frameOverview.count === sortedFrameOverviews[sortedFrameOverviews.length - 1].count)
}

export const getSortedCardByUsage = (cardAnalysis: { card: CACardAnalyse, count: number }[]) => {
    return cardAnalysis.sort(byPropertiesOf<{ card: CACardAnalyse, count: number }>(['count']))
}

export const getMostUsedCardFromAnalysis = (sortedCardAnalysis: { card: CACardAnalyse, count: number }[]) => {
    if (sortedCardAnalysis.length === 0) return []
    return sortedCardAnalysis.filter(cardAnalysis => cardAnalysis.count === sortedCardAnalysis[0].count)
}

export const getMostOccurredFrameCombinations = (sortedCombinations: FrameCombinationAnalysis[]) => {
    if (sortedCombinations.length === 0) return []
    return sortedCombinations.filter(combination => combination.count === sortedCombinations[0].count)
}

export const getSortedFrameCombinations = (combinations: FrameCombinationAnalysis[]) => {
    return combinations.sort(byPropertiesOf<FrameCombinationAnalysis>(['count']))
}


export const getCardHistoricalData = (analyses: CASnapshotAnalyse[], card: CACardAnalyseOverview): CASnapshotCardAnalyseWithCount[] => {
    return (analyses.map(snapshot => {
            const cardAnalyse = snapshot.analysedCards.get(card.id)
            if (!cardAnalyse) {
                return null
            }
            return {
                ...cardAnalyse,
                snapshotId: snapshot.id,
                date: snapshot.created,
                combinationCount: cardAnalyse.combination.length,
                ideaCount: cardAnalyse.idea.length,
            }
        }).filter(a => a != null) as CASnapshotCardAnalyseWithCount[]
    )
}
