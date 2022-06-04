import {
    dragAndDropActionTypes,
    dragGroupAction,
    dragItemTypes,
    dragListAction, dragStepAction,
    dragTaskAction, DropAction, interfaceColor
} from '../../types/drag&drop'

export const dragStepActionCreator = (
    { x, y, _id, name, position, isCompleted, forTask, interfaceRGB }: {
        x: number, y: number, _id: string, position: number, name: string,
        forTask: string, isCompleted: boolean, interfaceRGB: interfaceColor.RED | interfaceColor.BLUE
    } ): dragStepAction => {
    return {
        type : dragAndDropActionTypes.DRAG_STEP,
        payload : {
            x,
            y,
            _id,
            position,
            name,
            forTask,
            isCompleted,
            interfaceRGB,
            itemType : dragItemTypes.step
        }
    }
}

export const dragTaskActionCreator = (
    { x, y, _id, name, position, myDay, isCompleted, favourites, forList }: {
        x: number, y: number, _id: string, position: number | null, name: string, favourites?: number | null,
        myDay?: number, forList?: string, isCompleted: boolean
    } ): dragTaskAction => {
    return {
        type : dragAndDropActionTypes.DRAG_TASK,
        payload : {
            x,
            y,
            _id,
            position,
            name,
            favourites,
            myDay,
            forList,
            isCompleted,
            itemType : dragItemTypes.task
        }
    }
}

export const dragListActionCreator = (
    position: number, name: string, _id: string, x: number, y: number, forGroup?: string
): dragListAction => {
    return {
        type : dragAndDropActionTypes.DRAG_LIST,
        payload : {
            x,
            y,
            _id,
            name,
            position,
            ...(forGroup ? { forGroup } : {}),
            itemType : dragItemTypes.list
        }
    }
}

export const dragGroupActionCreator = (
    position: number, name: string, _id: string, x: number, y: number
): dragGroupAction => {
    return {
        type : dragAndDropActionTypes.DRAG_GROUP,
        payload : {
            x,
            y,
            position,
            name,
            _id,
            itemType : dragItemTypes.group
        }
    }
}

export const dropActionCreator = () => ({
    type : dragAndDropActionTypes.DROP
}) as DropAction