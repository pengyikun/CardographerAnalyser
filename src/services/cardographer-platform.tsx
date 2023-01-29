/**
 * Fetch deck,card,snapshot,analyses and session data using API provided from Cardographer Platform
 */

import axios from "axios";
import {CDGAnalyse, CDGDeck, CDGSession, CDGSnapshot, CDGSnapshotBrief} from "../types/CardographerPlatformTypes";
import {BoardNode} from "@mirohq/websdk-types";

const endpoints = {
    snapshots: "https://cardographer.cs.nott.ac.uk/platform/api/user/snapshots/",
    analyses: "https://cardographer.cs.nott.ac.uk/platform/api/user/analyses",
    snapshot: "https://cardographer.cs.nott.ac.uk/platform/api/user/sessions/ssid/snapshot",
    session: "https://cardographer.cs.nott.ac.uk/platform/api/user/sessions/ssid",
    sessionDeck: "https://cardographer.cs.nott.ac.uk/platform/api/user/sessions/ssid/decks",
    importSession: "https://cardographer.cs.nott.ac.uk/platform/api/user/sessions/import",
    deck: "https://cardographer.cs.nott.ac.uk/platform/api/user/decks/did/rid",
    deckBriefs: "https://cardographer.cs.nott.ac.uk/platform/api/user/decks",
}

export const fetchSnapshots = async (token: string) => {
    const res = await axios.get(endpoints.snapshots, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const {status} = res
    if (status === 200) {
        const snapshots: CDGSnapshotBrief[] = res.data.values
        console.log(snapshots)
        return snapshots

    } else {
        console.log(`${status} Failed Fetching snapshots`)
        return null
    }
}

export const fetchAnalyses = async (token: string) => {
    const res = await axios.get(endpoints.analyses, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const {status} = res
    if (status === 200) {
        const analyses: CDGAnalyse[] = res.data.values
        console.log(analyses)
        return analyses

    } else {
        console.log(`${status} Failed Fetching analyses`)
        return null
    }
}

export const fetchSnapShotDetail = async (token: string, sessionId: string) => {
    const res = await axios.get(endpoints.snapshot.replace('ssid', sessionId), {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const {status} = res
    if (status === 200) {
        console.log(res)
        const snapshot: CDGSnapshot = res.data
        console.log(snapshot)
        return snapshot

    } else {
        console.log(`${status} Failed Fetching snapshot detail`)
        return null
    }
}

export const fetchSessionDetail = async (token: string, sessionId: string) => {
    const res = await axios.get(endpoints.session.replace('ssid', sessionId), {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const {status} = res
    if (status === 200) {
        const session: CDGSession = res.data
        console.log(session)
        return session

    } else {
        console.log(`${status} Failed Fetching session detail`)
        return null
    }
}

export const fetchDeckList = async (token: string) => {
    const res = await axios.get(endpoints.deckBriefs, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const {status} = res
    if (status === 200) {
        const decks: { _id: string, name: string, currentRevision: number }[] = res.data.decks
        console.log(decks)
        return decks.map(deck => {
            return {
                ...deck,
                _id: `${deck._id}:${deck.currentRevision}`,
                deckName: deck.name,
            }
        })

    } else {
        console.log(`${status} Failed Fetching deck list brief`)
        return null
    }
}

export const fetchDeckDetail = async (token: string, deckId: string, revisionId: string) => {
    const res = await axios.get(endpoints.deck.replace('did', deckId).replace('rid', revisionId), {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const {status} = res
    if (status === 200) {
        const deck: CDGDeck = res.data
        console.log(deck)
        return deck

    } else {
        console.log(`${status} Failed Fetching deck detail`)
        return null
    }
}


export const updateSessionDecks = async (token: string, sessionId: string, deckIds: string[]) => {
    try {
        const res = await axios.put(endpoints.sessionDeck.replace('ssid', sessionId),
            deckIds,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        const {status} = res
        if (status === 200) {
            const session: CDGSession = res.data
            console.log(session)
            return session

        } else {
            console.log(`${status} Failed Updating session decks`)
            return null
        }
    } catch (e) {
        console.log(e)
        return null
    }
}

export const uploadSession = async (token: string, sessionData: { widgets: BoardNode[], id: string, createdAt: string, updatedAt: string, title: string, description: string, _id: string }[]) => {
    try {
        const res = await axios.post(endpoints.importSession,
            sessionData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    //origin: 'https://cardographer.cs.nott.ac.uk'
                },
            })
        const {status} = res
        if (status === 200) {
            const data: { message: string, sessions: CDGSession[] } = res.data as { message: string, sessions: CDGSession[] }
            console.log(data)
            return data

        } else {
            console.log(`${status} Failed upload local session`)
            return null
        }
    } catch (e) {
        console.log(e)
        return null
    }
}

export const fetchAnalysisDetail = async (token: string, analysisId: string) => {
    const res = await axios.get(`${endpoints.analyses}/${analysisId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const {status} = res
    if (status === 200) {
        const analysis: CDGAnalyse = res.data
        console.log(analysis)
        return analysis

    } else {
        console.log(`${status} Failed Fetching analysis detail`)
        return null
    }
}

export const addSessionToAnalysis = async (token: string, snapshotId: string, analysis: CDGAnalyse) => {
    try {
        const res = await axios.put(`${endpoints.analyses}/${analysis._id}`,
            {
                ...analysis,
                snapshotIds: [...analysis.snapshotIds, snapshotId],
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        const {status} = res
        if (status === 200) {
            return true

        } else {
            console.log(`${status} Failed adding session to analysis`)
            return false
        }
    } catch (e) {
        console.log(e)
        return null
    }
}