import * as React from "react";
import {CombinationChart} from "../../components/chart/CombinationChart";
import {
    CACard,
    CACardAnalyseOverview,
    CASnapshotAnalyse,
    CurrentCardData,
    PostProcessedCardAnalysis
} from "../../types/ProcessedDataTypes";
import {CardAnalysisDataBox} from "../../components/CardAnalysisDataBox/CardAnalysisDataBox";
import {nanoid} from "nanoid";

interface AnalysePageCombinationProps {
    focusedCardData: CurrentCardData,
    focusedCardAnalysis: PostProcessedCardAnalysis,
    caAnalysedSnapshots: CASnapshotAnalyse[],
    caAnalysedCards: Map<string, CACardAnalyseOverview>,
    caCards: CACard[],
}


export let AnalysePageCombination = (props: AnalysePageCombinationProps) => {
    const {focusedCardAnalysis, focusedCardData, caCards} = props

    let cardsArray: string[] = []
    focusedCardAnalysis.combinations.forEach(combination => {
        cardsArray = [...cardsArray, ...combination.combinations.map(c => c.id)]
    })
    const cards = new Set(cardsArray)
    const unusedCards = caCards.filter(card => !cards.has(card.id) && card.id != focusedCardData.card.id)


    return (
        <div className='grow'>
            <div className="my-1 font-bold text-md text-gray-800">Combination count from past sessions</div>
            <CombinationChart usage={focusedCardAnalysis.historicalAnalysis}/>

            <div className="flex flex-col justify-center">
                <div className="w-full flex flex-row flex-wrap">
                    <CardAnalysisDataBox title="Used Cards"

                                         data={(cards.size + 1).toString()}
                    />
                    <CardAnalysisDataBox title="Unused Cards"

                                         data={unusedCards.length.toString()}
                    />
                </div>
                {/*<div className="mb-2 font-bold text-xs text-gray-500">Combination count by snapshots</div>*/}

                {/*<div className="mb font-bold text-xs text-gray-500">Combination summary</div>*/}
                <div className="mt-3 mb-1 font-bold text-md text-gray-800">Combination Summary</div>
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
                    {focusedCardAnalysis.sortedCombinations.slice().reverse().map((combination) => {
                        return <div key={nanoid(5)}
                        >
                            <div className="w-full flex flex-row">
                                <div className="w-10/12 flex flex-row flex-wrap">
                                    {
                                        combination.combinations.length > 0 ?
                                            combination.combinations.map((card) => {
                                                return <div key={nanoid(5)}
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
            </div>
            <div className="my-3 font-bold text-md text-gray-800">Cards that not used for combination</div>
            <div className="border border-gray-200 rounded-md">
                <div className='flex flex-row flex-wrap '>
                    {unusedCards.map((card) => {
                        return <div key={nanoid(5)}
                                    className="text-xs font-bold text-cardographerThemeBG border-transparent rounded-md bg-gray-200 m-2 px-3">{card.name}</div>
                    })
                    }
                </div>
            </div>
        </div>
    )
}