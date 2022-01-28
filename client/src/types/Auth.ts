export interface IAuthState {
    timezone?: number,
    username?: string,
    isAuth: boolean,
    isLoading: boolean
}

export enum AuthActionType {
    AUTHORIZATION = 'AUTHORIZATION',
    AUTHORIZATION_SUCCESS = 'AUTHORIZATION_SUCCESS',
    LOGOUT = 'LOGOUT'
}

interface AuthActionAuthorization {
    type: AuthActionType.AUTHORIZATION
}

interface AuthActionAuthorizationSuccess {
    type: AuthActionType.AUTHORIZATION_SUCCESS
    payload: {
        timezone: number,
        username: string
    }
}

interface AuthActionLogout {
    type: AuthActionType.LOGOUT
}

export type IAuthAction = AuthActionAuthorization | AuthActionAuthorizationSuccess | AuthActionLogout

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
    jwt: string
}