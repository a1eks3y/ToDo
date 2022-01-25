export type IMessage = null | {
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
