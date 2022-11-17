import * as React from "react";
import logoSVG from '../../assets/images/logo.svg';
import {faBook} from "@fortawesome/free-solid-svg-icons";
import {faGithub, faDiscord} from "@fortawesome/free-brands-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useStore} from "../../store/store";
import shallow from "zustand/shallow";


const AboutPage = () => {
    const {
        versionId,
        versionDescription,
    } = useStore((state) => ({
        versionId: state.versionId,
        versionDescription: state.versionDescription,
    }), shallow)

    return (
        <div className="grow flex flex-col items-center justify-center ">
            <div className="grow mt-5 w-11/12 flex flex-col text-sm ">
                <div className="w-full mb-5 h-32 flex flex-col items-center justify-center">
                    <img src={logoSVG} className="h-1/2" alt="logo"/>
                    <div className="text-xs text-gray-600 mt-2">Cardographer Analyser</div>
                    <div className="text-xs text-gray-600 ">Version {versionId}</div>
                </div>

                {/*<div className="font-bold text-md text-gray-500 mb-3">Information</div>*/}
                <div className="w-full flex flex-row items-center justify-between">
                    <div className="w-2/6 font-bold flex flex-row items-center justify-items-start">
                        <div className="flex flex-col items-center justify-center  w-3/4 ">
                            <FontAwesomeIcon icon={faBook} className="fa-xl"/>
                            <span className="text-xs mt-2">Documentation</span>
                        </div>
                    </div>
                    <a
                        href="https://alvin-peng-1.gitbook.io/cardographer-analyser/" target="_blank"
                        className="w-4/6 font-light text-xs flex flex-row items-center break-all">https://alvin-peng-1.gitbook.io/cardographer-analyser
                    </a>
                </div>
                <hr className="my-2"/>
                <div className="w-full flex flex-row items-center justify-between">
                    <div className="w-2/6 font-bold flex flex-row items-center justify-items-start">
                        <div className="flex flex-col items-center justify-center  w-3/4">
                            <FontAwesomeIcon icon={faGithub} className="fa-xl"/>
                            <span className="text-xs mt-2">Github</span>
                        </div>
                    </div>
                    <a
                        href="https://github.com/pengyikun/CardographerAnalyser" target="_blank"
                        className="w-4/6 font-light text-xs flex flex-row items-center break-all">https://github.com/pengyikun/CardographerAnalyser
                    </a>
                </div>
                <hr className="my-2"/>
                <div className="w-full flex flex-row items-center justify-between">
                    <div className="w-2/6 font-bold flex flex-row items-center justify-items-start">
                        <div className="flex flex-col items-center justify-center  w-3/4">
                            <FontAwesomeIcon icon={faDiscord} className="fa-xl"/>
                            <span className="text-xs mt-2">Discord</span>
                        </div>
                    </div>
                    <a
                        href="https://discord.gg/Y56KMF9KDE" target="_blank"
                        className="w-4/6 font-light text-xs flex flex-row items-center break-all">https://discord.gg/Y56KMF9KDE
                    </a>
                </div>
                <hr className="my-2"/>
                <div className="font-bold text-md text-gray-500 mt-5 mb-3">Update Note ({versionId})</div>
                <div className="flex flex-col justify-center items-center text-xs">
                    {versionDescription.split('<new>').map(d => {
                        return <div key={d}
                                    className="w-11/12 text-gray-500 break-all">
                            -{d}
                        </div>
                    })}
                </div>

            </div>
            {/*<div className="grow w-full flex flex-col items-center justify-end ">*/}
            {/*    <div className="text-xs text-gray-400 m-3">Placeholder</div>*/}
            {/*</div>*/}
        </div>
    )

}

export default React.memo(AboutPage)