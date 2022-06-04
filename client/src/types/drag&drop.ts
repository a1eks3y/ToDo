export interface dragAndDropState {
    dragItem?: dragAndDropStep | dragAndDropTask | dragAndDropList | dragAndDropGroup,
    isDragging: boolean
}

interface dragAndDropStep {
    x: number,
    y: number,
    _id: string,
    position: number,
    name: string,
    forTask: string,
    isCompleted: boolean,
    interfaceRGB: interfaceColor.RED | interfaceColor.BLUE,
    itemType: dragItemTypes.step
}

export enum interfaceColor {
    BLUE = 'rgb(37, 100, 207)',
    RED = 'rgb(210, 83, 78)'
}

interface dragAndDropTask {
    x: number,
    y: number,
    _id: string,
    position: number | null,
    name: string,
    myDay?: number,
    favourites?: number | null,
    forList?: string,
    isCompleted: boolean,
    itemType: dragItemTypes.task
}

interface dragAndDropList {
    x: number,
    y: number,
    _id: string,
    position: number,
    name: string,
    forGroup?: string,
    itemType: dragItemTypes.list
}

interface dragAndDropGroup {
    x: number,
    y: number,
    _id: string,
    position: number,
    name: string,
    itemType: dragItemTypes.group
}

export enum dragItemTypes {
    group = 'group',
    list = 'list',
    task = 'task',
    step = 'step'
}

export enum dragAndDropActionTypes {
    DRAG_STEP = '@drag&drop/DRAG_STEP',
    DRAG_TASK = '@drag&drop/DRAG_TASK',
    DRAG_LIST = '@drag&drop/DRAG_LIST',
    DRAG_GROUP = '@drag&drop/DRAG_GROUP',
    DROP = '@drag&drop/DROP'
}

export interface dragStepAction {
    type: dragAndDropActionTypes.DRAG_STEP
    payload: {
        x: number,
        y: number,
        _id: string,
        position: number,
        name: string,
        forTask: string,
        isCompleted: boolean,
        interfaceRGB: interfaceColor.RED | interfaceColor.BLUE,
        itemType: dragItemTypes.step
    }
}

export interface dragTaskAction {
    type: dragAndDropActionTypes.DRAG_TASK
    payload: {
        x: number,
        y: number,
        _id: string,
        position: number | null,
        name: string,
        favourites?: number | null,
        myDay?: number,
        forList?: string,
        isCompleted: boolean,
        itemType: dragItemTypes.task
    }
}

export interface dragListAction {
    type: dragAndDropActionTypes.DRAG_LIST
    payload: {
        x: number,
        y: number,
        _id: string,
        position: number,
        name: string,
        itemType: dragItemTypes.list,
        forGroup?: string
    }
}

export interface dragGroupAction {
    type: dragAndDropActionTypes.DRAG_GROUP
    payload: {
        _id: string,
        position: number,
        name: string,
        itemType: dragItemTypes.group
        x: number,
        y: number
    }
}

export interface DropAction {
    type: dragAndDropActionTypes.DROP
}

export type dragAndDropActionI = dragStepAction | dragTaskAction | dragListAction | dragGroupAction | DropAction