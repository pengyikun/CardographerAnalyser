import * as React from "react";
import {
    CACard,
    CACardAnalyseOverview, CACardIdeaOverview,
    CASnapshotAnalyse,
    CurrentCardData,
    PostProcessedCardAnalysis
} from "../../types/ProcessedDataTypes";
import {CardAnalysisDataBox} from "../../components/CardAnalysisDataBox/CardAnalysisDataBox";
import {nanoid} from "nanoid";
import {IdeaChart} from "../../components/chart/IdeaChart";
import {byPropertiesOf} from "../../utils/helpers/sort";
import {parseStickyNoteContent} from "../../utils/helpers/Util";

interface AnalysePageIdeaProps {
    focusedCardData: CurrentCardData,
    focusedCardAnalysis: PostProcessedCardAnalysis,
    caAnalysedSnapshots: CASnapshotAnalyse[],
    caAnalysedCards: Map<string, CACardAnalyseOverview>,
    caCards: CACard[],
}


export let AnalysePageIdea = (props: AnalysePageIdeaProps) => {
    const {focusedCardAnalysis} = props

    //console.log(focusedCardAnalysis)

    // const historicalIdeaData: CACardAnalyse[] = caAnalysedSnapshots.map(snapshot => {
    //     return snapshot.analysedCards.get(focusedCardData.card.id)
    // }).filter(cardAnalyse => cardAnalyse !== undefined) as CACardAnalyse[]
    // console.log(historicalIdeaData)
    console.log(focusedCardAnalysis.ideas)
    const sortedIdea = focusedCardAnalysis.ideas.sort(byPropertiesOf<CACardIdeaOverview>(['count'])).reverse()


    return (
        <div className='grow'>
            <div className="my-1 font-bold text-md text-gray-800">Idea count from past sessions</div>
            <IdeaChart usage={focusedCardAnalysis.historicalAnalysis}/>

            <div className="flex flex-col justify-center">
                <div className="w-full flex flex-row flex-wrap">
                    <CardAnalysisDataBox title="Total Ideas"

                                         data={(focusedCardAnalysis.ideas.length).toString()}
                    />
                    <CardAnalysisDataBox title="Average Ideas"

                                         data={(focusedCardAnalysis.ideas.length / focusedCardAnalysis.historicalAnalysis.length).toFixed(2).toString()}
                    />
                </div>
                {/*<div className="mb-2 font-bold text-xs text-gray-500">Combination count by snapshots</div>*/}

                {/*<div className="mb font-bold text-xs text-gray-500">Combination summary</div>*/}
                <div className="mt-3 mb-1 font-bold text-md text-gray-800">Idea Summary</div>
                <div className="mt-3 flex flex-col">
                    <div className="flex flex-row font-bold text-xs text-cardographerThemeBG">
                        <div className="w-8/12">
                            Idea
                        </div>
                        <div className="w-8/12">
                            Frame
                        </div>
                        <div className="w-2/12">
                            Count
                        </div>
                    </div>
                    <hr className="my-2"/>
                    {sortedIdea.map((idea) => {
                        return <div key={nanoid(5)}
                        >
                            <div className="w-full flex flex-row text-sm">
                                <div className="w-8/12 flex flex-row flex-wrap break-all">
                                    {parseStickyNoteContent(idea.content)}
                                </div>
                                <div className="w-8/12">
                                    {idea.parentFrameName}
                                </div>
                                <div className="w-2/12 flex flex-col justify-center items-center">
                                    <span
                                        className="float-right font-bold  text-sm">{idea.count}</span>
                                </div>
                            </div>
                            <hr className="mt-1 mb-2"/>
                        </div>
                    })
                    }
                </div>
            </div>

        </div>
    )
}