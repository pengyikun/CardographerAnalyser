/**
 * Typings for user credentials and user login state
 */

export interface LoginState {
    isLoggedIn: boolean,
    loginData?: UserLoginData
}

export interface UserLoginData {
    email: string,
    token: string,
    loggedInTime: string,
}