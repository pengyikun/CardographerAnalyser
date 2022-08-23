import * as React from "react";
import {FC} from "react";
import TopBar from "./TopBar";
import BotBar from "./BotBar";


type LayoutProps = {
    children: React.ReactNode
}

export const Layout: FC<LayoutProps> = (props) => {

    return <div className="h-screen flex flex-col">
        <TopBar/>
        <div className="grow overflow-y-scroll flex flex-col">
            {props.children}
        </div>
        <BotBar/>
    </div>
}