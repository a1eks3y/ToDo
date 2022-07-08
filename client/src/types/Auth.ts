export interface IAuthState {
    userData?: {
        timezone: number,
        username: string,
        emailConfirmed: boolean,
        email: string
    }
    isAuth: boolean,
    isLoading: boolean
}

export enum AuthActionType {
    AUTHORIZATION = '@auth/AUTHORIZATION',
    EMAIL_CONFIRMED = '@auth/EMAIL_CONFIRMED',
    AUTHORIZATION_SUCCESS = '@auth/AUTHORIZATION_SUCCESS',
    AUTHORIZATION_ERROR = '@auth/AUTHORIZATION_ERROR',
    LOGOUT = '@auth/LOGOUT'
}

export interface AuthActionAuthorization {
    type: AuthActionType.AUTHORIZATION
}

export interface AuthActionEmailConfirmed {
    type: AuthActionType.EMAIL_CONFIRMED
}

export interface AuthActionAuthorizationSuccess {
    type: AuthActionType.AUTHORIZATION_SUCCESS
    payload: {
        timezone: number,
        username: string,
        emailConfirmed: boolean,
        email: string
    }
}

export interface AuthActionError {
    type: AuthActionType.AUTHORIZATION_ERROR
}

export interface AuthActionLogout {
    type: AuthActionType.LOGOUT
}

export type IAuthAction = AuthActionAuthorization | AuthActionAuthorizationSuccess | AuthActionLogout |
    AuthActionError | AuthActionEmailConfirmed

//for async_actions

export interface ILoginAction {
    email: string,
    password: string
}

export interface IRegisterAction {
    email: string,
    password: string,
    username: string,
    Timezone: number
}

export interface IUserData {
    username: string,
    Timezone: number,
    token: string,
    email: string,
    emailConfirmed: boolean
}

export interface IUserDataRegister extends IUserData {
    message: string
}

