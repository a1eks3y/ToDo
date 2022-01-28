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
                username : action.payload.username,
                timezone : action.payload.timezone
            }
        case AuthActionType.LOGOUT:
            return { isAuth : false, isLoading : false }
        default:
            if ( state )
                return { ...state }
            return { isAuth : false, isLoading : false }
    }
}