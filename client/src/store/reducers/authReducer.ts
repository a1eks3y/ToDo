import { AuthActionType, IAuthAction } from "../../types/Auth";

const defaultState = {
    auth : false,
    isLoading : false
}

interface IAuthState {
    name?: string,
    auth: boolean,
    isLoading: boolean
}


export const AuthReducer = ( state: IAuthState = defaultState, action: IAuthAction ): IAuthState => {
    console.log(state, action)
    switch ( action.type ) {
        case AuthActionType.AUTHORIZATION:
            return { auth : false, isLoading : true }
        case AuthActionType.AUTHORIZATION_SUCCESS:
            return { auth : true, isLoading : false, name : action.payload }
        default:
            return { auth : false, isLoading : false }
    }
}