import { contextMenuActionI, contextMenuActionType, contextMenuStateI } from '../../types/contextMenu'

const initialState: contextMenuStateI = {
    isOpen : false
}

export const ContextMenuReducer = ( state: contextMenuStateI = initialState, action: contextMenuActionI ): contextMenuStateI => {
    switch ( action.type ) {
        case contextMenuActionType.GROUP:
            return {
                isOpen : true,
                item : {
                    type : contextMenuActionType.GROUP,
                    ...action.payload
                }
            }
        case contextMenuActionType.LIST:
            return {
                isOpen : true,
                item : {
                    type : contextMenuActionType.LIST,
                    ...action.payload
                }
            }
        case contextMenuActionType.TASK:
            return {
                isOpen : true,
                item : {
                    type : contextMenuActionType.TASK,
                    ...action.payload
                }
            }
        case contextMenuActionType.CHOOSE_DATE:
            return {
                isOpen : true,
                item : {
                    type: contextMenuActionType.CHOOSE_DATE,
                    ...action.payload
                }
            }
        case contextMenuActionType.CLEAR_CONTEXT_MENU:
            return { isOpen : false }
        default:
            return { ...state }
    }
}