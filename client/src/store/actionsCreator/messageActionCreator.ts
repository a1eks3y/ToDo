import { MessageAction, MessageActionTypes } from '../../types/Message'

export const addMessageActionCreator = ( id: number, message: string, isBad: boolean ) => {
    return { type : MessageActionTypes.ADD_MESSAGE, payload : { id, message, isBad } } as MessageAction
}
export const deleteMessageActionCreator = ( id: number ) => {
    return { type : MessageActionTypes.DELETE_MESSAGE, payload : id } as MessageAction
}
export const clearMessageActionCreator = () => {
    return { type : MessageActionTypes.CLEAR_MESSAGE } as MessageAction
}
export const willBeDeletedMessageActionCreator = ( id: number ) => {
    return { type : MessageActionTypes.WILL_BE_DELETED, payload : id } as MessageAction
}