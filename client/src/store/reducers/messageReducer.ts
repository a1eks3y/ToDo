import { IMessage, MessageAction, MessageActionTypes } from '../../types/Message'

const defaultState = null

export const messageReducer = ( state: IMessage = defaultState, action: MessageAction ): IMessage => {
    switch ( action.type ) {
        case MessageActionTypes.ADD_MESSAGE:
            if ( state && state.length >= 3 &&
                state[ state.length - 1 ].message === action.payload.message &&
                state[ state.length - 2 ].message === action.payload.message &&
                state[ state.length - 3 ].message === action.payload.message
            ) return [...state]
            return state ?
                [
                    ...state,
                    {
                        id : action.payload.id,
                        message : action.payload.message,
                        isBad : action.payload.isBad,
                        willBeDeleted : false
                    }
                ]
                :
                [
                    {
                        id : action.payload.id,
                        message : action.payload.message,
                        isBad : action.payload.isBad,
                        willBeDeleted : false
                    }
                ]
        case MessageActionTypes.WILL_BE_DELETED:
            return state ? state.map(el => el.id === action.payload ?
                {
                    ...el,
                    willBeDeleted : true
                }
                :
                el
            ) : null
        case MessageActionTypes.DELETE_MESSAGE:
            if ( state ) {
                const filteredState = [...state.filter(el => el.id !== action.payload)]
                return filteredState.length > 0 ? filteredState : null
            } else return null
        case MessageActionTypes.CLEAR_MESSAGE:
            return null
        default:
            return state || null
    }
}