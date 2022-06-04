import { dragAndDropActionI, dragAndDropActionTypes, dragAndDropState, dragItemTypes } from '../../types/drag&drop'

const initialState = {
    isDragging : false
}

export const dragAndDropReducer = ( state: dragAndDropState = initialState, action: dragAndDropActionI ): dragAndDropState => {
    switch ( action.type ) {
        case dragAndDropActionTypes.DRAG_STEP: {
            return {
                dragItem : {
                    ...action.payload,
                    itemType : dragItemTypes.step
                },
                isDragging : true
            }
        }
        case dragAndDropActionTypes.DRAG_TASK: {
            return {
                dragItem : {
                    ...action.payload,
                    itemType : dragItemTypes.task
                },
                isDragging : true
            }
        }
        case dragAndDropActionTypes.DRAG_LIST:
            const newState: dragAndDropState = {
                dragItem : {
                    x : action.payload.x,
                    y : action.payload.y,
                    _id : action.payload._id,
                    name : action.payload.name,
                    position : action.payload.position,
                    itemType : dragItemTypes.list
                },
                isDragging : true
            }
            return action.payload.forGroup ? {
                ...newState,
                dragItem : {
                    ...newState.dragItem,
                    forGroup : action.payload.forGroup
                }
            } as dragAndDropState : newState
        case dragAndDropActionTypes.DRAG_GROUP:
            return {
                dragItem : {
                    x : action.payload.x,
                    y : action.payload.y,
                    _id : action.payload._id,
                    name : action.payload.name,
                    position : action.payload.position,
                    itemType : dragItemTypes.group
                },
                isDragging : true
            }
        case dragAndDropActionTypes.DROP:
            return {
                isDragging : false
            }
        default:
            return { ...state }
    }
}