import * as React from "react";
import {useStore} from "../../store/store";
import shallow from "zustand/shallow";


const BotBar = () => {
    const {
        versionId,
    } = useStore((state) => ({
        versionId: state.versionId,
    }), shallow)
    return <div
        className="flex-shrink-0 w-full h-6  bg-gray-200 text-sm flex flex-col items-center justify-center">
        <div className="w-full text-xs text-gray-600">
            <span className="ml-2">Version {versionId}</span>
            <a className="cursor-pointer mr-5 float-right" href="https://alvin-peng-1.gitbook.io/cardographer-analyser/"
               target="_blank">FAQ</a>
            <a className="cursor-pointer mr-5 float-right" href="https://alvin-peng-1.gitbook.io/cardographer-analyser/"
               target="_blank">About</a>
        </div>
    </div>
}

export default React.memo(BotBar)