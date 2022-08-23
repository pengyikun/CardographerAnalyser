import * as React from "react";
import {useEffect, useState} from "react";
import {getCurrentTime} from "../../utils/helpers/Util";
import {useStore} from "../../store/store";
import shallow from "zustand/shallow";
import {
    addSessionToAnalysis,
    fetchAnalysisDetail,
    fetchDeckList,
    fetchSnapshots,
    updateSessionDecks,
    uploadSession
} from "../../services/cardographer-platform";


const SessionExport = (props: { isOpen: boolean; toggleExportPanel: (isOpen: boolean) => void }) => {
    const {
        decks,
        loginState,
        analyse
    } = useStore((state) => ({
        decks: state.decks,
        loginState: state.loginState,
        analyse: state.analyse,
    }), shallow)
    const {isOpen, toggleExportPanel} = props;
    const [deckList, setDeckList] = useState<{ _id: string, deckName: string }[]>([]);
    const [sessionName, setSessionName] = useState<string>("");
    const [sessionDescription, setSessionDescription] = useState<string>(`Session export time ${getCurrentTime()}`);
    const [sessionDeckIds, setSessionDeckIds] = useState<string[]>([]);
    const [sessionUpdateAnalysis, setSessionUpdateAnalysis] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<string | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);


    // useEffect(() => {
    //     (async () => {
    //         const analysisDetail = await fetchAnalysisDetail(loginState.loginData?.token!, analyse?._id!);
    //         console.log(analysisDetail)
    //     })()
    //
    // }, [])


    useEffect(() => {
        if (!isOpen) {
            return
        }
        // setSessionDescription(`Session export time ${getCurrentTime()}`);
        console.log("Fetching deck list");
        (async () => {
                const dl = await fetchDeckList(loginState.loginData?.token!);
                if (dl) {
                    console.log("Use merged deck list", dl)
                    setDeckList(
                        [
                            ...decks,
                            ...(dl.filter((deck) => decks.find(d => d._id === deck._id) === undefined))
                        ]
                    );
                } else {
                    console.log("Used session deck only")
                    setDeckList(decks)
                }
            }
        )()
    }, [isOpen])

    const toggleDeckToGroup = (deckId: string) => {
        console.log(deckId);
        if (sessionDeckIds.includes(deckId)) {
            setSessionDeckIds(sessionDeckIds.filter(id => id !== deckId))
        } else {
            setSessionDeckIds([...sessionDeckIds, deckId])
        }
    }

    const downloadCurrentSnapshot = async (upload?: boolean) => {
        setStatusMessage(undefined)
        if (sessionName === "" || sessionDeckIds.length === 0) {
            console.log('missing input field')
            setErrorMessage("Please fill in session name and decks");
            return;
        }
        setErrorMessage(undefined);
        const boardInfo = await miro.board.getInfo()
        const widgets = await miro.board.get()
        const sessionData = {
            title: sessionName,
            description: sessionDescription,
            _id: `download:${boardInfo.id}:${Date.now()}`,
            ...boardInfo,
            widgets: widgets,
        }
        console.log(sessionData)
        if (!upload) {
            const blob = new Blob([JSON.stringify(sessionData)], {type: 'application/json'})
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `Miro ${boardInfo.id} ${new Date().toISOString().replaceAll(':', '-').slice(0, -5)}Z.json`
            link.click()
            setStatusMessage("Exported session to local file")
        } else {
            const uploadSessionRes = await uploadSession(loginState.loginData?.token!, [sessionData])
            if (uploadSessionRes) {
                const sessionId = uploadSessionRes.sessions.find(session => session.name === sessionName)?._id
                const updateDeckRes = await updateSessionDecks(loginState.loginData?.token!, sessionId!, sessionDeckIds)
                if (updateDeckRes) {
                    setStatusMessage(`Session ${sessionName} uploaded`)
                    if (sessionUpdateAnalysis) {
                        const analysisDetail = await fetchAnalysisDetail(loginState.loginData?.token!, analyse?._id!);
                        if (analysisDetail) {
                            const snapshots = await fetchSnapshots(loginState.loginData?.token!)
                            const snapshot = snapshots?.find(snapshot => snapshot.sessionId === sessionId)
                            if (snapshot) {
                                const updateAnalysisRes = await addSessionToAnalysis(loginState.loginData?.token!, snapshot._id, analysisDetail)
                                if (updateAnalysisRes) {
                                    setStatusMessage(`Session ${sessionName} uploaded, Added to analysis`)
                                } else {
                                    setErrorMessage("Failed updating analysis")
                                }
                            } else {
                                setErrorMessage("Failed finding snapshot")
                            }
                        } else {
                            setErrorMessage("Failed adding snapshot to analysis")
                        }
                    }
                } else {
                    setErrorMessage("Failed to update session decks")
                }
            } else {
                setErrorMessage("Failed to upload session")
            }
        }
    }


    return (
        <div
            className={`${!isOpen ? 'hidden' : null} fixed top-0 left-0 w-screen h-screen bg-gray-800 bg-opacity-80 flex flex-col items-center justify-center overflow-y-auto`}>
            <div className="w-11/12 bg-gray-200 flex flex-col  rounded-md shadow-md">
                <div className="w-full mt-5">
                    <span className="font-bold font-montserrat ml-4 text-xl">Session Export</span>
                    <span onClick={() => toggleExportPanel(false)}
                          className="cursor-pointer font-light font-montserrat text-xl float-right mr-5">X</span>
                </div>

                <div className="mt-5 grow flex flex-col items-center">
                    <div
                        className={`w-11/12 flex flex-row items-center justify-center break-all text-xs font-bold text-blue-500 text-sm font-light ${statusMessage === undefined ? 'hidden' : 'block'}`}>{statusMessage}</div>
                    <div
                        className={`w-11/12 flex flex-row items-center justify-center break-all text-xs font-bold text-red-600 text-sm font-light ${errorMessage === undefined ? 'hidden' : 'block'}`}>{errorMessage}</div>
                    <div className="w-11/12">
                        <label htmlFor="session_name"
                               className="block mb-2 text-sm font-medium text-gray-900">Session
                            Name</label>
                        <input type="text" id="session_name"
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                               placeholder="Session Name" value={sessionName}
                               onChange={e => setSessionName(e.target.value)}/>
                    </div>
                    <div className="w-11/12 mt-2">
                        <label htmlFor="session_description"
                               className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                        <textarea id="session_description"
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                  placeholder="Brief description about the session (Optional)"
                                  onChange={e => setSessionDescription(e.target.value)}/>
                    </div>
                    <div className="w-11/12 mt-2">
                        <div className="block mb-2 text-sm font-medium text-gray-900 float-left">Decks</div>
                    </div>
                    <div className="w-11/12 h-24 bg-gray-50 rounded overflow-y-scroll">
                        <div className="flex flex-col items-center justify-center">
                            {
                                deckList.map((deck) => {
                                    return <div key={deck._id} onClick={() => toggleDeckToGroup(deck._id)}
                                                className="w-11/12 cursor-pointer">
                                        <div
                                            className={`mt-2 px-4 text-sm font-light flex flex-col items-center justify-center border rounded ${sessionDeckIds.includes(deck._id) ? 'border-2 border-purple-400' : 'border-1 border-gray-400'}`}>{deck.deckName}</div>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                    <div className="w-11/12 mt-2 flex flex-row items-center">
                        <div
                            className="w-3/6 text-sm font-medium text-gray-900">Update Analysis
                        </div>
                        <input type="checkbox" id="update_analysis"
                               className="w-12 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                               checked={sessionUpdateAnalysis}
                               onChange={e => setSessionUpdateAnalysis(e.target.checked)}/>


                    </div>
                    <div className="w-full flex flex-row justify-evenly items-center">
                        <button
                            onClick={() => downloadCurrentSnapshot(true)}
                            className="my-8 w-1/3 rounded-md shadow-md border border-transparent bg-cardographerThemeBG text-gray-200 font-bold font-montserrat text-md hover:bg-red-400">
                            Upload
                        </button>
                        <button
                            onClick={() => downloadCurrentSnapshot(false)}
                            className="my-8 w-1/3 rounded-md shadow-md border border-transparent bg-cardographerThemeBG text-gray-200 font-bold font-montserrat text-md hover:bg-red-400">
                            Export
                        </button>
                    </div>

                </div>

            </div>
        </div>
    )

}

export default React.memo(SessionExport)