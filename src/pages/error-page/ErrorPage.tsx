import * as React from "react";
import {FC} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faIdCard} from "@fortawesome/free-solid-svg-icons";


type ErrorPageProps = {
    message: string
}

const ErrorPage: FC<ErrorPageProps> = (props) => {
    const {message} = props

    return <div className="h-full">
        <div className="flex flex-col h-screen items-center justify-center">

            <div className="h-72 mb-10 flex flex-col align-middle justify-center text-center">
                <FontAwesomeIcon icon={faIdCard} className="fa-2xl mb-2"/>
                <div>{message}</div>
            </div>
        </div>
    </div>
}

export default React.memo(ErrorPage)