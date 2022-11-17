/**
 * Constants for main-page types and sub-page types
 */

export const PAGE_TYPES = {
    HOME: "Home Page",
    LOGIN: "Cardographer Login",
    SETTINGS: "Settings",
    ANALYZE_SELECTION: "Analyse Import",
    CARD_ANALYZE: "Card Analyser",
    FRAME_ANALYZE: "Frame Analyser",
    DEBRIEF: "Session Debrief",
    ABOUT: "About Cardographer",
    ERROR: "Error Page",
}

export type PageType = typeof PAGE_TYPES[keyof typeof PAGE_TYPES]


export const ANALYZE_PAGE_TYPES: { [k: string]: string } = {
    'BASIC': "Basic",
    'COMBINATIONS': "Combinations",
    'FRAME': "Frame",
    'ADDITIONAL': "Ideas",
}

export type AnalyzePageType = typeof PAGE_TYPES[keyof typeof PAGE_TYPES]


export const FRAME_ANALYZE_PAGE_TYPES: { [k: string]: string } = {
    'BASIC': "Basic",
    'CARDS': "Cards",
    'COMBINATIONS': "Combinations",
}

export type FrameAnalyzePageType = typeof PAGE_TYPES[keyof typeof PAGE_TYPES]

export const DEBRIEF_PAGE_TYPES: { [k: string]: string } = {
    'SUMMARY': "Summary",
    'RECORDER': "Recorder",
}

export type DebriefPageType = typeof DEBRIEF_PAGE_TYPES[keyof typeof DEBRIEF_PAGE_TYPES]
