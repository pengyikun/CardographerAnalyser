import * as React from "react";
import {DISPATCH_TYPES, useStore} from "../../store/store";
import {FC} from "react";
import {PAGE_TYPES} from "../../types/PageType";
import {faHome} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


type TopBarProps = {}

const TopBar: FC<TopBarProps> = () => {
    const page = useStore(state => state.page)
    const dispatch = useStore((state) => state.dispatch)


    const navigateHome = () => {
        dispatch({
            type: DISPATCH_TYPES.SET_PAGE,
            payload: {
                page: PAGE_TYPES.HOME
            }
        })
    }

    return <div
        className="flex-shrink-0 w-full h-10 font-montserrat bg-gray-400 text-sm shadow-md font-bold flex flex-col items-center justify-center">
        <div className="w-full">
            <span className="ml-5">{page}</span>

            <button onClick={navigateHome} className='float-right mr-5 hover:text-gray-600'>
                <FontAwesomeIcon icon={faHome} className="fa-lg"/>
            </button>
        </div>
    </div>
}

export default React.memo(TopBar)