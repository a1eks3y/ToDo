import { Dispatch } from "redux";
import { AuthActionType, IAuthAction, ILoginAction, IRegisterAction, IUserData, JWTLsI } from "../../types/Auth";
import axios from "axios";
import { MessageAction } from "../../types/Message";
import {
    addMessageActionCreator,
    willBeDeletedMessageActionCreator
} from "../actionsCreator/messageActionCreator";

export const AuthRegisterAction = ( payload: IRegisterAction ) => {
    return async ( dispatch: Dispatch<IAuthAction | MessageAction> ) => {
        const id = new Date().getTime()
        try {
            dispatch({ type : AuthActionType.AUTHORIZATION })
            const res = await axios.post('api/auth/register', payload)

            const data = res.data
            localStorage.removeItem('jwt')
            localStorage.setItem('jwt', JSON.stringify({
                jwtToken : data.token
            }))
            dispatch({
                type : AuthActionType.AUTHORIZATION_SUCCESS, payload : {
                    email : data.email,
                    username : data.username,
                    timezone : data.Timezone,
                    emailConfirmed : data.emailConfirmed
                }
            })
            dispatch(addMessageActionCreator(id, data.message, false))
            setTimeout(() => {
                dispatch(willBeDeletedMessageActionCreator(id))
            }, 3250)
        } catch (e: any) {
            const message = e.response.message || e.response.data.message
            dispatch({ type : AuthActionType.LOGOUT })
            dispatch(
                addMessageActionCreator(id, message || 'Something went wrong. Try again later...', true)
            )
            setTimeout(() => {
                dispatch(willBeDeletedMessageActionCreator(id))
            }, 6000)
        }
    }
}
export const AuthLoginFormAction = ( payload: ILoginAction ) => {
    return async ( dispatch: Dispatch<IAuthAction | MessageAction> ) => {
        const id = new Date().getTime()
        try {
            dispatch({ type : AuthActionType.AUTHORIZATION })
            const res = await axios.post('api/auth/login/form', payload)

            const data = res.data
            localStorage.removeItem('jwt')
            localStorage.setItem('jwt', JSON.stringify({
                jwtToken : data.token
            }))
            dispatch({
                type : AuthActionType.AUTHORIZATION_SUCCESS, payload : {
                    username : data.username,
                    timezone : data.Timezone,
                    email : data.email,
                    emailConfirmed : data.emailConfirmed
                }
            })

        } catch (e: any) {
            const message = e.response.message || e.response.data.message
            dispatch({ type : AuthActionType.LOGOUT })
            dispatch(addMessageActionCreator(id, message || 'Something went wrong. Try again later...',
                true)
            )
            setTimeout(() => {
                dispatch(willBeDeletedMessageActionCreator(id))
            }, 6000)
        }
    }
}

export const AuthLoginJWTAction = () => {
    return async ( dispatch: Dispatch<IAuthAction | MessageAction> ) => {
        const id = new Date().getTime()
        try {
            dispatch({ type : AuthActionType.AUTHORIZATION })
            const jwt = localStorage.getItem('jwt')
            if ( !jwt ) throw new Error()
            const { jwtToken } = JSON.parse(jwt) as JWTLsI
            const res = await axios.post('/api/auth/login/jwt', jwtToken, {
                headers : {
                    Authorization : `Bearer ${ jwt }`
                }
            })
            localStorage.removeItem('jwt')

            const data: IUserData = res.data

            dispatch({
                type : AuthActionType.AUTHORIZATION_SUCCESS, payload : {
                    username : data.username,
                    timezone : data.timezone,
                    email : data.email,
                    emailConfirmed : data.emailConfirmed
                }
            })
            localStorage.setItem('jwt', JSON.stringify({
                jwtToken : data.jwt
            }))
        } catch (e: any) {
            if ( e.response.status !== 409 ) localStorage.removeItem('jwt')
            const message = e.response.message || e.response.data.message
            dispatch({ type : AuthActionType.LOGOUT })
            dispatch(addMessageActionCreator(id, message || 'Something went wrong. Try again later...',
                true)
            )
            setTimeout(() => {
                dispatch(willBeDeletedMessageActionCreator(id))
            }, 6000)
        }
    }
}

export const AuthLogoutActionCreator = () => {
    return { type : AuthActionType.LOGOUT } as IAuthAction
}