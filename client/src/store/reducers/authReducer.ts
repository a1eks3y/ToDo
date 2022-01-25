import { AuthActionType, IAuthAction, IAuthState } from "../../types/Auth";

const defaultState = {
    auth : false,
    isLoading : false
}

export const AuthReducer = ( state: IAuthState = defaultState, action: IAuthAction ): IAuthState => {
    switch ( action.type ) {
        case AuthActionType.AUTHORIZATION:
            return { auth : false, isLoading : true }
        case AuthActionType.AUTHORIZATION_SUCCESS:
            return {
                auth : true,
                isLoading : false,
                username : action.payload.username,
                timezone: action.payload.timezone
            }
        case AuthActionType.LOGOUT:
            return {auth: false, isLoading: false }
        default:
            if(state)
                return {...state}
            return { auth : false, isLoading : false }
    }
}