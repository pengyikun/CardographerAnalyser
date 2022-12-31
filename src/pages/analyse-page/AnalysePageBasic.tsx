import * as React from "react";
import {BoardFrame} from "../../types/MiroBoard";
import {
    CACardAnalyseOverview,
    CASnapshotAnalyse, CurrentCardData,
    PostProcessedCardAnalysis
} from "../../types/ProcessedDataTypes";
import {CardAnalysisDataBox} from "../../components/CardAnalysisDataBox/CardAnalysisDataBox";
import {nanoid} from "nanoid";
import {useRef, useState} from "react";
import {getImageGeneration, getTextCompletion} from "../../services/openai";
import {AIImageGenerationResponse, AITextCompletionResponse} from "../../types/ai";

interface AnalysePageBasicProps {
    boardData: { [frameId: string]: BoardFrame }
    focusedCardData: CurrentCardData,
    focusedCardAnalysis: PostProcessedCardAnalysis,
    caAnalysedSnapshots: CASnapshotAnalyse[],
    caAnalysedCards: Map<string, CACardAnalyseOverview>,
    aiTextCompletionToken: string | undefined,
    aiImageGenerationToken: string | undefined,
}


const AnalysePageBasic = (props: AnalysePageBasicProps) => {
    const {
        boardData,
        focusedCardAnalysis,
        focusedCardData,
        caAnalysedCards,
        caAnalysedSnapshots,
        aiTextCompletionToken,
        aiImageGenerationToken
    } = props

    const [isRequestingAICompletion, setIsRequestingAICompletion] = useState(false)
    const [aiAssistantType, setAIAssistantType] = useState("Text")
    const [aiTextCompletionPrompt, setAiTextCompletionPrompt] = useState(`What are the factors to consider when designing a product with the concept of ${focusedCardData.card.name}?`)
    const [aiTextCompletionResult, setAiTextCompletionResult] = useState(``)
    const bottomRef = useRef<null | HTMLDivElement>(null)

    let frameElements = focusedCardAnalysis.mostOccurredFrames.map(frame => {
        return (
            <div key={nanoid(5)}
                 className="text-xs font-bold text-cardographerThemeBG border-transparent rounded-md bg-gray-200 text-gray-700 m-2 px-3">{frame.name}</div>
        )
    })
    // console.log(cardAnalysis.combinations)
    // console.log(cardAnalysis.sortedCombinations)
    let coOccCardElements = focusedCardAnalysis.mostOccurredCombinations.map(combination => {
        const cardElements = combination.combinations.length > 0 ?
            combination.combinations.map((card) => {
                return (
                    <div key={nanoid(5)}
                         className="text-xs font-bold text-cardographerThemeBG border-transparent rounded-md bg-gray-200 m-2 px-3">{card.name}</div>
                )
            })
            :
            <div
                className="text-xs font-bold text-cardographerThemeBG border-transparent rounded-md bg-gray-200 m-2 px-3">self</div>
        return (
            <div key={nanoid(5)}
                 className="w-full mb-2 flex flex-row flex-wrap items-center border border-gray-200 rounded-md">{cardElements}</div>
        )
    })

    let currentCombination;
    if (focusedCardData && focusedCardData.parentFrameId) {
        currentCombination = boardData[focusedCardData.parentFrameId].cards.map(name => {
            const card = caAnalysedCards.get(name)
            if (!card) {
                return null
            }
            return <div key={nanoid(5)}
                        className="mb-1 px-3 mr-1 text-xs text-gray-700 font-bold border border-gray-200 bg-gray-200 rounded-md">{card.name}</div>
        })
    }

    const onAICompletionPromptChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
        setAiTextCompletionPrompt(event.currentTarget.value)
    }

    const requestAITextCompletionResult = async () => {
        setAIAssistantType("Text")
        setIsRequestingAICompletion(true)
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});

        if (aiTextCompletionToken === undefined || aiTextCompletionToken === "") {
            setAiTextCompletionResult("Missing Language Model API Secret")
            setIsRequestingAICompletion(false)
            return
        }
        setAiTextCompletionResult("Generating result...")
        const response: AITextCompletionResponse | null = await getTextCompletion(aiTextCompletionToken, aiTextCompletionPrompt)
        console.log(`Got completion response`, response)
        if (!response || !response.choices || response.choices.length === 0) {
            setAiTextCompletionResult("Failed getting text completion result")
            setIsRequestingAICompletion(false)
            return
        }
        setAiTextCompletionResult(response.choices[0].text)
        setIsRequestingAICompletion(false)
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }

    const requestAIImageCompletionResult = async () => {
        setAIAssistantType('Image')
        setIsRequestingAICompletion(true)
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});

        if (aiImageGenerationToken === undefined || aiImageGenerationToken === "") {
            setAiTextCompletionResult("Missing Image Model API Secret")
            setIsRequestingAICompletion(false)
            return
        }
        setAiTextCompletionResult("Generating image...")
        const response: AIImageGenerationResponse | null = await getImageGeneration(aiImageGenerationToken, aiTextCompletionPrompt, 1, "256x256")
        console.log(`Got image generation response`, response)
        if (!response || !response.data || response.data.length === 0) {
            console.log('Failed generating image')
            setAiTextCompletionResult("Failed generating image")
            setIsRequestingAICompletion(false)
            return
        }
        console.log('Update result panel with image url ' + response.data[0].url)
        setAiTextCompletionResult(response.data[0].url)
        setIsRequestingAICompletion(false)
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }

    let aiResultDiv = <div
        className="w-full h-52 border-0 rounded-md bg-gray-300 flex flex-col items-center justify-center">
        <div
            className="w-16 h-16 border-4 border-cardographerThemeBG border-solid rounded-full animate-spin border-t-transparent"></div>
        <div className="mt-4 font-bold">Waiting for response...</div>
    </div>

    if (!isRequestingAICompletion) {
        switch (aiAssistantType) {
            case "Text":
                aiResultDiv = aiTextCompletionResult === "" ?
                    <div
                        className="w-full mt-2 h-80 whitespace-pre-line bg-gray-100 rounded-md border-0">
                        {aiTextCompletionResult}
                    </div>
                    :
                    <div
                        className="w-full mt-2 h-fit min-h-full whitespace-pre-line bg-gray-100 rounded-md border-0">
                        {aiTextCompletionResult}
                    </div>
                break
            case "Image":
                aiResultDiv = aiTextCompletionResult === "" ?
                    <div
                        className="w-full mt-2 h-80 whitespace-pre-line bg-gray-100 rounded-md border-0">
                        Error generating images
                    </div>
                    :
                    <div
                        className="w-full mt-2 h-fit min-h-full whitespace-pre-line bg-gray-100 rounded-md border-0">
                        <img src={aiTextCompletionResult}
                             className="w-full rounded-md"/>
                    </div>
                break
        }
    }


    const imageUrl = `https://cardographer.cs.nott.ac.uk/platform${focusedCardData.card.frontUrl}`
    return (
        <div className='grow'>
            <div className="mb-2 font-bold text-md">Current Information</div>
            <div className="flex flex-row justify-evenly">
                {/*<img src={focusedCard?.imageUrl} className="w-4/12 shadow-lg" alt="Image"/>*/}
                <div className="w-4/12"><img src={imageUrl} className="grow shadow-lg"
                                             alt="Image"/></div>
                <div className="w-7/12 flex flex-col text-sm font-light">
                    <div className="ml-5 mb-1 flex flex-row">
                        <div className="flex flex-col w-8/12">
                            <div className="font-bold text-xs text-gray-600">Deck</div>
                            <div className="font-light">{focusedCardData.card.deckName}</div>
                        </div>
                        <div className="flex flex-col w-5/12">
                            <div className="font-bold text-xs text-gray-600">Category</div>
                            <div className="font-light">{focusedCardData.card.category}</div>
                        </div>
                    </div>
                    <div className="ml-5 mb-1 flex flex-col">
                        <div className="font-bold text-xs text-gray-600">Description</div>
                        <div className="font-light">{focusedCardData.card.description}</div>
                    </div>
                    <div className="ml-5 mb-1 flex flex-col">
                        <div className="font-bold text-xs text-gray-600">Frame</div>
                        <div className="font-light">{focusedCardData.parentFrame}</div>
                    </div>
                    <div className="ml-5 flex flex-col">
                        <div className="font-bold text-xs text-gray-600">Combination</div>
                        <div
                            className="mt-1 font-light flex flex-row flex-wrap">{focusedCardData.parentFrame && boardData ?
                            currentCombination
                            : <div> Not Available</div>}</div>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col items-center justify-center">
                <hr className="w-10/12 mt-4 mb-3"/>
            </div>

            <div className="mb-2 font-bold text-md text-gray-800">Historical Information</div>
            <div className="flex flex-col justify-center text-sm">
                <div className="w-full flex flex-col mb-2 border border-1 border-transparent rounded-md  ">
                    <span className='font-bold text-gray-600'>Most occurred frame</span>
                    <div className="border border-gray-200 rounded-md">
                        <div className=' flex flex-row flex-wrap '>{frameElements}</div>
                    </div>

                </div>
                <div className="flex flex-col mb-2 border border-1 border-transparent rounded-md  ">
                    <span className=' font-bold text-gray-600'>Top combination</span>
                    <div className='flex flex-col'>{coOccCardElements}</div>
                </div>
                <span className='mb-2 font-bold text-gray-600'>General Stats</span>
                <div className="w-full flex flex-row flex-wrap">
                    <CardAnalysisDataBox title="Use Rate"
                                         data={`${((focusedCardAnalysis.historicalAnalysis.length / caAnalysedSnapshots.length) * 100).toFixed(2)}%`}
                    />
                    <CardAnalysisDataBox title="Combinations"
                                         data={focusedCardAnalysis.combinations.length.toString()}
                    />
                    <CardAnalysisDataBox title="Ideas"
                                         data={focusedCardAnalysis.ideas.length.toString()}
                    />
                    <CardAnalysisDataBox title="Discarded Rate"
                                         data={`${(((focusedCardAnalysis.historicalAnalysis.filter(a => a.frame.toLowerCase().includes("discarded")).length) / caAnalysedSnapshots.length) * 100).toFixed(2)}%`}
                    />
                </div>

            </div>
            <div className="mb-2 font-bold text-md text-gray-800">AI Assistant</div>
            <div className="flex flex-col justify-center text-sm">
                <div className="w-full flex flex-col mb-2 border border-1 border-transparent rounded-md  ">
                    <span className='font-bold text-gray-600'>Prompt</span>
                    <textarea rows={5} value={aiTextCompletionPrompt} onInput={onAICompletionPromptChange}
                              className="content-center text-center rounded-md border border-1 border-gray-300"/>
                    <div className="w-full mt-5 flex flex-row justify-between">
                        <button onClick={requestAITextCompletionResult}
                                className="w-36 h-14 bg-gray-300 rounded-md border-0  hover:bg-gray-500 hover:text-white">
                            <span className="">Text</span>
                        </button>
                        <button onClick={requestAIImageCompletionResult}
                                className="w-36 h-14 bg-gray-300 rounded-md border-0  hover:bg-gray-500 hover:text-white">
                            <span className="">Image</span>
                        </button>
                    </div>

                    <span className='my-2 font-bold text-gray-600'>Response</span>
                    {
                        aiResultDiv
                    }
                    <div ref={bottomRef}/>

                </div>
            </div>

        </div>
    )
}

export default React.memo(AnalysePageBasic)