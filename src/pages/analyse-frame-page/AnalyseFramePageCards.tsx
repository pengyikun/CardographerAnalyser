import * as React from "react";
import {
    CACardAnalyse,
    PostProcessedFrameAnalysis
} from "../../types/ProcessedDataTypes";
import {CardAnalysisDataBox} from "../../components/CardAnalysisDataBox/CardAnalysisDataBox";
import {FrameCardUsageChart} from "../../components/chart/FrameCardUsageChart";
import {nanoid} from "nanoid";

interface AnalyseFramePageCardsProps {
    focusedFrameAnalysis: PostProcessedFrameAnalysis,
    sortedHistoricalCardsAnalysis: { card: CACardAnalyse, count: number }[],
}


export let AnalyseFramePageCards = (props: AnalyseFramePageCardsProps) => {
    const {
        focusedFrameAnalysis,
        sortedHistoricalCardsAnalysis,
    } = props

    const historicalCardsUsage = focusedFrameAnalysis.historicalAnalysis.map(u => {
        return {
            ...u,
            usedCardCount: u.combinations.length,
        }
    })
    return (
        <div className='grow'>
            <div className="flex flex-col justify-center">
                <FrameCardUsageChart usage={historicalCardsUsage}/>
                <div className="w-full flex flex-row flex-wrap">
                    <CardAnalysisDataBox title="Used Card"
                                         dataFontSize='text-md'
                                         titleFontSize='text-xs'
                                         data={sortedHistoricalCardsAnalysis.length.toString()}
                    />
                    <CardAnalysisDataBox title="Unused Card"
                                         dataFontSize='text-md'
                                         titleFontSize='text-xs'
                                         data={focusedFrameAnalysis.unusedCard.length.toString()}
                    />
                </div>
                <div className="mt-3 flex flex-col">
                    <div className="mb-2 font-bold text-md text-gray-600">Previously used cards</div>
                    <div className="flex flex-row font-bold font-montserrat text-xs text-cardographerThemeBG">
                        <div className="w-10/12">
                            Card
                        </div>
                        <div className="w-2/12">
                            Count
                        </div>
                    </div>
                    <hr className="my-2"/>
                    {sortedHistoricalCardsAnalysis.length > 0 ?
                        sortedHistoricalCardsAnalysis.map((item) => {
                            const {card, count} = item
                            return <div key={nanoid(5)}>
                                <div className="w-full flex flex-row">
                                    <div className="w-10/12 font-light text-sm">
                                        {card.name}
                                    </div>
                                    <div className="w-2/12 flex flex-col justify-center items-center">
                                    <span
                                        className="float-right font-bold  text-sm">{count}</span>
                                    </div>
                                </div>
                                <hr className="mt-1 mb-2"/>
                            </div>
                        })
                        :
                        <div
                            className="w-full flex flex-row items-center justify-center text-md font-light text-gray-500">No
                            cards</div>
                    }
                </div>
                <div className="my-2 font-bold text-md text-gray-600">Unused cards</div>
                <div className="border border-gray-200 rounded-md">
                    <div className='flex flex-row flex-wrap '>
                        {focusedFrameAnalysis.unusedCard.map((card) => {
                            return <div key={nanoid(5)}
                                        className="text-xs font-bold text-cardographerThemeBG border-transparent rounded-md bg-gray-200 m-2 px-3">{card.name}</div>
                        })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}