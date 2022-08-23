export interface LoginState {
    isLoggedIn: boolean,
    loginData?: UserLoginData
}

export interface UserLoginData {
    email: string,
    token: string,
    loggedInTime: string,
}