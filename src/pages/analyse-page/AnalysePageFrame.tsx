import * as React from "react";
import {CurrentCardData, PostProcessedCardAnalysis} from "../../types/ProcessedDataTypes";
import {FrameChart} from "../../components/chart/FrameChart";
import {BoardFrame} from "../../types/MiroBoard";
import {CardAnalysisDataBox} from "../../components/CardAnalysisDataBox/CardAnalysisDataBox";
import {nanoid} from "nanoid";
import {CardFrameBarChart} from "../../components/chart/CardFrameBarChart";

interface AnalysePageFrameProps {
    focusedCardData: CurrentCardData,
    focusedCardAnalysis: PostProcessedCardAnalysis,
    cardAnalysis: PostProcessedCardAnalysis,
    boardData: { [frameId: string]: BoardFrame },
}


export let AnalysePageFrame = (props: AnalysePageFrameProps) => {
    const {cardAnalysis, focusedCardData, focusedCardAnalysis} = props
    console.log(focusedCardAnalysis)
    let currentFrameUsageRate = "0%"
    const currentFrame = focusedCardAnalysis.sortedFrames.find(f => f.name === focusedCardData.parentFrame)
    if (currentFrame) {
        currentFrameUsageRate = `${Math.round((currentFrame.count / cardAnalysis.historicalAnalysis.length) * 100)}%`
    }

    return (
        <div className='grow'>
            <div className="flex flex-col justify-center">
                <div className="w-full flex flex-row flex-wrap">
                    <CardAnalysisDataBox title="Current Frame"
                                         dataFontSize='text-md'
                                         titleFontSize='text-xs'
                                         data={focusedCardData.parentFrame}
                    />
                    <CardAnalysisDataBox title="Usage Rate"
                                         dataFontSize='text-md'
                                         titleFontSize='text-xs'
                                         data={currentFrameUsageRate}
                    />
                </div>
                {
                    cardAnalysis.sortedFrames.length > 2 ?
                        <FrameChart usage={cardAnalysis}/>
                        :
                        <CardFrameBarChart usage={cardAnalysis}/>
                }

                <div className="mt-3 flex flex-col">
                    <div className="flex flex-row font-bold font-montserrat text-sm text-cardographerThemeBG">
                        <div className="w-10/12">
                            Frame
                        </div>
                        <div className="w-2/12">
                            Count
                        </div>
                    </div>
                    <hr className="my-2"/>
                    {cardAnalysis.sortedFrames.slice().reverse().map((frame) => {
                        return <div key={nanoid(5)}>
                            <div className="w-full flex flex-row">
                                <div className="w-10/12 font-light text-sm">
                                    {frame.name}
                                </div>
                                <div className="w-2/12 flex flex-col justify-center items-center">
                                    <span
                                        className="float-right font-bold  text-sm">{frame.count}</span>
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