import { syncDateActionI, SyncDateActionTypes, syncDateStateI } from '../../types/syncDate'

const defaultState: syncDateStateI = {
    time : null,
    errors : 0
}

export const syncDateReducer = ( state: syncDateStateI = defaultState, action: syncDateActionI ): syncDateStateI => {
    switch ( action.type ) {
        case SyncDateActionTypes.UPDATE_TIME:
            return {
                ...state, time : {
                    ...action.payload
                }
            }
        case SyncDateActionTypes.ADD_ERROR:
            return { ...state, errors : state.errors + 1 }
        case SyncDateActionTypes.CLEAR:
            return {
                time : null,
                errors : 0
            }
        default:
            return state
    }
}