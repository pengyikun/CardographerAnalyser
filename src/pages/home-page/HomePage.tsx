import * as React from 'react';
import {PAGE_TYPES, PageType} from "../../types/PageType";
import {
    faFileImport,
    faBarsStaggered,
    faCircleInfo,
    faDatabase,
    faGears,
    faIdCard,
    faDiamond,
    faBorderNone
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {DISPATCH_TYPES, useStore} from "../../store/store";
import shallow from "zustand/shallow";

// type HomePageProps = {
//     caSnapshots: CASnapshot[] | undefined,
//     loginState: LoginState,
// }

const HomePage = () => {
    const {
        notificationMessage, caSnapshots, loginState
    } = useStore((state) => ({
        notificationMessage: state.notificationMessage,
        caSnapshots: state.caSnapshots,
        loginState: state.loginState,
    }), shallow)
    const dispatch = useStore((state) => state.dispatch)

    const setPage = (page: PageType) => {
        dispatch({
            type: DISPATCH_TYPES.SET_PAGE,
            payload: {
                page: page
            }
        })
    }

    const closeNotification = () => {
        dispatch({
            type: DISPATCH_TYPES.SET_NOTIFICATION_MESSAGE,
            payload: {
                notificationMessage: undefined
            }
        })
    }

    let PageMaps: { [key: string]: any } = {
        "Analyse Card": {
            name: PAGE_TYPES.CARD_ANALYZE,
            icon: <FontAwesomeIcon icon={faDiamond} className="fa-2xl"/>
        },
        "Analyse Frame": {
            name: PAGE_TYPES.FRAME_ANALYZE,
            icon: <FontAwesomeIcon icon={faBorderNone} className="fa-2xl"/>
        },
        "Data Import": {
            name: PAGE_TYPES.ANALYZE_SELECTION,
            icon: <FontAwesomeIcon icon={faFileImport} className="fa-2xl"/>
        },
        "Session Debrief": {
            name: PAGE_TYPES.DEBRIEF,
            icon: <FontAwesomeIcon icon={faBarsStaggered} className="fa-2xl"/>
        },
        "Settings": {
            name: PAGE_TYPES.SETTINGS,
            icon: <FontAwesomeIcon icon={faGears} className="fa-2xl"/>
        },
        "About": {
            name: PAGE_TYPES.ABOUT,
            icon: <FontAwesomeIcon icon={faCircleInfo} className="fa-2xl"/>
        },


    }

    if (!loginState.isLoggedIn) {
        PageMaps = {
            "Login": {
                name: PAGE_TYPES.LOGIN,
                icon: <FontAwesomeIcon icon={faIdCard} className="fa-2xl"/>
            },
            "About": {
                name: PAGE_TYPES.ABOUT,
                icon: <FontAwesomeIcon icon={faCircleInfo} className="fa-2xl"/>
            },
        }
    } else if (caSnapshots?.length === 0) {
        PageMaps = {
            "Data Import": {
                name: PAGE_TYPES.ANALYZE_SELECTION,
                icon: <FontAwesomeIcon icon={faDatabase} className="fa-2xl"/>
            },
            "Settings": {
                name: PAGE_TYPES.SETTINGS,
                icon: <FontAwesomeIcon icon={faGears} className="fa-2xl"/>
            },
            "About": {
                name: PAGE_TYPES.ABOUT,
                icon: <FontAwesomeIcon icon={faCircleInfo} className="fa-2xl"/>
            },
        }
    }

    const c = Object.keys(PageMaps).map(elementName => {
        const data = PageMaps[elementName]
        return <div key={elementName}
                    onClick={() => setPage(data.name)}
                    className="cursor-pointer w-5/12 h-40 max-h-80 m-2 flex flex-col items-center justify-center text-gray-900
                    shadow-md rounded-lg transition ease-in-out delay-25 bg-gray-200 hover:bg-gray-400">
            <div
                className="flex flex-col justify-center items-center text-sm font-bold">
                {data.icon}
                <div className="mt-2">{elementName}</div>
            </div>
        </div>
    })

    return (
        <div className="grow font-montserrat flex flex-col items-center">
            {
                notificationMessage ?
                    <div
                        className="fixed h-full w-full bg-gray-700 bg-opacity-60 flex flex-col justify-center items-center ">
                        <div className="mb-20 w-11/12  bg-gray-200 flex flex-col  rounded-md shadow-md">
                            <div className="font-bold font-montserrat ml-4 mt-5">Update Notification</div>
                            <div className="mt-5 grow flex flex-col items-center">
                                <span className="w-11/12 font-light text-sm">{notificationMessage}</span>
                                <button
                                    onClick={closeNotification}
                                    className="my-8 w-1/2 rounded-md shadow-md border border-transparent bg-cardographerThemeBG text-gray-200 font-bold font-montserrat text-md hover:bg-red-400">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                    :
                    null
            }
            <div
                className="mt-10 w-11/12 overflow-auto rounded-md flex flex-wrap justify-evenly">
                {c}
            </div>
        </div>
    )
}

export default React.memo(HomePage)