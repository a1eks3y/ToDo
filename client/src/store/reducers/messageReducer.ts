const defaultState = null
type IMessage = null | {
    message: string,
    id: number
    isBad: boolean
}[]

export enum MessageActionTypes {
    ADD_MESSAGE = 'ADD_MESSAGE',
    DELETE_MESSAGE = 'DELETE_MESSAGE',
    CLEAR_MESSAGE = 'CLEAR_MESSAGE'
}

interface MessageActionDeleteOne {
    type: MessageActionTypes.DELETE_MESSAGE
    payload: number
}

interface MessageActionClear {
    type: MessageActionTypes.CLEAR_MESSAGE
}

interface MessageActionAdd {
    type: MessageActionTypes.ADD_MESSAGE
    payload: {
        id: number,
        message: string,
        isBad: boolean
    }
}

export type MessageAction = MessageActionDeleteOne | MessageActionClear | MessageActionAdd
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
            return null
    }
}