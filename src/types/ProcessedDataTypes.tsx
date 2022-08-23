import {CDGCard, MiroBoardData} from "./CardographerPlatformTypes";

export interface CASnapshot {
    //snapshot
    id: string,
    description: string,
    originallyCreated: string,
    "created": string,
    //board
    rawBoardData: MiroBoardData,
    //session
    sessionId: string,
    sessionName: string,
    sessionDescription: string,
    //decks
    decks: CADeck[]
    //cards
    cards: CACard[]
    //frames
    frames: { [frameName: string]: CAFrame }
    //sticky notes
    ideas: CAIdea[],
}

export interface CADeck {
    id: string,
    revisionId: number,
    created: string,
    lastModified: string,
    name: string,
    description: string,
    cards: CACard[]
}

export interface CACard {
    "id": string,
    "revision": number,
    "name": string,
    "description": string,
    "category": string,
    "back": string,
    "frontFile": string,
    "frontUrl": string,
    deckId: string,
    deckRevisionId: number,
    deckName: string,
}


export interface CAFrame {
    name: string,
    cards: CACard[],
    ideas: CAIdea[],
}

export interface CAIdea {
    content: string,
    parentFrameName: string,
}

export interface CAData {
    snapshots: CASnapshot[],
    decks: CADeck[],
    cards: CACard[],
}


export interface CACardAnalyse extends CACard {
    combination: CACard[],
    frame: string,
    idea: CAIdea[],
}

export interface CASnapshotAnalyse extends CASnapshot {
    analysedCards: Map<string, CACardAnalyse>,
    analysedFrames: Map<string, CACardAnalyse[]>,
}

export interface CACardCombinationOverview {
    combinations: CACard[],
    count: number,
}

export interface CACardFrameOverview {
    name: string,
    count: number,
}

export interface CACardIdeaOverview extends CAIdea {
    count: number,
}

export interface CACardAnalyseOverview extends CACard {
    combinations: CACardCombinationOverview[],
    frames: CACardFrameOverview[],
    ideas: CACardIdeaOverview[],
}

export interface CASnapshotCardAnalyseWithCount extends CACardAnalyse {
    snapshotId: string,
    date: string,
    combinationCount: number,
    ideaCount: number,
}


export interface PostProcessedCardAnalysis extends CACardAnalyseOverview {
    sortedCombinations: CACardCombinationOverview[],
    sortedFrames: CACardFrameOverview[],
    mostOccurredCombinations: CACardCombinationOverview[],
    mostOccurredFrames: CACardFrameOverview[],
    historicalAnalysis: CASnapshotCardAnalyseWithCount[],
    usedCount: number,
}

export interface CurrentCardData {
    card: CACardAnalyseOverview,
    parentFrame: string,
    parentFrameId?: string,
}

export interface PostProcessedFrameAnalysis {
    cardUsageAnalysis: { [cardId: string]: { card: CACardAnalyse, count: number } },
    historicalAnalysis: { snapshotId: string, combinations: CACardAnalyse[], cards: CACard[] }[],
    combinationAnalysis: FrameCombinationAnalysis[],
    unusedCard: CDGCard[],
    usedCount: number,
}


export interface FrameCombinationAnalysis {
    combinations: CACardAnalyse[],
    count: number,
}





