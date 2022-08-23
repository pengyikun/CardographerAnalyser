import * as React from "react";
import {DISPATCH_TYPES, useStore} from "../../store/store";
import shallow from "zustand/shallow";
import {PAGE_TYPES} from "../../types/PageType";
import SessionExport from "../../components/session-export/SessionExport";


const SettingsPage = () => {
    const {
        loginState,
        dataFetchTime,
        snapshots,
        sessions,
        decks,
        cards,
        caSnapshots,
        caDecks,
        caCards,
        caAnalysedSnapshots,
        caAnalysedCards,
    } = useStore((state) => ({
        loginState: state.loginState,
        dataFetchTime: state.dataFetchTime,
        snapshots: state.snapshots,
        sessions: state.sessions,
        decks: state.decks,
        cards: state.cards,
        caSnapshots: state.caSnapshots,
        caDecks: state.caDecks,
        caCards: state.caCards,
        caAnalysedSnapshots: state.caAnalysedSnapshots,
        caAnalysedCards: state.caAnalysedCards,

    }), shallow)
    const dispatch = useStore((state) => state.dispatch)
    const [isExportPanelOpen, setIsExportPanelOpen] = React.useState(false)

    const logout = () => {
        dispatch({
            type: DISPATCH_TYPES.RESET,
            payload: {}
        })
        dispatch(
            {
                type: DISPATCH_TYPES.LOGOUT,
                payload: {}
            }
        )
    }

    const reset = () => {
        dispatch({
            type: DISPATCH_TYPES.RESET,
            payload: {}
        })

        dispatch(
            {
                type: DISPATCH_TYPES.SET_PAGE,
                payload: {
                    page: PAGE_TYPES.SETTINGS
                }
            }
        )
    }

    // const analysedSnapshots = caSnapshots.map(s => {
    //     return analyseCASnapshot(s)
    // })
    // const analysedCards = analyseCAData(analysedSnapshots)
    // console.log(analysedCards)
    console.log(caAnalysedSnapshots)

    return (
        <div className="grow flex flex-col items-center justify-center">
            <SessionExport isOpen={isExportPanelOpen} toggleExportPanel={setIsExportPanelOpen}/>
            {/*<div className="fixed top-0 left-0 w-full h-full bg-red-200"/>*/}
            <div className="grow mt-5 w-11/12 flex flex-col text-sm">
                <div className="font-bold text-md text-gray-500 mb-3">Login Information</div>
                <div className="w-full flex flex-row">
                    <div className="w-2/6 font-bold">Email</div>
                    <div className="w-3/6 font-light">{loginState.loginData?.email}</div>
                </div>
                <hr className="my-2"/>
                <div className="w-full flex flex-row">
                    <div className="w-2/6 font-bold">Login Time</div>
                    <div className="w-3/6 font-light">{loginState.loginData?.loggedInTime}</div>
                </div>
                <hr className="my-2"/>
                <div className="w-11/12 my-4 flex flex-row items-center justify-evenly">
                    <button
                        onClick={logout}
                        className="px-4 py-1 w-1/3 rounded-md shadow-md border border-transparent bg-cardographerThemeBG text-gray-200 font-bold font-montserrat text-md hover:bg-red-400">
                        Log out
                    </button>
                </div>
                <div className="pt-4 font-bold text-md text-gray-500 mb-3">Saved Data Overview</div>
                <div className="w-full flex flex-row">
                    <div className="w-2/6 font-bold">Data Date</div>
                    <div className="w-3/6 font-light">{dataFetchTime}</div>
                </div>
                <hr className="my-2"/>
                <div className="w-full flex flex-row">
                    <div className="w-2/6 font-bold"> Snapshots</div>
                    <div className="w-3/6 font-light">{snapshots.length}</div>
                </div>
                <hr className="my-2"/>
                <div className="w-full flex flex-row">
                    <div className="w-2/6 font-bold"> Sessions</div>
                    <div className="w-3/6 font-light">{sessions.length}</div>
                </div>
                <hr className="my-2"/>
                <div className="w-full flex flex-row">
                    <div className="w-2/6 font-bold"> Decks</div>
                    <div className="w-3/6 font-light">{decks.length}</div>
                </div>
                <hr className="my-2"/>
                <div className="w-full flex flex-row">
                    <div className="w-2/6 font-bold"> Cards</div>
                    <div className="w-3/6 font-light">{cards.length}</div>
                </div>
                <hr className="my-2"/>
                <div className="w-full flex flex-row">
                    <div className="w-2/6 font-bold"> CA Data</div>
                    <div
                        className="w-3/6 font-light">{caSnapshots.length}:{caDecks.length}:{caCards.length}:{caAnalysedSnapshots.length}:{caAnalysedCards.size === undefined ? 'NA' : caAnalysedCards.size}
                    </div>
                </div>
                <hr className="my-2"/>
                <div className="w-11/12 mt-4 flex flex-row items-center justify-evenly">
                    <button
                        onClick={() => setIsExportPanelOpen(true)}
                        className="px-4 py-1 rounded-md shadow-md border border-transparent bg-cardographerThemeBG text-gray-200 font-bold font-montserrat text-md hover:bg-red-400">
                        Export Session
                    </button>
                    <button
                        onClick={reset}
                        className="px-4 py-1 rounded-md shadow-md border border-transparent bg-cardographerThemeBG text-gray-200 font-bold font-montserrat text-md hover:bg-red-400">
                        Clear Data
                    </button>
                </div>
            </div>

        </div>
    )

}

export default React.memo(SettingsPage)