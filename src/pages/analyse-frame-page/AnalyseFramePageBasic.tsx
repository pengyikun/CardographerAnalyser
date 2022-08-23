import * as React from "react";
import {BoardFrame, BoardFrameRaw} from "../../types/MiroBoard";

import {
    CACardAnalyse,
    CASnapshotAnalyse,
    FrameCombinationAnalysis,
    PostProcessedFrameAnalysis
} from "../../types/ProcessedDataTypes";
import {CDGCard} from "../../types/CardographerPlatformTypes";

import {CardAnalysisDataBox} from "../../components/CardAnalysisDataBox/CardAnalysisDataBox";
import {nanoid} from "nanoid";

interface FrameAnalysePageBasicProps {
    boardData: { [p: string]: BoardFrame },
    cards: CDGCard[],
    caAnalysedSnapshots: CASnapshotAnalyse[],
    focusedFrameData: BoardFrameRaw,
    focusedFrameAnalysis: PostProcessedFrameAnalysis,
    sortedHistoricalCardsAnalysis: { card: CACardAnalyse, count: number }[],
    mostUsedCard: { card: CACardAnalyse, count: number }[],
    sortedHistoricalCombinationAnalysis: FrameCombinationAnalysis[],
    mostOccurredFrameCombination: FrameCombinationAnalysis[],
}


const FrameAnalysePageBasic = (props: FrameAnalysePageBasicProps) => {
    const {
        boardData,
        cards,
        caAnalysedSnapshots,
        focusedFrameData,
        focusedFrameAnalysis,
        sortedHistoricalCardsAnalysis,
        mostOccurredFrameCombination,
        mostUsedCard,
        sortedHistoricalCombinationAnalysis
    } = props

    const frameData = boardData[focusedFrameData.id]

    // Current child cards
    const childCardsDiv = frameData.cards.length !== 0 ?
        frameData.cards.map(cardId => {
            const card = cards.find(c => c.id === cardId)
            return card ?
                <div key={nanoid(5)}
                     className="text-xs font-bold text-cardographerThemeBG border-transparent rounded-md bg-gray-200 m-2 px-3">{card.name}</div>
                :
                <div key={nanoid(5)}
                     className="text-xs font-bold text-cardographerThemeBG border-transparent rounded-md bg-gray-200 m-2 px-3">{cardId}(unknown)</div>
        })
        :
        <div
            className="w-full  flex flex-row flex-wrap items-center justify-center ">
            <span className="py-2 font-light text-xs text-gray-500">No child cards</span></div>

    // Current child ideas
    const childIdeasDiv = frameData.stickyNotes.length > 0 ?
        frameData.stickyNotes.map(note => {
            return <div key={nanoid(5)}
                        className="text-xs font-bold text-cardographerThemeBG border-transparent rounded-md bg-gray-200 m-2 px-3 break-all">{note}</div>
        })
        :
        <div
            className="w-full  flex flex-row flex-wrap items-center justify-center ">
            <span className="py-2 font-light text-xs text-gray-500">No child sticky-notes</span></div>


    const mostUsedCardDiv = mostUsedCard.length !== 0 ?
        mostUsedCard.map(item => {
            const {card} = item
            return <div key={nanoid(5)}
                        className="text-xs font-bold text-cardographerThemeBG border-transparent rounded-md bg-gray-200 m-2 px-3">{card.name}</div>
        })
        :
        <div
            className="w-full  flex flex-row flex-wrap items-center justify-center">
            <span className="py-2 font-light text-xs text-gray-500">No Cards</span></div>


    const mostOccurredFrameCombinationDiv = mostOccurredFrameCombination.length !== 0 ?
        mostOccurredFrameCombination.map(combination => {
            const cardElements = combination.combinations.map((card) => {
                return (
                    <div key={nanoid(5)}
                         className="text-xs font-bold text-cardographerThemeBG border-transparent rounded-md bg-gray-200 m-2 px-3">{card.name}</div>
                )
            })
            return (
                <div key={nanoid(5)}
                     className="w-full mb-2 flex flex-row flex-wrap items-center border border-gray-200 rounded-md">{cardElements}</div>
            )
        })
        :
        <div
            className="w-full mb-2 flex flex-row flex-wrap items-center justify-center border border-gray-200 rounded-md">
            <span className="py-2 font-light text-xs text-gray-500">No Combinations</span></div>

    return (
        <div className='grow'>
            <div className="mb-2 font-bold text-md text-gray-800">Current Information</div>
            <div className="flex flex-col">
                <div className="font-bold text-sm text-gray-600">Cards</div>
                <div className="flex flex-row flex-wrap">
                    <div
                        className="w-full mb-2 flex flex-row flex-wrap items-center border border-gray-200 rounded-md">{childCardsDiv}</div>
                </div>
                <div className="font-bold text-sm text-gray-600">Ideas</div>
                <div className="flex flex-row flex-wrap">
                    <div
                        className="w-full mb-2 flex flex-col flex-wrap items-center border border-gray-200 rounded-md">{childIdeasDiv}</div>
                </div>
            </div>
            <div className="my-4"/>
            <div className="my-2 font-bold text-md text-gray-800">Historical Statistics</div>
            <div className="flex flex-col justify-center text-sm">
                <div className="w-full flex flex-col border border-1 border-transparent rounded-md  ">
                    <span className='font-bold text-sm text-gray-600'>Most occurred combination</span>
                    {mostOccurredFrameCombinationDiv}
                </div>
                <div className="w-full flex flex-col mb-2 border border-1 border-transparent rounded-md  ">
                    <span className='font-bold text-sm text-gray-600'>Most used child card</span>
                    <div
                        className="w-full mb-2 flex flex-row flex-wrap items-center border border-gray-200 rounded-md">{mostUsedCardDiv}</div>
                </div>
                <div className="w-full flex flex-row flex-wrap">
                    <CardAnalysisDataBox title="Use Rate"
                                         data={`${((focusedFrameAnalysis.usedCount / caAnalysedSnapshots.length) * 100).toFixed(2)}%`}
                    />
                    <CardAnalysisDataBox title="Combinations"
                                         data={sortedHistoricalCombinationAnalysis.length.toString()}
                    />
                    <CardAnalysisDataBox title="Cards"
                                         data={sortedHistoricalCardsAnalysis.length.toString()}
                    />

                </div>

            </div>
        </div>
    )
}

export default React.memo(FrameAnalysePageBasic)