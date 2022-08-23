export type LiveBoardCopy = {}

export const LiveBoardNodeMapping = {
    frame: 'frame',
    image: 'image',
    sticky_note: 'sticky_note',
}
export type LiveBoardNodeType = typeof LiveBoardNodeMapping[keyof typeof LiveBoardNodeMapping]

export interface LiveBoardObject {
    type: LiveBoardNodeType,
    id: string,
    parentId?: string,
    title?: string,
    cardName?: string,
    content?: string,
}

export interface LiveBoardData {
    time: string,
    nodes: { [id: string]: LiveBoardObject },
}

export interface LiveBoardRecordingStates {
    sessionId?: string,
    isRecording: boolean,
    startTime?: string,
}

export const LiveBoardActionMapping = {
    SELECTED: 'SELECTED',
    CREATE: 'CREATE',
    MOVED: 'MOVED',
    UPDATED: 'UPDATED',
    DELETED: 'DELETED',
}
export type LiveBoardActionType = typeof LiveBoardActionMapping[keyof typeof LiveBoardActionMapping]

export interface LiveBoardAction {
    time: string,
    type: LiveBoardActionType,
    message: string,
    frame?: string,
    node: LiveBoardObject,
}