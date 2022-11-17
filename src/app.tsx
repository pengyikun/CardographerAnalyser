import React, {useEffect} from "react";
import ReactDOM from 'react-dom';
import shallow from "zustand/shallow";
import {DISPATCH_TYPES, useStore} from "./store/store";
import {PAGE_TYPES} from "./types/PageType";
import {useSelection} from "./utils/hooks/useSelection";
import {
    diffLiveBoardData,
    getBoardData,
    getCardsFromSelection,
    getFrameFromSelection,
    getLiveBoardData,
    isCardCombinationEqual, sleep
} from "./utils/helpers/Util";
import LoginPage from './pages/login-page/LoginPage'
import AnalysePage from './pages/analyse-page/AnalysePage'
import ErrorPage from "./pages/error-page/ErrorPage";
import {Layout} from "./components/layout/Layout";
import HomePage from "./pages/home-page/HomePage";
import SettingsPage from "./pages/settings-page/SettingsPage";
import AnalyseSelection from "./pages/analyseSelection-page/AnalyseSelection";
import {
    analyseCAData,
    analyseCASnapshot, getCardHistoricalData,
    getMostOccurredCardCombinations, getMostOccurredCardFrames,
    getSortedCardCombinations,
    getSortedCardFrames
} from "./utils/helpers/CA";
import {Frame, Item} from "@mirohq/websdk-types";
import DebriefPage from "./pages/debrief-page/DebriefPage";
import AboutPage from "./pages/about-page/AboutPage";
import AnalyseFramePage from "./pages/analyse-frame-page/AnalyseFramePage";
import {CACard, CACardAnalyse, FrameCombinationAnalysis} from "./types/ProcessedDataTypes";
import {BoardCard, BoardFrameRaw} from "./types/MiroBoard";
import {fetchLatestVersionInfo, VersionInfo} from "./services/app_version";


export default function App() {
    const {selectedItems} = useSelection()
    const {
        versionId,
        page,
        cards,
        caSnapshots,
        caAnalysedCards,
        caAnalysedSnapshots,
        liveBoardData,
        lbdRecordingState,
    } = useStore((state) => ({
        versionId: state.versionId,
        versionDescription: state.versionDescription,
        loginState: state.loginState,
        page: state.page,
        cards: state.cards,
        boardData: state.boardData,
        caSnapshots: state.caSnapshots,
        caAnalysedCards: state.caAnalysedCards,
        caAnalysedSnapshots: state.caAnalysedSnapshots,
        liveBoardData: state.liveBoardData,
        lbdRecordingState: state.lbdRecordingState,
    }), shallow)
    const dispatch = useStore((state) => state.dispatch)

    // recover ui and data state on app opening
    // handles version update
    useEffect(() => {
        if (caAnalysedCards.size === undefined) {
            console.log('Recovering analysed cards data from local storage')
            recoverAnalysedData()
        }
        (async () => {
            let versionInfo: VersionInfo | undefined = undefined
            let fetchCount = 0
            while (!versionInfo) {
                fetchCount++
                versionInfo = await fetchLatestVersionInfo()
                if (!versionInfo) {
                    await sleep(3000)
                }
                if (fetchCount > 10) {
                    console.log('Failed to fetch version info')
                    break
                }
            }
            //await sleep(500)
            if (!versionInfo) {
                dispatch({
                    type: DISPATCH_TYPES.SET_NOTIFICATION_MESSAGE,
                    payload: {
                        notificationMessage: 'Failed to fetch version info, you might encounter issues with the app',
                    }
                })

            } else {
                //console.log(`Fetched version Info: ,`, versionInfo)
                if (versionInfo.versionId !== versionId) {
                    if (versionInfo.requireLogout) {
                        console.log('Update to new version, user logout required')
                        dispatch({
                            type: DISPATCH_TYPES.UPDATE_VERSION_INFO,
                            payload: {
                                versionId: versionInfo.versionId,
                                versionDescription: versionInfo.description,
                                notificationMessage: `Analyser updated to version ${versionInfo.versionId}, User logout is required for this update`,
                            }
                        })
                        dispatch({
                            type: DISPATCH_TYPES.LOGOUT,
                            payload: {}
                        })
                    } else if (versionInfo.requireDataReset) {
                        console.log('Update to new version, data reset required')
                        dispatch({
                            type: DISPATCH_TYPES.UPDATE_VERSION_INFO,
                            payload: {
                                versionId: versionInfo.versionId,
                                versionDescription: versionInfo.description,
                                notificationMessage: `Analyser updated to version ${versionInfo.versionId}, Data re-import is required for this update`,
                            }
                        })
                        dispatch({
                            type: DISPATCH_TYPES.RESET,
                            payload: {}
                        })
                    } else {
                        dispatch({
                            type: DISPATCH_TYPES.UPDATE_VERSION_INFO,
                            payload: {
                                versionId: versionInfo.versionId,
                                versionDescription: versionInfo.description,
                                notificationMessage: `Analyser updated to version ${versionInfo.versionId}`,
                            }
                        })
                    }
                }
            }
            //setIsVersionChecked(true)
        })()

    }, [])

    // handles cursor selected items update event
    useEffect(() => {
        (async () => {
            // Update board types every time user perform new selection
            const nodes = await miro.board.get({type: ['frame', 'image', 'sticky_note']})
            const board = await getBoardData(nodes)
            if (lbdRecordingState.isRecording) {
                const currentLiveBoardData = getLiveBoardData(nodes as Item[])
                const actions = liveBoardData ? diffLiveBoardData(liveBoardData, currentLiveBoardData) : undefined
                dispatch({
                    type: DISPATCH_TYPES.ADD_RECORDING_DATA,
                    payload: {
                        liveBoardData: currentLiveBoardData,
                        liveBoardActions: actions,
                    }
                })
            }
            if (selectedItems === undefined) {
                console.log('selectedItems is undefined')
                return
            }
            console.log('[App] Selected items: ', selectedItems)
            // Extract images from current selected items, and then parse the image into Card Object
            const selectedCards = getCardsFromSelection(selectedItems)
            const _focusedCard = selectedCards.length > 0 ? selectedCards[0] : undefined
            const selectedFrames = getFrameFromSelection(selectedItems)
            const _focusedFrame = selectedFrames.length > 0 ? selectedFrames[0] : undefined


            if (page === PAGE_TYPES.CARD_ANALYZE && _focusedCard !== undefined) {
                const cardAnalysis = await analyseSelectedCard(_focusedCard)
                dispatch({
                    type: DISPATCH_TYPES.FOCUSED_CARD_UPDATED,
                    payload: {
                        boardData: board,
                        focusedCardAnalysis: cardAnalysis?.cardAnalysis,
                        focusedCardData: cardAnalysis?.currentCardData,
                    }
                })
                return
            } else if (page === PAGE_TYPES.FRAME_ANALYZE) {
                let focusedFrame = _focusedFrame;
                if (_focusedFrame === undefined && _focusedCard && _focusedCard.parentId) {
                    const searchedParentFrame = await miro.board.getById(_focusedCard.parentId) as Item
                    const selectedCardParentFrames = getFrameFromSelection([searchedParentFrame])
                    focusedFrame = selectedCardParentFrames.length > 0 ? selectedCardParentFrames[0] : undefined
                }

                if (focusedFrame !== undefined) {
                    dispatch({
                        type: DISPATCH_TYPES.FOCUSED_FRAME_UPDATED,
                        payload: {
                            boardData: board,
                            focusedFrameData: focusedFrame,
                            focusedFrameAnalysis: analyseSelectedFrame(focusedFrame),
                        }
                    })
                    return
                }
            }
            console.log("[App] Update Board")
            dispatch({
                type: DISPATCH_TYPES.NO_SELECTED_ITEMS,
                payload: {
                    boardData: board,
                }
            })


        })();
    }, [selectedItems])

    // Recover (re-analyse) card data stored in local storage
    const recoverAnalysedData = () => {
        const analysedSnapshots = caSnapshots.map(s => {
            return analyseCASnapshot(s)
        })
        const analysedCards = analyseCAData(analysedSnapshots)
        dispatch({
            type: DISPATCH_TYPES.SET_CA_ANALYSED_CARDS,
            payload: {caAnalysedSnapshots: analysedSnapshots, caAnalysedCards: analysedCards}
        })
    }

    // Perform detail analyses on specific card
    const analyseSelectedCard = async (_focusedCard: BoardCard) => {
        const parentFrame = _focusedCard.parentId ? (await miro.board.getById(_focusedCard.parentId) as Frame).title : "No Parent"
        const analysis = caAnalysedCards.get(_focusedCard.name)
        console.log(analysis)
        if (!analysis) {
            console.log(`[app][analyseSelectedCard] card not found`)
            return
        }
        const sortedCombinations = getSortedCardCombinations(analysis.combinations)
        const sortedFrames = getSortedCardFrames(analysis.frames)
        const mostOccurredCombinations = getMostOccurredCardCombinations(sortedCombinations)
        const mostOccurredFrames = getMostOccurredCardFrames(sortedFrames)
        const historicalAnalysis = getCardHistoricalData(caAnalysedSnapshots, analysis)
        const _currentCardData = {
            parentFrame: parentFrame,
            parentFrameId: _focusedCard.parentId,
            card: analysis,
        }
        const _cardAnalysis = {
            ...analysis,
            sortedCombinations: sortedCombinations,
            sortedFrames: sortedFrames,
            mostOccurredCombinations: mostOccurredCombinations,
            mostOccurredFrames: mostOccurredFrames,
            historicalAnalysis: historicalAnalysis,
            usedCount: historicalAnalysis.length,
        }
        return {
            currentCardData: _currentCardData,
            cardAnalysis: _cardAnalysis,
        }
    }

    // Perform detail analyses on specific frame
    const analyseSelectedFrame = (_focusedFrame: BoardFrameRaw) => {
        const historicalData = caAnalysedSnapshots.map(snapshot => {
            const frameData = snapshot.analysedFrames.get(_focusedFrame.name)
            if (!frameData) {
                return null
            }
            return {
                snapshotId: snapshot.id,
                combinations: frameData.map(cardAnalysis => {
                    return cardAnalysis
                }),
                cards: snapshot.cards
            }
        }).filter(s => s !== null) as { snapshotId: string, combinations: CACardAnalyse[], cards: CACard[] }[]
        const frameUseCount = historicalData.filter(s => s.combinations.length > 0).length
        const frameCardsUsageAnalysis: { [cardId: string]: { card: CACardAnalyse, count: number } } = {}
        const frameCombinationAnalysis: FrameCombinationAnalysis[] = []
        historicalData.forEach(data => {
            if (data === null) {
                return
            }
            const {combinations} = data
            const index = frameCombinationAnalysis.findIndex(analysis => isCardCombinationEqual(analysis.combinations, combinations))
            if (index !== -1) {
                frameCombinationAnalysis[index].count++
            } else {
                frameCombinationAnalysis.push({
                    combinations: combinations,
                    count: 1
                })
            }
            combinations.forEach(card => {
                const cardUsage = frameCardsUsageAnalysis[card.id]
                if (cardUsage) {
                    cardUsage.count++
                    frameCardsUsageAnalysis[card.id] = cardUsage
                } else {
                    frameCardsUsageAnalysis[card.id] = {
                        card: card,
                        count: 1
                    }
                }
            })
        })
        const unusedCard = cards.filter(card => !frameCardsUsageAnalysis[card.id])
        return {
            cardUsageAnalysis: frameCardsUsageAnalysis,
            combinationAnalysis: frameCombinationAnalysis,
            historicalAnalysis: historicalData,
            unusedCard: unusedCard,
            usedCount: frameUseCount,
        }
    }


    let content;

    if (page === PAGE_TYPES.HOME) {
        content = <HomePage/>
    } else if (page === PAGE_TYPES.LOGIN) {
        content = <LoginPage/>
    } else if (page === PAGE_TYPES.ANALYZE_SELECTION) {
        content = <AnalyseSelection/>
    } else if (page === PAGE_TYPES.CARD_ANALYZE) {
        content = <AnalysePage/>
    } else if (page === PAGE_TYPES.FRAME_ANALYZE) {
        content = <AnalyseFramePage/>
    } else if (page === PAGE_TYPES.SETTINGS) {
        content = <SettingsPage/>
    } else if (page === PAGE_TYPES.DEBRIEF) {
        content = <DebriefPage/>
    } else if (page === PAGE_TYPES.ABOUT) {
        content = <AboutPage/>
    } else {
        content = <ErrorPage message="The page you are looking for is not found"/>
    }

    return <Layout>
        {content}
    </Layout>

}

ReactDOM.render(
    <App/>
    , document.getElementById('root'));
