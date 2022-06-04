export type IMessage = null | {
    message: string,
    id: number,
    isBad: boolean,
    willBeDeleted: boolean
}[]

export enum MessageActionTypes {
    ADD_MESSAGE = '@message/ADD_MESSAGE',
    WILL_BE_DELETED = '@message/WILL_BE_DELETED',
    DELETE_MESSAGE = '@message/DELETE_MESSAGE',
    CLEAR_MESSAGE = '@message/CLEAR_MESSAGE',
    IS_NEW_TO_FALSE = '@message/IS_NEW_TO_FALSE'
}

interface MessageWillBeDeleted {
    type: MessageActionTypes.WILL_BE_DELETED
    payload: number
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
    | MessageWillBeDeleted
