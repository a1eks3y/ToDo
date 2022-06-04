import { Category } from './Schemas'

export type changePositionReqBody = {
    data: ({
        _id: string,
        toPos: number,
        type: 3,
        forGroup?: string | null
    } | {
        _id: string,
        move: moveTaskType,
        type: 1
    } | {
        _id: string,
        toPos: number,
        type: 0 | 2,
    })[]
}

export type moveTaskType = {
    toPos: number,
    type: TaskMoveType.MOVE_INSIDE_LIST
} | {
    forList: string,
    type: TaskMoveType.MOVE_BETWEEN_LISTS
} | {
    myDay: number,
    type: TaskMoveType.MY_DAY_MOVE
} | {
    type: TaskMoveType.MY_DAY_ADD | TaskMoveType.MY_DAY_REMOVE
        | TaskMoveType.FAVOURITES_REMOVE | TaskMoveType.FAVOURITES_ADD
} | {
    favourites: number,
    type: TaskMoveType.FAVOURITES_MOVE
}

export enum TaskMoveType {
    MOVE_INSIDE_LIST = 'MOVE_INSIDE_LIST',
    MOVE_BETWEEN_LISTS = 'MOVE_BETWEEN_LISTS',
    MY_DAY_MOVE = 'MY_DAY_MOVE',
    MY_DAY_ADD = 'MY_DAY_ADD',
    MY_DAY_REMOVE = 'MY_DAY_REMOVE',
    FAVOURITES_MOVE = 'FAVOURITES_MOVE',
    FAVOURITES_ADD = 'FAVOURITES_ADD',
    FAVOURITES_REMOVE = 'FAVOURITES_REMOVE'
}

export interface completeReqBody {
    data: ({
        _id: string,
        type: 0
    } | {
        _id: string,
        type: 1,
        completedAt?: [number, number, number, number, number, number],
    })[]
}

export interface deleteReqBody {
    data: {
        _id: string,
        type: 0 | 1 | 2 | 3
    }[]
}

interface renameData {
    name?: string
}

interface changeStepData extends renameData {
    _id: string,
    type: 0
}

interface changeTaskData extends renameData {
    _id: string,
    endAt?: [number, number, number], // [year, month, day]
    categories?: Category[],
    description?: string,
    completedAt?: [number, number, number, number, number, number], // [year, month, day, hour, min, sec]
    type: 1
}

interface changeGroupData extends renameData {
    _id: string,
    type: 2
}

interface changeListData extends renameData {
    _id: string,
    type: 3
}

export interface changeDataReqBody {
    data: (changeStepData | changeTaskData | changeGroupData | changeListData)[]
}

export interface createReqBody {
    data: (createGroupOrListReqBody | createStepReqBody | createTaskReqBody)[]
}

interface createGroupOrListReqBody {
    name: string,
    _id: string,
    type: 2 | 3
}

interface createStepReqBody {
    _id: string,
    name: string,
    forTask: string
    type: 0
}

interface createTaskReqBody {
    _id: string,
    name: string,
    forList?: string,
    createdAt: [number, number, number, number, number, number],
    endAt?: [number, number, number],
    isMyDay?: true,
    isFavourite?: true,
    type: 1
}