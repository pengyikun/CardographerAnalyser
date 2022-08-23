import * as React from "react";
import {AnalyzePageType, DEBRIEF_PAGE_TYPES} from "../../types/PageType";

interface AnalysePageMenuProps {
    page: AnalyzePageType,
    setPage: (pageType: AnalyzePageType) => void
}

const DebriefPageMenu = (props: AnalysePageMenuProps) => {
    const {page, setPage} = props

    let
        content = Object.keys(DEBRIEF_PAGE_TYPES).map(type => {
            const name = DEBRIEF_PAGE_TYPES[type]
            if (name === page) {
                return <div key={name}
                            className="w-1/2 h-full cursor-pointer rounded-sm py-1 text-center font-bold transition ease-in-out delay-30 bg-gray-400 hover:bg-gray-500">{name}</div>
            }
            return <div key={name} onClick={() => setPage(name)}
                        className="w-1/2 h-full cursor-pointer rounded-sm py-1 text-center transition ease-in-out delay-30  hover:bg-gray-500">{name}</div>
        })

    return <div
        className="w-full m-4  font-bold bg-gray-300 rounded-sm flex flex-row text-xs justify-evenly items-center text-gray-800">
        {content}
    </div>
}

export default React.memo(DebriefPageMenu)