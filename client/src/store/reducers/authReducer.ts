import { AuthActionType, IAuthAction, IAuthState } from "../../types/Auth";

const defaultState = {
    isAuth : false,
    isLoading : false
}

export const AuthReducer = ( state: IAuthState = defaultState, action: IAuthAction ): IAuthState => {
    switch ( action.type ) {
        case AuthActionType.AUTHORIZATION:
            return { isAuth : false, isLoading : true }
        case AuthActionType.AUTHORIZATION_SUCCESS:
            return {
                isAuth : true,
                isLoading : false,
                userData: {
                    ...action.payload
                }
            }
        case AuthActionType.AUTHORIZATION_ERROR:
            return { ...state, isLoading : false }
        case AuthActionType.LOGOUT:
            return { isAuth : false, isLoading : false }
        default:
            return { ...state }
    }
}