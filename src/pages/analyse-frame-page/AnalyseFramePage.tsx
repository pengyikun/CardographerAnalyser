import * as React from "react";
import {useStore} from "../../store/store";
import shallow from "zustand/shallow";
import AnalyseFramePageIdle from "./AnalyseFramePageIdle";
import {useState} from "react";
import {AnalyzePageType, FRAME_ANALYZE_PAGE_TYPES} from "../../types/PageType";
import FrameAnalysePageMenu from "./FrameAnalysePageMenu";
import AnalyseFramePageBasic from "./AnalyseFramePageBasic";
import {
    getMostOccurredFrameCombinations,
    getMostUsedCardFromAnalysis,
    getSortedCardByUsage,
    getSortedFrameCombinations
} from "../../utils/helpers/CA";
import {AnalyseFramePageCards} from "./AnalyseFramePageCards";
import {AnalyseFramePageCombination} from "./AnalyseFramePageCombination";


const AnalyseFramePage = () => {
    const {
        boardData, cards, caAnalysedSnapshots, focusedFrameData, focusedFrameAnalysis
    } = useStore((state) => ({
        boardData: state.boardData,
        cards: state.cards,
        caAnalysedSnapshots: state.caAnalysedSnapshots,
        focusedFrameData: state.focusedFrameData,
        focusedFrameAnalysis: state.focusedFrameAnalysis,
    }), shallow)
    const [page, setPage] = useState<AnalyzePageType>(FRAME_ANALYZE_PAGE_TYPES.BASIC)


    if (!boardData || !focusedFrameData || !focusedFrameAnalysis) {
        return <AnalyseFramePageIdle/>
    }

    const historicalCardsAnalysis = Object.entries(focusedFrameAnalysis.cardUsageAnalysis).map(([_, cardAnalysis]) => {
        return cardAnalysis
    })
    const sortedHistoricalCardsAnalysis = getSortedCardByUsage(historicalCardsAnalysis).reverse()
    const mostUsedCard = getMostUsedCardFromAnalysis(sortedHistoricalCardsAnalysis)
    const sortedHistoricalCombinationAnalysis = getSortedFrameCombinations(focusedFrameAnalysis.combinationAnalysis).reverse().filter(c => c.combinations.length !== 0)
    const mostOccurredFrameCombination = getMostOccurredFrameCombinations(sortedHistoricalCombinationAnalysis)

    let pageContent;

    if (page === FRAME_ANALYZE_PAGE_TYPES.BASIC) {
        pageContent =
            <AnalyseFramePageBasic boardData={boardData} cards={cards}
                                   caAnalysedSnapshots={caAnalysedSnapshots}
                                   focusedFrameAnalysis={focusedFrameAnalysis}
                                   focusedFrameData={focusedFrameData}
                                   sortedHistoricalCardsAnalysis={sortedHistoricalCardsAnalysis}
                                   mostUsedCard={mostUsedCard}
                                   sortedHistoricalCombinationAnalysis={sortedHistoricalCombinationAnalysis}
                                   mostOccurredFrameCombination={mostOccurredFrameCombination}
            />
    } else if (page === FRAME_ANALYZE_PAGE_TYPES.CARDS) {
        pageContent =
            <AnalyseFramePageCards
                focusedFrameAnalysis={focusedFrameAnalysis}
                sortedHistoricalCardsAnalysis={sortedHistoricalCardsAnalysis}
            />
    } else if (page === FRAME_ANALYZE_PAGE_TYPES.COMBINATIONS) {
        pageContent =
            <AnalyseFramePageCombination
                caAnalysedSnapshots={caAnalysedSnapshots}
                sortedHistoricalCombinationAnalysis={sortedHistoricalCombinationAnalysis}
            />
    } else {
        pageContent = <div className="grow flex flex-col items-center justify-center">
            <span className="font-montserrat font-bold text-md">Coming soon</span>
        </div>
    }


    return (
        <div className="h-full w-full mt-3 flex flex-col items-center">
            <div className="w-11/12 grow flex flex-col">
                <div className="w-full mb-2 text-2xl font-montserrat font-bold">
                    {focusedFrameData.name}
                </div>
                <FrameAnalysePageMenu page={page} setPage={setPage}/>

                {pageContent}

            </div>
        </div>
    )

}

export default React.memo(AnalyseFramePage)