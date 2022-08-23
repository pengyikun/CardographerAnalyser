import * as React from "react";
import {useState} from "react";
import {DISPATCH_TYPES, useStore} from "../../store/store";
import shallow from "zustand/shallow";
import {getCurrentTime} from "../../utils/helpers/Util";


const LoginPage = () => {
    const {loginState} = useStore((state) => ({
        loginState: state.loginState,
    }), shallow)
    const dispatch = useStore((state) => state.dispatch)

    const [isLogging, setIsLogging] = useState<boolean>(false)
    const [statusText, setStatusText] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [pwd, setPwd] = useState<string>("")

    let login = async () => {
        console.log(`Login with ${email} | ${pwd}`)
        setIsLogging(true)
        const payload = {
            email: email,
            password: pwd,
            register: false
        }
        fetch("https://cardographer.cs.nott.ac.uk/platform/api/user/login", {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
                "content-type": "application/json",
            },
            "body": JSON.stringify(payload),
            "method": "POST",
            "credentials": "omit"
        }).then(response => {
            if (response.ok) {
                console.log("Successfully login")
                setStatusText("")
                response.json().then(json => {
                    console.log(json)
                    dispatch({
                        type: DISPATCH_TYPES.LOGIN,
                        payload: {
                            loginState: {
                                isLoggedIn: true,
                                loginData: {
                                    email: email,
                                    token: json.token,
                                    loggedInTime: getCurrentTime()
                                }
                            }
                        }
                    })
                    setEmail("")
                    setPwd("")
                })
            } else {
                setStatusText(`Failed login ${response.status}, check FAQ for more information`)
            }
            setIsLogging(false)
        }).catch(error => {
            console.log(error)
            setStatusText(`Something went wrong while logging in`)
            setIsLogging(false)
        })
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.currentTarget.value)
    }
    const handlePwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPwd(e.currentTarget.value)
    }

    if (loginState.isLoggedIn) {
        return <div className="grow flex flex-col bg-gray-200">
            <div className="font-bold font-bold text-lg mt-10 mb-5 ml-5 text-cardographerThemeBG">
                Cardographer Platform User Login
            </div>
            <div>You are logged in as {loginState.loginData?.email}</div>
        </div>
    }

    return (
        <div className="grow flex flex-col bg-gray-200">
            <div className="font-bold font-bold text-lg mt-10 mb-5 ml-5 text-cardographerThemeBG">
                Cardographer Platform User Login
            </div>
            <div
                className="w-full flex flex-row items-center justify-center text-xs font-light text-red-500">{statusText}</div>
            <div className="mb-5 flex flex-col justify-center items-center   text-sm">
                <input className='m-2 w-4/5 border border-0 rounded text-center' type="text"
                       name="email"
                       placeholder="Email"
                       value={email}
                       onChange={handleEmailChange}
                       required/>
                <input className='m-2 w-4/5 border border-0 rounded border-gray-500 text-center' type="password"
                       name="password" placeholder="Password"
                       value={pwd}
                       onChange={handlePwdChange}
                />

                <button
                    className='m-4 bg-cardographerThemeBG text-md rounded px-14 py-1 text-gray-100 font-montserrat font-bold hover:bg-gray-800 disabled:bg-purple-900'
                    onClick={login} disabled={isLogging}> Login
                </button>
            </div>
            <div className="w-full flex flex-col items-end">
                <a className="float-right mr-5 text-xs text-gray-600 cursor-pointer"
                   href="https://cardographer.cs.nott.ac.uk/platform/user/password/forgotten"
                   target="_blank">Forgot Password</a>
                <a className="float-right mr-5 text-xs text-gray-600 cursor-pointer"
                   href="https://alvin-peng-1.gitbook.io/cardographer-analyser/guides/preparation"
                   target="_blank">Why do I need to login</a>
            </div>
        </div>
    )
        ;
}

export default React.memo(LoginPage)