import {
    AuthActionAuthorization,
    AuthActionAuthorizationSuccess,
    AuthActionLogout,
    AuthActionType
} from '../../types/Auth'

export const authSuccessActionCreator = ( { timezone, username, emailConfirmed, email } : {
    timezone: number, username: string, emailConfirmed: boolean, email: string
    }):AuthActionAuthorizationSuccess => ({
    type: AuthActionType.AUTHORIZATION_SUCCESS,
    payload: {
        timezone,
        username,
        emailConfirmed,
        email
    }
})

export const logoutActionCreator = ():AuthActionLogout => ({
    type: AuthActionType.LOGOUT
})

export const authorizationActionCreator = ():AuthActionAuthorization => ({
    type: AuthActionType.AUTHORIZATION
})