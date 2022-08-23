import * as React from "react";
import {DISPATCH_TYPES, useStore} from "../../store/store";
import shallow from "zustand/shallow";
import {
    fetchAnalyses, fetchDeckDetail,
    fetchSessionDetail,
    fetchSnapShotDetail,
    fetchSnapshots
} from "../../services/cardographer-platform";
import {useEffect, useState} from "react";
import {sleep} from "../../utils/helpers/Util";
import {CDGCard, CDGDeck, CDGSession, CDGSnapshot} from "../../types/CardographerPlatformTypes";
import {analyseCAData, analyseCASnapshot, generateCAData} from "../../utils/helpers/CA";

interface ReportStageData {
    analyseName: string,
    sessionLength: number,
    snapshotLength: number,
    decksLength: number,
    cardsLength: number
}


const AnalyseSelection = () => {
    const {loginState, analyses, analyse} = useStore((state) => ({
        loginState: state.loginState,
        analyses: state.analyses,
        analyse: state.analyse,
    }), shallow)
    const dispatch = useStore((state) => state.dispatch)
    const [loading, setLoading] = useState(false)
    const [isReportStage, setIsReportStage] = useState(false)
    const [reportData, setReportData] = useState<ReportStageData | undefined>(undefined)
    const [error, setError] = useState(false)
    const [status, setStatus] = useState("")


    useEffect(() => {
        getAnalyses().then(() => {
            console.log("Complete session refresh")
        })
    }, [])


    const getAnalyses = async () => {
        if (!loginState.loginData) {
            setError(true)
            setStatus("You need to login first")
            return
        }
        setStatus("Downloading analysis list")
        setLoading(true)
        await sleep(500)
        const newAnalyses = await fetchAnalyses(loginState.loginData?.token)
        if (!newAnalyses) {
            setLoading(false)
            setError(true)
            setStatus("Error fetching analyses data")
            return
        }
        console.log('Fetched analyses', analyses)
        dispatch({
            type: DISPATCH_TYPES.SET_ANALYSES,
            payload: {
                analyses: newAnalyses
            }
        })
        setLoading(false)
        setError(false)
        setStatus("")
    }

    const fetchAllData = async (analyseID: string) => {
        if (!loginState.loginData) {
            setError(true)
            setStatus("You need to login first")
            return
        }
        setError(false)
        const token = loginState.loginData?.token

        // Step 1. Get selected analyse id
        console.log(`Fetch all data base on analyse ID: ${analyseID}`)
        const find = analyses.find(a => a._id === analyseID)
        if (!find) {
            console.log(`Selected analyse not found`)
            setError(true)
            setStatus("Selected analyse not found")
            return
        }
        dispatch(
            {
                type: DISPATCH_TYPES.SET_SELECTED_ANALYSE,
                payload: {
                    analyse: find
                }
            }
        )

        // Step 2. Download snapshot lists
        const snapshotIDs = find.snapshotIds
        setLoading(true)
        setStatus("Downloading snapshots overview")
        const snapshotBriefs = await fetchSnapshots(token)
        if (!snapshotBriefs) {
            console.log(`Error downloading snapshots data`)
            setError(true)
            setLoading(false)
            setStatus("Error downloading snapshots data")
            return
        }
        console.log('Downloaded snapshot briefs')
        dispatch(
            {
                type: DISPATCH_TYPES.SET_SNAPSHOT_BRIEFS,
                payload: {
                    snapshotBriefs: snapshotBriefs
                }
            }
        )

        // Step 3. Get details from the sessions of each snapshot
        const snapshots: CDGSnapshot[] = []
        const sessions: CDGSession[] = []
        const decks: CDGDeck[] = []
        let cards: CDGCard[] = []
        const selectedSnapshotBriefs = snapshotBriefs.filter(s => snapshotIDs.includes(s._id))
        for (let i = 0; i < selectedSnapshotBriefs.length; i++) {
            console.log(`Downloading session data (${i}/${selectedSnapshotBriefs.length})`)
            setStatus(`Downloading session data (${i}/${selectedSnapshotBriefs.length})`)
            await sleep(1000)
            const snapshotBrief = selectedSnapshotBriefs[i]
            const sessionId = snapshotBrief.sessionId

            // Snapshot (Board Data)
            console.log(`Downloading snapshot data ${sessionId}`)
            const snapshot = await fetchSnapShotDetail(token, sessionId)
            if (!snapshot) {
                console.log(`Error downloading data`)
                setError(true)
                setLoading(false)
                setStatus("Error downloading data")
                return
            }
            snapshots.push(snapshot)

            // Session
            console.log(`Downloading session detail data ${sessionId}`)
            const session = await fetchSessionDetail(token, sessionId)
            if (!session) {
                console.log(`Error downloading data`)
                setError(true)
                setLoading(false)
                setStatus("Error downloading data")
                return
            }
            sessions.push(session)

            // Deck data of session
            const deckBriefs = session.decks
            for (const deckBrief of deckBriefs) {
                const {deckId, revision} = deckBrief
                const exist = decks.find(d => d.deckId === deckId && d.revision === revision)
                if (exist) {
                    console.log(`Skipped fetched deck ${deckId} -> ${revision}`)
                    continue
                }
                // Deck
                console.log(`Downloading deck data ${deckId} => ${revision}`)
                const deck = await fetchDeckDetail(token, deckId, revision.toString())
                if (!deck) {
                    console.log(`Error downloading data`)
                    setError(true)
                    setLoading(false)
                    setStatus("Error downloading data")
                    return
                }
                decks.push(deck)

                // Card
                cards = [...cards, ...deck.cards]

            }
        }


        console.log('-----SUMMARY-----')
        // console.log('snapshots', snapshots)
        // console.log('sessions', sessions)
        // console.log('decks', decks)
        // console.log('cards', cards)
        const caData = generateCAData(sessions, snapshots, decks)
        const caSnapshots = caData.snapshots
        const analysedSnapshots = caSnapshots.map(s => {
            return analyseCASnapshot(s)
        })
        const analysedCards = analyseCAData(analysedSnapshots)
        // console.log('caSnapshots', caData.snapshots)
        // console.log('caDecks', caData.decks)
        // console.log('caCards', caData.cards)
        // console.log('analysedSnapshots', analysedSnapshots)
        console.log('analysedCards', analysedCards)
        console.log('finished')
        dispatch({
            type: DISPATCH_TYPES.FETCHED_ALL_DATA,
            payload: {
                snapshotBriefs: snapshotBriefs,
                snapshots: snapshots,
                sessions: sessions,
                decks: decks,
                cards: cards,
                caSnapshots: caData.snapshots,
                caDecks: caData.decks,
                caCards: caData.cards,
                caAnalysedSnapshots: analysedSnapshots,
                caAnalysedCards: analysedCards,
            }
        })
        setReportData({
            analyseName: find.name,
            snapshotLength: snapshots.length,
            sessionLength: sessions.length,
            decksLength: decks.length,
            cardsLength: cards.length
        })
        setLoading(false)
        setIsReportStage(true)
    }

    const exitReportStage = () => {
        setReportData(undefined)
        setIsReportStage(false)
    }

    const analysesList = isReportStage ?
        <div className="flex flex-col">
            <div className="mb-4 font-bold">Successfully downloaded snapshots data:</div>
            <div className="ml-4">{reportData?.snapshotLength} snapshots</div>
            <div className="ml-4">{reportData?.sessionLength} sessions</div>
            <div className="ml-4">{reportData?.decksLength} decks</div>
            <div className="ml-4">{reportData?.cardsLength} cards</div>
            <button
                onClick={exitReportStage}
                className="mt-3 border border-transparent bg-cardographerThemeBG text-sm font-montserrat font-bold text-gray-200 rounded-md shadow-md px-4 hover:bg-blue-500">Okay
            </button>
        </div>
        :
        analyses.length > 0 ?
            analyses.map(a => {
                const label = a._id === analyse?._id ? `${a.name} (In Use)` : a.name
                const buttonText = a._id === analyse?._id ? 'Refresh' : `Use`
                const aDiv = <div className="flex flex-row justify-around">
                    <div className="w-4/6 ">{label}</div>
                    <button
                        onClick={() => fetchAllData(a._id)}
                        className="w-2/6 border border-transparent bg-gray-400 text-gray-200 font-bold font-montserrat rounded-md shadow-md hover:bg-gray-700 hover:text-gray-200">
                        {buttonText}
                    </button>
                </div>

                return <div key={a._id} className="w-full">
                    {aDiv}
                    <hr className="w-full my-4"/>
                </div>
            })
            : <div
                className=" text-cardographerThemeBG font-light grow flex flex-col items-center justify-center">You
                have no analyses
                saved yet</div>


    return (
        <div className="grow flex flex-col items-center">
            {/*<button*/}
            {/*    onClick={getAnalyses}*/}
            {/*    disabled={loading}*/}
            {/*    className="mt-7 border border-transparent bg-cardographerThemeBG text-sm font-montserrat font-bold text-gray-200 rounded-md shadow-md px-4 hover:bg-blue-500">Refresh*/}
            {/*    List*/}
            {/*</button>*/}
            {error || loading ?
                <div className="grow flex flex-col items-center justify-center">
                    <div
                        className="w-16 h-16 border-4 border-cardographerThemeBG border-solid rounded-full animate-spin border-t-transparent"></div>
                    <div className="mt-4 font-lg font-bold font-montserrat">{status}</div>
                </div>
                : null
            }

            {!loading ?
                <div className="grow mt-5 w-11/12 flex flex-col text-sm">
                    <div className="mt-4 mb-1 font-bold text-sm text-gray-600">Saved Analyses</div>
                    <hr className="my-4"/>
                    {analysesList}
                    <div className="w-full mt-8 mb-3 flex flex-col items-end">
                        <a className="float-right mr-5 text-xs text-gray-600 cursor-pointer" href="https://google.com"
                           target="_blank">What is Analyse File</a>
                        <a className="float-right mr-5 text-xs text-gray-600 cursor-pointer" href="https://google.com"
                           target="_blank">How to create Analyse File</a>
                    </div>
                </div>
                : null
            }

        </div>
    )

}

export default React.memo(AnalyseSelection)