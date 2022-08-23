import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowPointer} from "@fortawesome/free-solid-svg-icons";
import * as React from "react";


export let AnalysePageIdle = () => {
    return (
        <div className="h-full">
            <div className="flex flex-col h-screen items-center justify-center">
                <div className="h-72 mb-10 flex flex-col align-middle justify-center text-center">
                    <FontAwesomeIcon icon={faArrowPointer} className="fa-2xl mb-2"/>
                    <div className="text-cardographerThemeBG text-md">Select a card to analyse</div>
                </div>
            </div>
        </div>
    )
}