export interface IAuthState {
    timezone?: number,
    username?: string,
    emailConfirmed?: boolean
    isAuth: boolean,
    isLoading: boolean
}

export enum AuthActionType {
    AUTHORIZATION = 'AUTHORIZATION',
    AUTHORIZATION_SUCCESS = 'AUTHORIZATION_SUCCESS',
    AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
    LOGOUT = 'LOGOUT'
}

interface AuthActionAuthorization {
    type: AuthActionType.AUTHORIZATION
}

interface AuthActionAuthorizationSuccess {
    type: AuthActionType.AUTHORIZATION_SUCCESS
    payload: {
        timezone: number,
        username: string,
        emailConfirmed: boolean
    }
}

interface AuthActionError {
    type: AuthActionType.AUTHORIZATION_ERROR
}

interface AuthActionLogout {
    type: AuthActionType.LOGOUT
}

export type IAuthAction = AuthActionAuthorization | AuthActionAuthorizationSuccess | AuthActionLogout | AuthActionError

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
    timezone: number,
    jwt: string,
    email: string,
    emailConfirmed: boolean
}