import React from "react";
import {LiveBoardAction, LiveBoardRecordingStates} from "../../types/Snapshot";
import {BoardFrame} from "../../types/MiroBoard";
import {CACard, CACardAnalyseOverview, CADeck, CAIdea, CASnapshotAnalyse} from "../../types/ProcessedDataTypes";
import {CardAnalysisDataBox} from "../../components/CardAnalysisDataBox/CardAnalysisDataBox";

interface DebriefPageSummaryProps {
    liveBoardActions: LiveBoardAction[],
    lbdRecordingState: LiveBoardRecordingStates,
    boardData: { [frameId: string]: BoardFrame } | undefined,
    caDecks: CADeck[],
    caCards: CACard[],
    caAnalysedSnapshots: CASnapshotAnalyse[],
    caAnalysedCards: Map<string, CACardAnalyseOverview>,
}

const DebriefPageSummary = (props: DebriefPageSummaryProps) => {
    const {
        // liveBoardActions,
        // lbdRecordingState,
        boardData,
        caDecks,
        caCards,
        caAnalysedSnapshots,
        caAnalysedCards
    } = props

    if (!boardData || caAnalysedCards.size === undefined) {
        return <div>Summary is not ready yet</div>
    }

    console.log(caAnalysedSnapshots)
    const averageCardCount = caAnalysedSnapshots.reduce((acc, cur) => acc + cur.analysedCards.size, 0) / caAnalysedSnapshots.length
    let totalUsedFrameCount = 0;
    for (const snapshot of caAnalysedSnapshots.values()) {
        //console.log(snapshot)
        snapshot.analysedFrames.forEach((cards, _) => {
            if (cards.length > 0) {
                //console.log(`${frameId} was used in ${snapshot.id}`)
                totalUsedFrameCount++
            }
        });
    }
    const averageFrameCount = totalUsedFrameCount / caAnalysedSnapshots.length
    const averageIdeaCount = caAnalysedSnapshots.reduce((acc, cur) => acc + cur.ideas.length, 0) / caAnalysedSnapshots.length
    const usedCards: CACard[] = []
    const usedCardsNeverUsedBefore = []
    const usedFrames: BoardFrame[] = []
    const usedDecks: CADeck[] = []
    const ideas: CAIdea[] = []
    Object.keys(boardData).forEach((frameId) => {
        const frameData = boardData[frameId]
        if (frameData.cards.length > 0 || frameData.stickyNotes.length > 0) {
            usedFrames.push(frameData)
        }
        frameData.cards.forEach((cardId) => {
            const card = caCards.find((card) => card.id === cardId)
            if (card) {
                usedCards.push(card)
                const usedBefore = caAnalysedCards.get(cardId)
                if (!usedBefore) {
                    usedCardsNeverUsedBefore.push(card)
                }
                const deck = caDecks.find((deck) => deck.id === card.deckId)
                if (deck && !usedDecks.find(d => d.id === deck.id)) {
                    usedDecks.push(deck)
                }
            }
        })
        frameData.stickyNotes.forEach((stickyNote) => {
            ideas.push({
                content: stickyNote,
                parentFrameName: frameData.name
            })
        })
    })

    return (
        <div className="w-full grow flex flex-col">
            <div className="mb-2 font-bold text-xs text-gray-500">Deck Usage</div>
            <div className="w-full flex flex-row flex-wrap">
                <CardAnalysisDataBox title="Current"
                                     dataFontSize='text-md'
                                     titleFontSize='text-xs'
                                     data={usedDecks.length.toString()}
                />
                <CardAnalysisDataBox title="Unused"
                                     dataFontSize='text-md'
                                     titleFontSize='text-xs'
                                     data={(caDecks.length - usedDecks.length).toString()}
                />
            </div>
            <div className="mb-2 font-bold text-xs text-gray-500">Card Usage</div>
            <div className="w-full flex flex-row flex-wrap">
                <CardAnalysisDataBox title="Current"
                                     dataFontSize='text-md'
                                     titleFontSize='text-xs'
                                     data={usedCards.length.toString()}
                />
                <CardAnalysisDataBox title="Average per session"
                                     dataFontSize='text-md'
                                     titleFontSize='text-xs'
                                     data={averageCardCount.toFixed(2).toString()}
                />
                <CardAnalysisDataBox title="New cards used this time"
                                     dataFontSize='text-md'
                                     titleFontSize='text-xs'
                                     data={(usedCardsNeverUsedBefore.length).toString()}
                />
                <CardAnalysisDataBox title="Unused"
                                     dataFontSize='text-md'
                                     titleFontSize='text-xs'
                                     data={(caCards.length - usedCards.length).toString()}
                />
            </div>
            <div className="mb-2 font-bold text-xs text-gray-500">Frame Usage</div>
            <div className="w-full flex flex-row flex-wrap">
                <CardAnalysisDataBox title="Current"
                                     dataFontSize='text-md'
                                     titleFontSize='text-xs'
                                     data={usedFrames.length.toString()}
                />
                <CardAnalysisDataBox title="Average"
                                     dataFontSize='text-md'
                                     titleFontSize='text-xs'
                                     data={averageFrameCount.toFixed(2).toString()}
                />
            </div>
            <div className="mb-2 font-bold text-xs text-gray-500">Idea Usage</div>
            <div className="w-full flex flex-row flex-wrap">
                <CardAnalysisDataBox title="Current"
                                     dataFontSize='text-md'
                                     titleFontSize='text-xs'
                                     data={ideas.length.toString()}
                />
                <CardAnalysisDataBox title="Average"
                                     dataFontSize='text-md'
                                     titleFontSize='text-xs'
                                     data={averageIdeaCount.toFixed(2).toString()}
                />
            </div>
        </div>
    )

}

export default React.memo(DebriefPageSummary)