import * as React from "react";
import {useState} from "react";
import {AnalysePageIdle} from "./AnalysePageIdle";
import AnalysePageBasic from "./AnalysePageBasic";
import AnalysePageMenu from "./AnalysePageMenu";
import {ANALYZE_PAGE_TYPES, AnalyzePageType} from "../../types/PageType";
import {AnalysePageFrame} from "./AnalysePageFrame";
import {AnalysePageCombination} from "./AnalysePageCombination";
import {useStore} from "../../store/store";
import shallow from "zustand/shallow";
import {AnalysePageIdea} from "./AnalysePageIdea";


const AnalysePage = () => {
    const {
        boardData,
        caAnalysedSnapshots,
        focusedCardAnalysis,
        focusedCardData,
        caAnalysedCards,
        caCards,
        aiTextCompletionToken
    } = useStore((state) => ({
        caCards: state.caCards,
        caAnalysedSnapshots: state.caAnalysedSnapshots,
        focusedCardData: state.focusedCardData,
        focusedCardAnalysis: state.focusedCardAnalysis,
        boardData: state.boardData,
        caAnalysedCards: state.caAnalysedCards,
        aiTextCompletionToken: state.aiTextCompletionToken,
    }), shallow)

    const [page, setPage] = useState<AnalyzePageType>(ANALYZE_PAGE_TYPES.BASIC)

    console.log(focusedCardAnalysis)

    let pageContent
    if (!focusedCardData || !boardData || !focusedCardAnalysis || caAnalysedCards.size === undefined) {
        return <AnalysePageIdle/>
    } else if (page === ANALYZE_PAGE_TYPES.BASIC) {
        pageContent = <AnalysePageBasic boardData={boardData}
                                        focusedCardData={focusedCardData}
                                        focusedCardAnalysis={focusedCardAnalysis}
                                        caAnalysedSnapshots={caAnalysedSnapshots}
                                        caAnalysedCards={caAnalysedCards}
                                        aiTextCompletionToken={aiTextCompletionToken}
        />

    } else if (page === ANALYZE_PAGE_TYPES["FRAME"]) {
        pageContent = <AnalysePageFrame focusedCardData={focusedCardData}
                                        focusedCardAnalysis={focusedCardAnalysis}
                                        cardAnalysis={focusedCardAnalysis} boardData={boardData}/>
    } else if (page === ANALYZE_PAGE_TYPES["COMBINATIONS"]) {
        pageContent = <AnalysePageCombination
            caCards={caCards}
            focusedCardData={focusedCardData}
            focusedCardAnalysis={focusedCardAnalysis}
            caAnalysedSnapshots={caAnalysedSnapshots}
            caAnalysedCards={caAnalysedCards}/>
    } else if (page === ANALYZE_PAGE_TYPES["ADDITIONAL"]) {
        pageContent = <AnalysePageIdea
            caCards={caCards}
            focusedCardData={focusedCardData}
            focusedCardAnalysis={focusedCardAnalysis}
            caAnalysedSnapshots={caAnalysedSnapshots}
            caAnalysedCards={caAnalysedCards}/>
    } else {
        pageContent = <div className="grow flex flex-col items-center justify-center">
            <div className="font-montserrat font-bold text-sm">
                Coming soon
            </div>
        </div>
    }


    return (
        <div className="h-full w-full mt-3 flex flex-col items-center">
            <div className="w-11/12 grow flex flex-col">
                <div className="w-full mb-2 text-2xl font-montserrat font-bold">
                    {focusedCardData.card.name}
                </div>

                <AnalysePageMenu page={page} setPage={setPage}/>

                {pageContent}

            </div>
        </div>
    );
}

export default React.memo(AnalysePage)