import { Dispatch } from 'redux'
import { IAuthAction, ILoginAction, IRegisterAction, IUserData, IUserDataRegister } from '../../types/Auth'
import axios, { AxiosError } from 'axios'
import { MessageAction } from '../../types/Message'
import { addMessageActionCreator, willBeDeletedMessageActionCreator } from '../actionsCreator/messageActionCreator'
import {
    GroupStateI,
    ListStateI, StepStateI, TaskStateI,
    TodoUserDataActionI
} from '../../types/todoUserData'
import { addAllActionCreator } from '../actionsCreator/todoUserDataActionCreator'
import {
    authorizationActionCreator,
    authSuccessActionCreator,
    logoutActionCreator
} from '../actionsCreator/authActionCreator'

export const AuthRegisterAction = ( payload: IRegisterAction ) => {
    return async ( dispatch: Dispatch<IAuthAction | MessageAction> ) => {
        const id = new Date().getTime()
        try {
            dispatch(authorizationActionCreator())
            const res = await axios.post<IUserDataRegister>('api/auth/register', payload)

            const data = res.data
            localStorage.setItem('jwt', data.token)
            dispatch(authSuccessActionCreator({
                email : data.email,
                username : data.username,
                timezone : data.Timezone,
                emailConfirmed : data.emailConfirmed
            }))
            dispatch(addMessageActionCreator(id, data.message, false))
            setTimeout(() => {
                dispatch(willBeDeletedMessageActionCreator(id))
            }, 3250)
        } catch (e: any) {
            if ( e.response.status !== 401 ) {
                const message = e.response.message || e.response.data.message
                dispatch(logoutActionCreator())
                dispatch(
                    addMessageActionCreator(
                        id,
                        message || 'Something went wrong. Try again later...',
                        true
                    )
                )
                setTimeout(() => {
                    dispatch(willBeDeletedMessageActionCreator(id))
                }, 6000)
            }
        }
    }
}
export const AuthLoginFormAction = ( payload: ILoginAction ) => {
    return async (
        dispatch: Dispatch<IAuthAction | MessageAction | TodoUserDataActionI>
    ) => {
        const id = new Date().getTime()
        try {
            dispatch(authorizationActionCreator())
            const res = await axios.post<IUserData>('api/auth/login/form', payload)
            const data = res.data
            localStorage.setItem('jwt', data.token)
            if ( data.emailConfirmed ) {
                const res = await axios.get<{
                    groups: GroupStateI[],
                    lists: ListStateI[],
                    tasks: TaskStateI[],
                    steps: StepStateI[]
                }>('api/for_authorized_users/get_all', {
                    headers : {
                        Authorization : `Bearer ${ data.token }`
                    }
                })
                dispatch(addAllActionCreator(res.data))
            }
            dispatch(authSuccessActionCreator({
                username : data.username,
                timezone : data.Timezone,
                email : data.email,
                emailConfirmed : data.emailConfirmed
            }))
        } catch (e) {
            const err = e as AxiosError
            const message = err.message || err.response?.data.message
            dispatch(logoutActionCreator())
            dispatch(addMessageActionCreator(
                id,
                message || 'Something went wrong. Try again later...',
                true
            ))
            setTimeout(() => {
                dispatch(willBeDeletedMessageActionCreator(id))
            }, 6000)
        }
    }
}

export const AuthLoginJWTAction = () => {
    return async (
        dispatch: Dispatch<IAuthAction | MessageAction | TodoUserDataActionI>
    ) => {
        const id = new Date().getTime()
        try {
            dispatch(authorizationActionCreator())
            const jwt = localStorage.getItem('jwt')
            if ( !jwt ) throw new Error()
            const res = await axios.post('/api/auth/login/jwt', jwt, {
                headers : {
                    Authorization : `Bearer ${ jwt }`
                }
            })

            const data: IUserData = res.data
            if ( data.emailConfirmed ) {
                const res = await axios.get<{
                    groups: GroupStateI[],
                    lists: ListStateI[],
                    tasks: TaskStateI[],
                    steps: StepStateI[]
                }>('api/for_authorized_users/get_all', {
                    headers : {
                        Authorization : `Bearer ${ data.token }`
                    }
                })
                dispatch(addAllActionCreator(res.data))
            }
            dispatch(authSuccessActionCreator({
                username : data.username,
                timezone : data.Timezone,
                email : data.email,
                emailConfirmed : data.emailConfirmed
            }))
            localStorage.setItem('jwt', data.token)
        } catch (e) {
            const err = e as AxiosError
            if ( err.response?.status !== 409 ) localStorage.removeItem('jwt')
            const message = err.message || err.response?.data.message || 'Something went wrong. Try again later...'
            dispatch(logoutActionCreator())
            dispatch(addMessageActionCreator(id, message, true)
            )
            setTimeout(() => {
                dispatch(willBeDeletedMessageActionCreator(id))
            }, 6000)
        }
    }
}