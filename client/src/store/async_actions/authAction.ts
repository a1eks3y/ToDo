import { Dispatch } from "redux";
import { AuthActionType, IAuthAction, ILoginAction, IRegisterAction } from "../../types/Auth";
import axios from "axios";
import { MessageAction } from "../reducers/messageReducer";
import { addMessageActionCreator, deleteMessageActionCreator } from "../actionsCreator/messageActionCreator";



export const AuthLoginAction = ( payload: ILoginAction ) => {
    return async ( dispatch: Dispatch<IAuthAction | MessageAction> ) => {
        const id = new Date().getTime()
        try {
            dispatch({ type : AuthActionType.AUTHORIZATION })
            const json = JSON.stringify(payload)
            const res = await axios.post('api/auth/login', json)
            const data = res.data
            if ( res.status === 200 ) {
                dispatch({ type : AuthActionType.AUTHORIZATION_SUCCESS, payload : data.username })
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



export const AuthRegisterAction = ( payload: IRegisterAction ) => {
    return async ( dispatch: Dispatch<IAuthAction | MessageAction> ) => {
        const id = new Date().getTime()
        try {
            dispatch({ type : AuthActionType.AUTHORIZATION })
            const json = JSON.stringify(payload)
            const res = await axios.post('api/auth/register', json)
            const data = res.data
            if ( res.status === 201 ) {
                dispatch({ type : AuthActionType.AUTHORIZATION_SUCCESS, payload : data.username })
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