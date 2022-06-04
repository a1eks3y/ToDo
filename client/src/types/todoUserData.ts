export enum TaskMoveTypes {
    MOVE_INSIDE_LIST = 'MOVE_INSIDE_LIST',
    MOVE_BETWEEN_LISTS = 'MOVE_BETWEEN_LISTS',
    MY_DAY_MOVE = 'MY_DAY_MOVE',
    MY_DAY_ADD = 'MY_DAY_ADD',
    MY_DAY_REMOVE = 'MY_DAY_REMOVE',
    FAVOURITES_MOVE = 'FAVOURITES_MOVE',
    FAVOURITES_ADD = 'FAVOURITES_ADD',
    FAVOURITES_REMOVE = 'FAVOURITES_REMOVE'
}

export type GroupStateI = {
    _id: string,
    name: string,
    position: number,
    isClosed: boolean
}

export interface addGroupAction {
    type: TodoUserDataActionTypes.ADD_GROUP
    payload: {
        _id: string,
        name: string
    }
}

export interface moveGroupAction {
    type: TodoUserDataActionTypes.MOVE_GROUP
    payload: {
        _id: string,
        fromPos: number,
        toPos: number
    }
}

interface toggleIsClosedAction {
    type: TodoUserDataActionTypes.TOGGLE_IS_CLOSED_GROUP
    payload: string // _id
}

export interface deleteGroupActionI {
    type: TodoUserDataActionTypes.DELETE_GROUP
    payload: {
        _id: string,
        position: number
    }
}

export type GroupActionI = addGroupAction | moveGroupAction | toggleIsClosedAction
    | deleteGroupActionI

export type ListStateI = {
    _id: string,
    name: string,
    forGroup?: string,
    position: number
}

export interface addListAction {
    type: TodoUserDataActionTypes.ADD_LIST
    payload: {
        _id: string,
        name: string
    }
}

export interface moveListAction {
    type: TodoUserDataActionTypes.MOVE_LIST
    payload: {
        _id: string,
        toPos: number,
        fromPos: number,
        forGroup?: string,
        prevGroup?: string
    }
}

export interface deleteListActionI {
    type: TodoUserDataActionTypes.DELETE_LIST
    payload: {
        _id: string,
        position: number,
        forGroup?: string
    }
}

export type ListActionI = addListAction | moveListAction | deleteListActionI

export enum TaskCategories {
    BLUE = 'Blue',
    RED = 'Red',
    ORANGE = 'Orange',
    GREEN = 'Green',
    YELLOW = 'Yellow',
    PURPLE = 'Purple'
}

export type Category = TaskCategories.BLUE | TaskCategories.GREEN | TaskCategories.RED |
    TaskCategories.YELLOW | TaskCategories.ORANGE | TaskCategories.PURPLE
export type TaskStateI = {
    _id: string,
    name: string,
    createdAt: [number, number, number, number, number, number],
    endAt?: [number, number, number],
    categories: Category[] | never[],
    myDay?: number | null,
    description: string,
    favourites?: number | null,
    completedAt?: [number, number, number, number, number, number],
    forList?: string,
    position: number | null
}

export interface addTaskActionI {
    type: TodoUserDataActionTypes.ADD_TASK
    payload: createTaskPayload
}

export interface createTaskPayload {
    _id: string,
    name: string,
    createdAt: [number, number, number, number, number, number],
    endAt?: [number, number, number],
    isMyDay?: true,
    isFavourite?: true,
    forList?: string
}

export interface deleteTaskActionI {
    type: TodoUserDataActionTypes.DELETE_TASK
    payload: {
        _id: string,
        position: number | null,
        forList?: string
    }
}

export interface moveTaskInsideListAction {
    type: TodoUserDataActionTypes.MOVE_TASK_INSIDE_LIST
    payload: {
        _id: string,
        toPos: number,
        fromPos: number,
        forList?: string
    }
}

export interface moveTaskBetweenListsAction {
    type: TodoUserDataActionTypes.MOVE_TASK_BETWEEN_LISTS
    payload: {
        _id: string,
        toPos: null | number,
        fromPos: null | number,
        fromForList?: string,
        toForList?: string
    }
}

interface moveMyDayTaskAction {
    type: TodoUserDataActionTypes.MOVE_TASK_MY_DAY,
    payload: {
        _id: string,
        fromMyDay: number,
        toMyDay: number
    }
}

interface moveFavouriteTaskAction {
    type: TodoUserDataActionTypes.MOVE_TASK_FAVOURITES,
    payload: {
        _id: string,
        fromFavourite: number,
        toFavourite: number
    }
}

interface addFavouriteTaskAction {
    type: TodoUserDataActionTypes.TASK_ADD_FAVOURITES,
    payload: {
        _id: string,
        isCompleted: boolean
    }
}

interface removeFavouriteTaskAction {
    type: TodoUserDataActionTypes.TASK_REMOVE_FAVOURITES,
    payload: {
        _id: string,
        favourites: number | null
    }
}

interface addMyDayTaskAction {
    type: TodoUserDataActionTypes.TASK_ADD_MY_DAY,
    payload: {
        _id: string,
        isCompleted: boolean
    }
}

interface removeMyDayTaskAction {
    type: TodoUserDataActionTypes.TASK_REMOVE_MY_DAY,
    payload: {
        _id: string,
        myDay: number | null
    }
}

export type toggleTaskCompleteAtActionPayload = {
    _id: string,
    position: number,
    myDay?: number,
    favourites?: number,
    completedAt: [number, number, number, number, number, number]
} | {
    _id: string,
    position: null,
    myDay?: null,
    favourites?: null,
    completedAt: undefined
}

interface toggleTaskCompleteAtAction {
    type: TodoUserDataActionTypes.TASK_TOGGLE_COMPLETE,
    payload: toggleTaskCompleteAtActionPayload
}

interface changeTaskDataAction {
    type: TodoUserDataActionTypes.CHANGE_OTHER_TASK_DATA,
    payload: {
        _id: string,
        endAt?: [number, number, number] | null,
        categories?: Category[],
        description?: string
    }
}

export type TaskActionI = addTaskActionI | moveTaskInsideListAction | moveTaskBetweenListsAction | deleteTaskActionI |
    moveFavouriteTaskAction | moveMyDayTaskAction | addFavouriteTaskAction | removeFavouriteTaskAction |
    addMyDayTaskAction | removeMyDayTaskAction | toggleTaskCompleteAtAction | changeTaskDataAction

export type StepStateI = {
    _id: string,
    name: string,
    isCompleted: boolean,
    forTask: string,
    position: number
}

export interface addStepAction {
    type: TodoUserDataActionTypes.ADD_STEP
    payload: {
        _id: string,
        name: string,
        forTask: string
    }
}

export interface moveStepAction {
    type: TodoUserDataActionTypes.MOVE_STEP
    payload: {
        _id: string,
        fromPos: number,
        toPos: number,
        forTask: string
    }
}

export interface deleteStepActionI {
    type: TodoUserDataActionTypes.DELETE_STEP
    payload: {
        _id: string,
        forTask: string,
        position: number
    }
}

export interface toggleStepCompleteAction {
    type: TodoUserDataActionTypes.STEP_TOGGLE_COMPLETE,
    payload: {
        _id: string
    }
}

export type StepActionI = addStepAction | moveStepAction | deleteStepActionI | toggleStepCompleteAction

export interface addAllAction {
    type: TodoUserDataActionTypes.ADD_ALL
    payload: {
        groups: GroupStateI[],
        lists: ListStateI[],
        tasks: TaskStateI[],
        steps: StepStateI[],
    }
}

export interface TodoUserDataI {
    groups: GroupStateI[],
    lists: ListStateI[],
    tasks: TaskStateI[],
    steps: StepStateI[],
    incoming_changes?: {
        change_data?: {
            item_type?: itemsType.STEP | itemsType.TASK | itemsType.LIST | itemsType.GROUP
            _id?: string,
            items: changeData[]
        },
        change_pos?: (itemForMove | itemForDelete | itemForAdd | itemForComplete)[],
        timeOfLastChange?: number // new Date().getTime()
    }
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
    endAt?: [number, number, number] | [], // [year, month, day]
    categories?: Category[],
    description?: string,
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

export type changeData = changeStepData | changeTaskData | changeListData | changeGroupData

export enum itemsType {
    STEP = 'STEP',
    TASK = 'TASK',
    LIST = 'LIST',
    GROUP = 'GROUP'
}

export enum actionIncomingChangesType {
    DELETE = 'DELETE',
    MOVE = 'MOVE',
    ADD = 'ADD',
    COMPLETE = 'COMPLETE'
}

export type moveTaskType = {
    toPos: number,
    type: TaskMoveTypes.MOVE_INSIDE_LIST
} | {
    forList?: string,
    type: TaskMoveTypes.MOVE_BETWEEN_LISTS
} | {
    myDay: number,
    type: TaskMoveTypes.MY_DAY_MOVE
} | {
    type: TaskMoveTypes.MY_DAY_ADD | TaskMoveTypes.MY_DAY_REMOVE
        | TaskMoveTypes.FAVOURITES_REMOVE | TaskMoveTypes.FAVOURITES_ADD
} | {
    favourites: number,
    type: TaskMoveTypes.FAVOURITES_MOVE
}
export type itemForMove = {
    _id: string,
    toPos: number,
    type: 3,
    forGroup?: string | null,
    actionType: actionIncomingChangesType.MOVE
} | {
    _id: string,
    move: moveTaskType,
    type: 1,
    actionType: actionIncomingChangesType.MOVE
} | {
    _id: string,
    toPos: number,
    type: 0 | 2,
    actionType: actionIncomingChangesType.MOVE
}

export interface itemForDelete {
    _id: string,
    type: 0 | 1 | 2 | 3,
    actionType: actionIncomingChangesType.DELETE
}

export type itemForAdd = {
    _id: string,
    name: string,
    type: 2 | 3,
    actionType: actionIncomingChangesType.ADD,
    forTask?: string,
} | {
    type: 1,
    actionType: actionIncomingChangesType.ADD,
    _id: string,
    name: string,
    createdAt: [number, number, number, number, number, number],
    endAt?: [number, number, number],
    isMyDay?: true,
    isFavourite?: true,
    forList?: string
} | {
    _id: string,
    name: string,
    type: 0,
    actionType: actionIncomingChangesType.ADD,
    forTask: string,
}

export type itemForComplete = {
    _id: string,
    completedAt?: [number, number, number, number, number, number],
    type: 1
    actionType: actionIncomingChangesType.COMPLETE
} | {
    _id: string,
    type: 0
    actionType: actionIncomingChangesType.COMPLETE
}

export type changePosT = (itemForMove | itemForDelete | itemForAdd | itemForComplete)[]

export enum TodoUserDataActionTypes {
    ADD_ALL = '@todoUserData/ADD_ALL',
    CLEAR_ALL = '@todoUserData/CLEAR_ALL',
    ADD_GROUP = '@todoUserData/ADD_GROUP',
    DELETE_GROUP = '@todoUserData/DELETE_GROUP',
    TOGGLE_IS_CLOSED_GROUP = '@todoUserData/TOGGLE_IS_CLOSED_GROUP',
    MOVE_GROUP = '@todoUserData/MOVE_GROUP',
    ADD_LIST = '@todoUserData/ADD_LIST',
    DELETE_LIST = '@todoUserData/DELETE_LIST',
    MOVE_LIST = '@todoUserData/MOVE_LIST',
    ADD_TASK = '@todoUserData/ADD_TASK',
    DELETE_TASK = '@todoUserData/DELETE_TASK',
    MOVE_TASK_INSIDE_LIST = '@todoUserData/MOVE_TASK_INSIDE_LIST',
    MOVE_TASK_BETWEEN_LISTS = '@todoUserData/MOVE_TASK_BETWEEN_LISTS',
    MOVE_TASK_FAVOURITES = '@todoUserData/MOVE_TASK_FAVOURITES',
    MOVE_TASK_MY_DAY = '@todoUserData/MOVE_TASK_MY_DAY',
    TASK_ADD_MY_DAY = '@todoUserData/TASK_ADD_MY_DAY',
    TASK_ADD_FAVOURITES = '@todoUserData/TASK_ADD_FAVOURITES',
    TASK_REMOVE_MY_DAY = '@todoUserData/TASK_REMOVE_MY_DAY',
    TASK_REMOVE_FAVOURITES = '@todoUserData/TASK_REMOVE_FAVOURITES',
    TASK_TOGGLE_COMPLETE = '@todoUserData/TASK_TOGGLE_COMPLETE',
    ADD_STEP = '@todoUserData/ADD_STEP',
    DELETE_STEP = '@todoUserData/DELETE_STEP',
    MOVE_STEP = '@todoUserData/MOVE_STEP',
    STEP_TOGGLE_COMPLETE = '@todoUserData/STEP_TOGGLE_COMPLETE',
    CLEAR_INCOMING_CHANGES = '@todoUserData/CLEAR_INCOMING_CHANGES',
    START_RENAMING = '@todoUserData/START_RENAMING',
    FINISH_RENAMING_SUCCESS = '@todoUserData/FINISH_RENAMING_SUCCESS',
    FINISH_RENAMING_FAILED = '@todoUserData/FINISH_RENAMING_FAILED',
    CHANGE_OTHER_TASK_DATA = '@todoUserData/CHANGE_OTHER_TASK_DATA',
}

export interface clearAllUserData {
    type: TodoUserDataActionTypes.CLEAR_ALL
}

export interface clearIncomingChanges {
    type: TodoUserDataActionTypes.CLEAR_INCOMING_CHANGES,
}

export interface startRenamingItem {
    type: TodoUserDataActionTypes.START_RENAMING,
    payload: {
        _id: string,
        item_type: itemsType.STEP | itemsType.TASK | itemsType.LIST | itemsType.GROUP
    } // item._id
}

export interface finishRenamingItemSuccess {
    type: TodoUserDataActionTypes.FINISH_RENAMING_SUCCESS,
    payload: string // name
}

export interface finishRenamingItemFailed {
    type: TodoUserDataActionTypes.FINISH_RENAMING_FAILED
}

export type TodoUserDataActionI = clearAllUserData | clearIncomingChanges | GroupActionI | ListActionI | TaskActionI
    | StepActionI | addAllAction | startRenamingItem | finishRenamingItemSuccess | finishRenamingItemFailed
