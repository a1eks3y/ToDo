import { IMessage, MessageAction, MessageActionTypes } from "../../types/Message";

const defaultState = null

export const messageReducer = ( state: IMessage = defaultState, action: MessageAction ): IMessage => {
    switch ( action.type ) {
        case MessageActionTypes.ADD_MESSAGE:
            return state ?
                [{ id : action.payload.id, message : action.payload.message, isBad: action.payload.isBad }, ...state]
                :
                [{ id : action.payload.id, message : action.payload.message, isBad: action.payload.isBad }]
        case MessageActionTypes.DELETE_MESSAGE:
            return state ? [...state.filter(el => el.id !== action.payload)] : null
        case MessageActionTypes.CLEAR_MESSAGE:
            return null
        default:
            return state || null
    }
}