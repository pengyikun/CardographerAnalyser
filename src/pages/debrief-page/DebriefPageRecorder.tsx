import React from "react";
import {DISPATCH_TYPES, useStore} from "../../store/store";
import shallow from "zustand/shallow";
import {useEffect, useRef} from "react";
import {CardAnalysisDataBox} from "../../components/CardAnalysisDataBox/CardAnalysisDataBox";


const DebriefPageRecorder = () => {
    const {liveBoardActions, lbdRecordingState, dispatch} = useStore((store) => ({
        liveBoardActions: store.liveBoardActions,
        lbdRecordingState: store.lbdRecordingState,
        dispatch: store.dispatch,
    }), shallow);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollIntoView({
                block: "nearest",
                inline: "center",
                behavior: "smooth"
            });
        }
    }, [liveBoardActions.length]);

    const clearActions = () => {
        dispatch({
            type: DISPATCH_TYPES.CLEAR_ACTIONS,
            payload: {},
        })
    }

    const startRecording = () => {
        dispatch({
            type: DISPATCH_TYPES.START_RECORDING,
            payload: {
                recordingSessionId: "Test001",
            },
        })
    }

    const stopRecording = () => {
        dispatch({
            type: DISPATCH_TYPES.STOP_RECORDING,
            payload: {},
        })
    }

    const selectionCount = liveBoardActions.filter(action => action.type === "SELECTED").length;
    const createCount = liveBoardActions.filter(action => action.type === "CREATE").length;
    const moveCount = liveBoardActions.filter(action => action.type === "MOVED").length;
    const deleteCount = liveBoardActions.filter(action => action.type === "DELETED").length;
    const updateCount = liveBoardActions.filter(action => action.type === "UPDATED").length;

    return (
        <div className="grow flex flex-col items-center">
            {/*<span className="font-montserrat font-bold text-md">Coming soon</span>*/}
            <div className="w-full mt-5 flex flex-row flex-wrap">
                <CardAnalysisDataBox title="Selection"
                                     dataFontSize='text-md'
                                     titleFontSize='text-xs'
                                     data={selectionCount.toString()}
                />
                <CardAnalysisDataBox title="Move"
                                     dataFontSize='text-md'
                                     titleFontSize='text-xs'
                                     data={moveCount.toString()}
                />
                <CardAnalysisDataBox title="Create"
                                     dataFontSize='text-md'
                                     titleFontSize='text-xs'
                                     data={createCount.toString()}
                />
                <CardAnalysisDataBox title="Update"
                                     dataFontSize='text-md'
                                     titleFontSize='text-xs'
                                     data={updateCount.toString()}
                />
                <CardAnalysisDataBox title="Delete"
                                     dataFontSize='text-md'
                                     titleFontSize='text-xs'
                                     data={deleteCount.toString()}
                />
            </div>
            <div
                className="mt-3 rounded-md border border-1-cardographerThemeBG w-full h-52 max-h-52 flex flex-col overflow-y-scroll text-xs">
                {
                    liveBoardActions.map((action, index) => (
                        <div key={index} className="mt-2 flex flex-row justify-center">
                            <span className="w-2/12">{action.time}</span>
                            <span className="w-9/12">{action.message}</span>
                        </div>
                    ))

                }
                <div ref={listRef}/>
            </div>
            {!lbdRecordingState.isRecording ?
                <button onClick={startRecording}
                        className="mt-3 px-2 rounded-md shadow-md border border-transparent bg-cardographerThemeBG text-gray-200
                font-bold font-montserrat text-md hover:bg-red-400">
                    Start Recording
                </button>
                : <div className="w-full flex flex-row justify-evenly">
                    <button onClick={clearActions}
                            className="mt-3 px-2 rounded-md shadow-md border border-transparent bg-cardographerThemeBG text-gray-200
                font-bold font-montserrat text-md hover:bg-red-400">
                        Reset Actions
                    </button>
                    <button onClick={stopRecording}
                            className="mt-3 px-2 rounded-md shadow-md border border-transparent bg-cardographerThemeBG text-gray-200
                font-bold font-montserrat text-md hover:bg-red-400">
                        Stop Recording
                    </button>
                </div>
            }
        </div>
    )

}

export default React.memo(DebriefPageRecorder)