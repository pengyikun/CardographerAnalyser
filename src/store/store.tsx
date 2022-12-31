import create from 'zustand'
import {PAGE_TYPES, PageType} from "../types/PageType";
import {BoardFrame, BoardFrameRaw} from "../types/MiroBoard";
import {persist} from "zustand/middleware"
import {LoginState} from "../types/LoginStates";
import {
    CDGAnalyse,
    CDGCard,
    CDGDeck,
    CDGSession,
    CDGSnapshot,
    CDGSnapshotBrief
} from "../types/CardographerPlatformTypes";
import {getCurrentTime} from "../utils/helpers/Util";
import {
    CACard,
    CACardAnalyseOverview,
    CADeck,
    CASnapshot,
    CASnapshotAnalyse, CurrentCardData,
    PostProcessedCardAnalysis, PostProcessedFrameAnalysis
} from "../types/ProcessedDataTypes";
import {LiveBoardAction, LiveBoardData, LiveBoardRecordingStates} from "../types/Snapshot";

export const DISPATCH_TYPES = {
    UPDATE_VERSION_INFO: 'UPDATE_VERSION_INFO',
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    SET_AI_COMPLETION_TOKEN: 'SET_AI_COMPLETION_TOKEN',
    SET_PAGE: 'SET_PAGE',
    NO_SELECTED_ITEMS: 'NO_SELECTED_ITEMS',
    SET_FOCUSED_CARD: 'SET_FOCUSED_CARD',
    SET_USAGE_DATA: 'SET_USAGE_DATA',
    CSV_UPLOADED: 'CSV_UPLOADED',
    FOCUSED_CARD_UPDATED: 'FOCUSED_CARD_UPDATED',
    FOCUSED_FRAME_UPDATED: 'FOCUSED_FRAME_UPDATED',
    SET_ANALYSES: 'SET_ANALYSES',
    SET_SELECTED_ANALYSE: 'SET_SELECTED_ANALYSE',
    SET_SNAPSHOT_BRIEFS: 'SET_SNAPSHOT_BRIEFS',
    SET_SELECTED_SNAPSHOTS: 'SET_SELECTED_SNAPSHOTS',
    SET_SELECTED_SESSIONS: 'SET_SELECTED_SESSIONS',
    SET_SELECTED_DECKS: 'SET_SELECTED_DECKS',
    SET_SELECTED_CARDS: 'SET_SELECTED_CARDS',
    FETCHED_ALL_DATA: 'FETCHED_ALL_DATA',
    SET_CA_DATA: 'SET_CA_DATA',
    SET_CA_ANALYSED_CARDS: 'SET_CA_ANALYSED_CARDS',
    RESET: 'RESET',
    START_RECORDING: 'START_RECORDING',
    STOP_RECORDING: 'STOP_RECORDING',
    ADD_RECORDING_DATA: 'ADD_RECORDING_DATA',
    ADD_ACTIONS: 'ADD_ACTIONS',
    CLEAR_ACTIONS: 'CLEAR_ACTIONS',
    SET_NOTIFICATION_MESSAGE: 'SET_NOTIFICATION_MESSAGE',
    ERROR_FETCH_VERSION: 'ERROR_FETCH_VERSION',
}
export type DispatchType = typeof DISPATCH_TYPES[keyof typeof DISPATCH_TYPES]

export type DispatchPayload = {
    versionId?: string,
    versionDescription?: string,
    notificationMessage?: string,
    loginState?: LoginState,
    aiCompletionToken?: string,
    aiImageGenerationToken?: string,
    page?: PageType,
    boardData?: { [frameId: string]: BoardFrame } | undefined,
    dataFetchTime?: string | undefined,
    analyses?: CDGAnalyse[],
    analyse?: CDGAnalyse | undefined,
    snapshotBriefs?: CDGSnapshotBrief[],
    snapshots?: CDGSnapshot[],
    sessions?: CDGSession[],
    decks?: CDGDeck[],
    cards?: CDGCard[],
    caSnapshots?: CASnapshot[],
    caDecks?: CADeck[],
    caCards?: CACard[],
    caAnalysedSnapshots?: CASnapshotAnalyse[],
    caAnalysedCards?: Map<string, CACardAnalyseOverview>,
    focusedCardAnalysis?: PostProcessedCardAnalysis,
    focusedCardData?: CurrentCardData,
    focusedFrameAnalysis?: PostProcessedFrameAnalysis,
    focusedFrameData?: BoardFrameRaw,
    liveBoardData?: LiveBoardData,
    recordingSessionId?: string,
    liveBoardActions?: LiveBoardAction[],
}

export type DispatchAction = {
    type: DispatchType,
    payload: DispatchPayload
}

const reducer = (state: Store, action: DispatchAction) => {
    const {type, payload} = action
    switch (type) {
        case DISPATCH_TYPES.UPDATE_VERSION_INFO:
            return {
                versionId: payload.versionId,
                versionDescription: payload.versionDescription,
                notificationMessage: payload.notificationMessage
            }
        case DISPATCH_TYPES.SET_NOTIFICATION_MESSAGE:
            return {notificationMessage: payload.notificationMessage}
        case DISPATCH_TYPES.LOGIN:
            return {page: PAGE_TYPES.HOME, loginState: payload.loginState}
        case DISPATCH_TYPES.SET_AI_COMPLETION_TOKEN:
            return {
                aiTextCompletionToken: payload.aiCompletionToken,
                aiImageGenerationToken: payload?.aiImageGenerationToken
            }
        case DISPATCH_TYPES.LOGOUT:
            return {page: PAGE_TYPES.HOME, loginState: {isLoggedIn: false}, aiTextCompletionToken: undefined}
        case DISPATCH_TYPES.SET_PAGE:
            return {page: payload.page}
        case DISPATCH_TYPES.NO_SELECTED_ITEMS:
            return {
                boardData: payload.boardData,
                focusedCardData: undefined,
                focusedCardAnalysis: undefined,
                focusedFrameData: undefined,
                focusedFrameAnalysis: undefined,
            }
        case DISPATCH_TYPES.FOCUSED_CARD_UPDATED:
            return {
                boardData: payload.boardData,
                focusedCardData: payload.focusedCardData,
                focusedCardAnalysis: payload.focusedCardAnalysis,
            }
        case DISPATCH_TYPES.FOCUSED_FRAME_UPDATED:
            return {
                boardData: payload.boardData,
                focusedFrameAnalysis: payload.focusedFrameAnalysis,
                focusedFrameData: payload.focusedFrameData,
            }
        case DISPATCH_TYPES.SET_ANALYSES:
            return {analyses: payload.analyses}
        case DISPATCH_TYPES.SET_SELECTED_ANALYSE:
            return {analyse: payload.analyse}
        case DISPATCH_TYPES.SET_SNAPSHOT_BRIEFS:
            return {snapshotBriefs: payload.snapshotBriefs}
        case DISPATCH_TYPES.SET_SELECTED_SNAPSHOTS:
            return {snapshots: payload.snapshots}
        case DISPATCH_TYPES.SET_SELECTED_SESSIONS:
            return {sessions: payload.sessions}
        case DISPATCH_TYPES.SET_SELECTED_DECKS:
            return {decks: payload.decks}
        case DISPATCH_TYPES.SET_SELECTED_CARDS:
            return {cards: payload.cards}
        case DISPATCH_TYPES.FETCHED_ALL_DATA:
            return {
                dataFetchTime: getCurrentTime(),
                snapshotBriefs: payload.snapshotBriefs,
                snapshots: payload.snapshots,
                sessions: payload.sessions,
                decks: payload.decks,
                cards: payload.cards,
                caSnapshots: payload.caSnapshots,
                caDecks: payload.caDecks,
                caCards: payload.caCards,
                caAnalysedSnapshots: payload.caAnalysedSnapshots,
                caAnalysedCards: payload.caAnalysedCards,
            }
        case DISPATCH_TYPES.SET_CA_DATA:
            return {
                caSnapshots: payload.caSnapshots,
                caDecks: payload.caDecks,
                caCards: payload.caCards,
                caAnalysedSnapshots: payload.caAnalysedSnapshots,
                caAnalysedCards: payload.caAnalysedCards,
            }
        case DISPATCH_TYPES.SET_CA_ANALYSED_CARDS:
            return {caAnalysedCards: payload.caAnalysedCards, caAnalysedSnapshots: payload.caAnalysedSnapshots}
        case DISPATCH_TYPES.START_RECORDING:
            console.log('start recording')
            return {
                liveBoardData: undefined,
                lbdRecordingState: {
                    sessionId: payload.recordingSessionId,
                    isRecording: true,
                    startTime: getCurrentTime()
                },
                liveBoardActions: [],
            }
        case DISPATCH_TYPES.STOP_RECORDING:
            console.log('stop recording')
            return {
                liveBoardData: undefined,
                lbdRecordingState: {sessionId: undefined, isRecording: false, startTime: undefined},
            }
        case DISPATCH_TYPES.ADD_RECORDING_DATA:
            if (payload.liveBoardActions) {
                return {
                    liveBoardData: payload.liveBoardData,
                    liveBoardActions: [...state.liveBoardActions, ...payload.liveBoardActions]
                }
            } else {
                return {liveBoardData: payload.liveBoardData,}
            }
        case DISPATCH_TYPES.ADD_ACTIONS:
            if (payload.liveBoardActions) {
                return {liveBoardActions: [...state.liveBoardActions, ...payload.liveBoardActions]}
            }
            return {}
        case DISPATCH_TYPES.CLEAR_ACTIONS:
            return {liveBoardActions: []}
        case DISPATCH_TYPES.RESET:
            return {
                loginState: state.loginState,
                page: state.page === PAGE_TYPES.HOME ? state.page : PAGE_TYPES.HOME,
                boardData: undefined,
                dataFetchTime: undefined,
                analyses: [],
                analyse: undefined,
                snapshotBriefs: [],
                snapshots: [],
                sessions: [],
                decks: [],
                cards: [],
                caSnapshots: [],
                caDecks: [],
                caCards: [],
                caAnalysedSnapshots: [],
                caAnalysedCards: new Map<string, CACardAnalyseOverview>(),
                focusedCardAnalysis: undefined,
                focusedCardData: undefined,
                liveBoardData: undefined,
                lbdRecordingState: {sessionId: undefined, isRecording: false, startTime: undefined,},
                liveBoardActions: [],
            }
        default:
            return {}
    }
}

type Store = {
    versionId: string,
    versionDescription: string,
    notificationMessage: string | undefined,
    loginState: LoginState,
    aiTextCompletionToken: string | undefined,
    aiImageGenerationToken: string | undefined,
    page: PageType,
    boardData: { [frameId: string]: BoardFrame } | undefined,
    // RAW DATA in Miro or Cardographer Platform typings: CDG Data
    dataFetchTime: string | undefined,
    analyses: CDGAnalyse[],
    analyse: CDGAnalyse | undefined,
    snapshotBriefs: CDGSnapshotBrief[],
    snapshots: CDGSnapshot[],
    sessions: CDGSession[],
    decks: CDGDeck[],
    cards: CDGCard[],
    // Parsed DATA: CA Data,
    caSnapshots: CASnapshot[],
    caDecks: CADeck[],
    caCards: CACard[],
    // Analysed DATA: caAnalysed Data
    caAnalysedSnapshots: CASnapshotAnalyse[],
    caAnalysedCards: Map<string, CACardAnalyseOverview>,
    // Current focussed card detailed analyse data
    focusedCardAnalysis: PostProcessedCardAnalysis | undefined,
    focusedCardData: CurrentCardData | undefined,
    // Current focussed frame detailed analyse data
    focusedFrameAnalysis: PostProcessedFrameAnalysis | undefined,
    focusedFrameData: BoardFrameRaw | undefined,
    // BoardDataRecording
    liveBoardData: LiveBoardData | undefined,
    lbdRecordingState: LiveBoardRecordingStates,
    liveBoardActions: LiveBoardAction[],
    // Dispatcher
    dispatch: (args: DispatchAction) => void
}

export const useStore = create<Store>()(persist(
    (set) => ({
        versionId: "",
        versionDescription: "",
        notificationMessage: undefined,
        loginState: {isLoggedIn: false},
        aiTextCompletionToken: undefined,
        aiImageGenerationToken: undefined,
        page: PAGE_TYPES.HOME,
        boardData: undefined,
        dataFetchTime: undefined,
        analyses: [],
        analyse: undefined,
        snapshotBriefs: [],
        snapshots: [],
        sessions: [],
        decks: [],
        cards: [],
        caSnapshots: [],
        caDecks: [],
        caCards: [],
        caAnalysedSnapshots: [],
        caAnalysedCards: new Map<string, CACardAnalyseOverview>(),
        focusedCardAnalysis: undefined,
        focusedCardData: undefined,
        focusedFrameAnalysis: undefined,
        focusedFrameData: undefined,
        liveBoardData: undefined,
        lbdRecordingState: {sessionId: undefined, isRecording: false, startTime: undefined,},
        liveBoardActions: [],
        dispatch: (args: DispatchAction) => set((state) => reducer(state, args)),
    }),
    {
        name: "cardographer-analyzer-storage",
        getStorage: () => localStorage,
    }
))