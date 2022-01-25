import { Dispatch } from "redux";
import { AuthActionType, IAuthAction, ILoginAction, IRegisterAction, IUserData } from "../../types/Auth";
import axios from "axios";
import { MessageAction } from "../../types/Message";
import { addMessageActionCreator, deleteMessageActionCreator } from "../actionsCreator/messageActionCreator";

export const AuthRegisterAction = ( payload: IRegisterAction ) => {
    return async ( dispatch: Dispatch<IAuthAction | MessageAction> ) => {
        const id = new Date().getTime()
        try {
            dispatch({ type : AuthActionType.AUTHORIZATION })
            const res = await axios.post('api/auth/register', payload)
            const data = res.data
            if ( res.status === 201 ) {
                localStorage.removeItem('userData')
                localStorage.setItem('userData', JSON.stringify({
                    jwt : data.token,
                    username : data.username,
                    timezone : data.Timezone
                }))
                dispatch(
                    {
                        type : AuthActionType.AUTHORIZATION_SUCCESS,
                        payload : { username : data.username, timezone : data.Timezone }
                    })
                dispatch(addMessageActionCreator(id, data.message, false))
                setTimeout(() => {
                    dispatch(deleteMessageActionCreator(id))
                }, 4250)
            }
            else {
                dispatch(addMessageActionCreator(id, data.message, true))
                setTimeout(() => {
                    dispatch(deleteMessageActionCreator(id))
                }, 7000)
            }
        } catch (e) {
            dispatch(
                addMessageActionCreator(id, 'Something went wrong. Try again later...', true)
            )
            setTimeout(() => {
                dispatch(deleteMessageActionCreator(id))
            }, 7000)
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
            if ( res.status === 200 ) {
                localStorage.removeItem('userData')
                localStorage.setItem('userData', JSON.stringify({
                    jwt : data.token,
                    username : data.username,
                    timezone : data.Timezone
                }))
                dispatch({
                    type : AuthActionType.AUTHORIZATION_SUCCESS, payload : {
                        username : data.username,
                        timezone : data.Timezone
                    }
                })
            }
            else {
                dispatch(addMessageActionCreator(id, data.message, true))
                setTimeout(() => {
                    dispatch(deleteMessageActionCreator(id))
                }, 7000)
            }
        } catch (e) {
            dispatch(addMessageActionCreator(id, 'Something went wrong. Try again later...',
                true)
            )
            setTimeout(() => {
                dispatch(deleteMessageActionCreator(id))
            }, 7000)
        }
    }
}

export const AuthLoginJWTAction = () => {
    return async ( dispatch: Dispatch<IAuthAction | MessageAction> ) => {
        const id = new Date().getTime()
        try {
            dispatch({ type : AuthActionType.AUTHORIZATION })
            const userData = localStorage.getItem('userData')
            if ( !userData ) throw new Error()
            const { jwt, username, timezone } = JSON.parse(userData) as IUserData
            const res = await axios.post('/api/auth/login/jwt', jwt, {
                headers : {
                    Authorization : `Bearer ${ jwt }`
                }
            })
            localStorage.removeItem('userData')
            if ( res.status === 200 ) {
                const newJwt = res.data

                dispatch({
                    type : AuthActionType.AUTHORIZATION_SUCCESS, payload : {
                        username,
                        timezone
                    }
                })


                localStorage.setItem('userData', JSON.stringify({ jwt : newJwt, username, timezone }))
            }
            else {
                throw new Error()
            }
        } catch (e) {
            dispatch(addMessageActionCreator(id, 'Something went wrong. Try again later...',
                true)
            )
            setTimeout(() => {
                dispatch(deleteMessageActionCreator(id))
            }, 7000)
        }
    }
}

export const AuthLogoutActionCreator = () => {
    return { type : AuthActionType.LOGOUT }
}