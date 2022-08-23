import * as React from "react";
import {useStore} from "../../store/store";
import shallow from "zustand/shallow";
import {useState} from "react";
import DebriefPageRecorder from "./DebriefPageRecorder";
import {AnalyzePageType, DEBRIEF_PAGE_TYPES} from "../../types/PageType";
import DebriefPageMenu from "./AnalysePageMenu";
import DebriefPageSummary from "./DebriefPageSummary";


const DebriefPage = () => {
    const {
        liveBoardActions,
        lbdRecordingState,
        boardData,
        caDecks,
        caCards,
        caAnalysedCards,
        caAnalysedSnapshots,
    } = useStore((store) => ({
        liveBoardActions: store.liveBoardActions,
        lbdRecordingState: store.lbdRecordingState,
        boardData: store.boardData,
        caDecks: store.caDecks,
        caCards: store.caCards,
        caAnalysedSnapshots: store.caAnalysedSnapshots,
        caAnalysedCards: store.caAnalysedCards,
    }), shallow);

    const [page, setPage] = useState<AnalyzePageType>(DEBRIEF_PAGE_TYPES.SUMMARY)


    let content;

    if (page === DEBRIEF_PAGE_TYPES.SUMMARY) {
        content = <DebriefPageSummary
            liveBoardActions={liveBoardActions}
            lbdRecordingState={lbdRecordingState}
            boardData={boardData}
            caDecks={caDecks}
            caCards={caCards}
            caAnalysedCards={caAnalysedCards}
            caAnalysedSnapshots={caAnalysedSnapshots}
        />
    } else if (page === DEBRIEF_PAGE_TYPES.RECORDER) {
        content = <DebriefPageRecorder/>
    } else {
        content = <div>Page does not exists</div>
    }


    return (
        <div className="grow flex flex-col items-center">
            <div className="w-11/12 grow flex flex-col items-center">
                <DebriefPageMenu page={page} setPage={setPage}/>
                {content}
            </div>
        </div>
    )

}

export default React.memo(DebriefPage)