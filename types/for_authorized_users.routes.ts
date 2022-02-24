export interface changePositionReqBody {
    0?: { // GroupModel
        id: string,
        toPos: number
    }[],
    1?: { // ListModel
        id: string,
        toPos: number
    }[], // StepModel
    2?: {
        id: string,
        toPos: number
    }[],
    3?: { // TaskModel
        id: string,
        toPos: number
    }[]
}

export interface renameReqBody {
    0?: { // GroupModel
        id: string,
        newName: string
    }[],
    1?: { // ListModel
        id: string,
        newName: string
    }[],
    2?: { // StepModel
        id: string,
        newName: string
    }[],
    3?: { // TaskModel
        id: string,
        newName: string
    }[]
}

export type renameItemsI = {
    id: string,
    newName: string
}[]

export interface deleteReqBody {
    0?: { // GroupModel
        id: string
    }[],
    1?: { // ListModel
        id: string
    }[],
    2?: { // StepModel
        id: string
    }[],
    3?: { // TaskModel
        id: string
    }[]
}

export type deleteItemsI = {
    id: string
}[]

export interface createStepReqBodyI {
    Task_id: string,
    name: string
}

export interface createTaskReqBodyI {
    name: string,
    forList?: string, // List id
    endAt?: Date,
    categories?: string[],
    isFavourites?: boolean,
    description?: string,
    isCompleted?: boolean,
}