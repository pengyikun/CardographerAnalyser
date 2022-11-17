/**
 * Typings that parse and re-organized data from Cardographer Platform
 */

export interface CDGSnapshotBrief {
    _id: string,
    sessionId: string,
    sessionName: string,
    sessionDescription: string,
    sessionCredits: string,
    sessionType: string,
    originallyCreated: string,
    snapshotDescription: string,
}

export interface CDGAnalyse {
    "_id": string,
    "name": string,
    "description": string,
    "credits": string,
    "created": string,
    "lastModified": string,
    "owners": string[],
    "isPublic": boolean,
    "snapshotIds": string[],
    "regions": string[]
}

export interface CDGSnapshot {
    "_id": string,
    "sessionId": string,
    "sessionName": string,
    "sessionDescription": string,
    "sessionCredits": string,
    "sessionType": string,
    "originallyCreated": string,
    "snapshotDescription": string,
    "owners": string[],
    "created": string,
    "isPublic": boolean,
    "isNotForAnalysis": boolean,
    "legacyId": string,
    data: MiroBoardData
}

export interface CDGSession {
    "_id": string,
    "name": string,
    "description": string,
    "credits": string,
    "owners": string[],
    "created": string,
    "lastModified": string,
    "isPublic": boolean,
    "isTemplate": boolean,
    "isArchived": boolean,
    "sessionType": string,
    "decks": CDGDeckBrief []
}

export interface CDGDeckBrief {
    "deckCredits": string,
    "deckId": string,
    "deckName": string,
    "revision": number
}

export interface CDGDeck {
    "_id": string,
    "cardCount": number,
    "created": string,
    "deckId": string,
    "deckName": string,
    "deckDescription": string,
    "slug": string,
    "isLocked": boolean,
    "isPublic": boolean,
    "isTemplate": boolean,
    "isUsable": boolean,
    "lastModified": string,
    "revision": number,
    cards: CDGCard[],
    defaults: any,
    propertyDefs: any,
    deckCredits: string,
    revisionDescription: string,
    revisionName: string,
    build: any,
    output: any,
    isCurrent: any
}

export interface CDGCard {
    "id": string,
    "revision": number,
    "created": string,
    "lastModified": string,
    "name": string,
    "description": string,
    "category": string,
    "back": string,
    "frontFile": string,
    "frontUrl": string,
}

export interface MiroUserImage {
    big: string,
    medium: string,
    small: string,
    image: string
}


export interface MiroUser {
    id: string,
    name: string,
    email: string,
    picture: MiroUserImage
}

export interface MiroLastModifyingUser {
    id: string,
    name: string,
    picture: MiroUserImage
}

export interface MiroBoardImage {
    big: string,
    medium: string,
    small: string,
    image: string
}

export interface MiroWidgetBounds {
    "x": number,
    "y": number,
    "top": number,
    "left": number,
    "bottom": number,
    "right": number,
    "width": number,
    "height": number,
}

export interface MiroWidgetStyle {
    backgroundColor: string
}

export interface MiroBoardWidget {
    id: string,
    type: string,
    bounds: MiroWidgetBounds,
    style: MiroWidgetStyle,
    metadata: { [key: string]: any },
    capabilities: { [key: string]: any },
    clientVisible: boolean,
    createdUserId: string,
    lastModifiedUserId: string,
    "x": number,
    "y": number,
    "width": number,
    "height": number,
    "title": string,
    "frameIndex": number,
    childrenIds?: string[],
    url?: string,
    content?: string,
}

export interface MiroBoardData {
    id: string,
    title: string,
    description: string,
    owner: MiroUser,
    picture: MiroBoardImage,
    currentUserPermissions: string[],
    lastModifyingUser: MiroLastModifyingUser,
    lastViewedByMeDate: string,
    modifiedByMeDate: string,
    createdAt: string,
    updatedAt: string,
    widgets: MiroBoardWidget[],
    _id: string,
}

