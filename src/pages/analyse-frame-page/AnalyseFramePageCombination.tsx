import * as React from "react";
import {
    CASnapshotAnalyse,
    FrameCombinationAnalysis,

} from "../../types/ProcessedDataTypes";
import {CardAnalysisDataBox} from "../../components/CardAnalysisDataBox/CardAnalysisDataBox";
import {FramePageCombinationChart} from "../../components/chart/FramePageCombinationChart";
import {nanoid} from "nanoid";

interface AnalyseFramePageCombinationProps {
    caAnalysedSnapshots: CASnapshotAnalyse[],
    sortedHistoricalCombinationAnalysis: FrameCombinationAnalysis[],
}


export let AnalyseFramePageCombination = (props: AnalyseFramePageCombinationProps) => {
    const {
        caAnalysedSnapshots,
        sortedHistoricalCombinationAnalysis
    } = props

    const combinationData = sortedHistoricalCombinationAnalysis.map(c => {
        return {
            ...c,
            content: c.combinations.map(cn => cn.name).join(', '),
            title: `${c.combinations.length} cards`,
        }
    })

    return (
        <div className='grow'>
            <div className="flex flex-col justify-center">
                <div className="w-full rounded-md border border-1-gray-100 flex flex-col items-center justify-center">
                    <div className="w-full">
                        <span className="ml-3 text-xs font-bold text-gray-500">History combination occurrence</span>
                    </div>
                    {combinationData.length > 0 ?
                        <FramePageCombinationChart usage={combinationData}/>
                        :
                        <div className="h-52 flex flex-col items-center justify-center font-light ">No
                            combinations</div>
                    }

                </div>
                <div className="mt-3 flex flex-col">
                    <div className="flex flex-row font-bold text-xs text-cardographerThemeBG">
                        <div className="w-10/12">
                            Combination
                        </div>
                        <div className="w-2/12">
                            Count
                        </div>
                    </div>
                    <hr className="my-2"/>
                    {sortedHistoricalCombinationAnalysis.map((combination) => {
                        return <div key={nanoid(3)}
                        >
                            <div className="w-full flex flex-row">
                                <div className="w-10/12 flex flex-row flex-wrap">
                                    {
                                        combination.combinations.length > 0 ?
                                            combination.combinations.map((card) => {
                                                return <div key={`${card.id}`}
                                                            className="flex flex-col items-center justify-center text-xs font-bold text-gray-700 bg-gray-200 rounded-md mr-2 mb-1 px-3">{card.name}</div>
                                            })
                                            :
                                            <div
                                                className="flex flex-col items-center justify-center text-xs font-bold text-gray-700 bg-gray-200 rounded-md mr-2 mb-1 px-3">Self</div>
                                    }
                                </div>
                                <div className="w-2/12 flex flex-col justify-center items-center">
                                    <span
                                        className="float-right font-bold  text-sm">{combination.count}</span>
                                </div>
                            </div>
                            <hr className="mt-1 mb-2"/>
                        </div>
                    })
                    }
                </div>
                <div className="w-full flex flex-row flex-wrap">
                    <CardAnalysisDataBox title="Total"

                                         data={sortedHistoricalCombinationAnalysis.length.toString()}
                    />
                    <CardAnalysisDataBox title="Average"

                                         data={(sortedHistoricalCombinationAnalysis.length / caAnalysedSnapshots.length).toFixed(2).toString()}
                    />
                </div>
            </div>
        </div>
    )
}