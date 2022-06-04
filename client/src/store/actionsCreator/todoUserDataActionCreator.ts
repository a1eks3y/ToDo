import {
    addAllAction,
    addGroupAction,
    addListAction, addStepAction,
    addTaskActionI, Category,
    clearIncomingChanges,
    deleteGroupActionI,
    deleteListActionI, deleteStepActionI,
    deleteTaskActionI,
    finishRenamingItemFailed,
    finishRenamingItemSuccess,
    GroupStateI,
    itemsType,
    ListStateI,
    moveGroupAction,
    moveListAction,
    moveStepAction,
    startRenamingItem,
    StepStateI,
    TaskActionI,
    TaskStateI, TodoUserDataActionI,
    TodoUserDataActionTypes, toggleStepCompleteAction,
    toggleTaskCompleteAtActionPayload
} from '../../types/todoUserData'

export const addStepActionCreator = ( payload: {
    _id: string, name: string, forTask: string
} ): addStepAction => ({
    type : TodoUserDataActionTypes.ADD_STEP,
    payload : {
        ...payload
    }
})

export const addTaskActionCreator = ( payload: {
    _id: string, name: string, createdAt: [number, number, number, number, number, number],
    endAt?: [number, number, number], isMyDay?: true, isFavourite?: true, forList?: string
} ): addTaskActionI => ({
    type : TodoUserDataActionTypes.ADD_TASK,
    payload : {
        ...payload
    }
})

export const addListActionCreator = ( payload: { _id: string, name: string } ): addListAction => ({
    type : TodoUserDataActionTypes.ADD_LIST,
    payload : {
        ...payload
    }
})

export const addGroupActionCreator = ( payload: { _id: string, name: string } ): addGroupAction => ({
    type : TodoUserDataActionTypes.ADD_GROUP,
    payload : {
        ...payload
    }
})

export const deleteStepActionCreator = (
    { _id, position, forTask }: { _id: string, position: number, forTask: string }
): deleteStepActionI => ({
    type : TodoUserDataActionTypes.DELETE_STEP,
    payload : {
        _id,
        position,
        forTask
    }
})

export const deleteTaskActionCreator = (
    { _id, position, forList }: { _id: string, position: number | null, forList?: string }
): deleteTaskActionI => ({
    type : TodoUserDataActionTypes.DELETE_TASK,
    payload : {
        _id,
        position,
        forList
    }
})

export const deleteListActionCreator = ( { _id, position }: { _id: string, position: number } ): deleteListActionI => ({
    type : TodoUserDataActionTypes.DELETE_LIST,
    payload : {
        _id,
        position
    }
})

export const deleteGroupActionCreator = (
    { _id, position }: { _id: string, position: number }
): deleteGroupActionI => ({
    type : TodoUserDataActionTypes.DELETE_GROUP,
    payload : {
        _id,
        position
    }
})

export const moveGroupActionCreator = ( {
    _id, toPos, fromPos
}: { _id: string, fromPos: number, toPos: number } ): moveGroupAction => ({
    type : TodoUserDataActionTypes.MOVE_GROUP,
    payload : {
        _id,
        fromPos,
        toPos
    }
})

export const moveListActionCreator = ( {
        _id, toPos, fromPos, forGroup, prevGroup
    }: { _id: string, toPos: number, fromPos: number, forGroup?: string, prevGroup?: string }
): moveListAction => ({
    type : TodoUserDataActionTypes.MOVE_LIST,
    payload : {
        _id,
        toPos,
        fromPos,
        forGroup,
        prevGroup
    }
})

export const moveTaskBetweenListsActionCreator = ( { _id, toPos, fromPos, fromForList, toForList }: {
    _id: string, toPos: number | null, fromPos: number | null, fromForList?: string, toForList?: string
} ): TaskActionI => ({
    type : TodoUserDataActionTypes.MOVE_TASK_BETWEEN_LISTS,
    payload : {
        _id,
        toPos,
        fromPos,
        fromForList,
        toForList
    }
})
export const moveTaskInsideListActionCreator = ( { _id, toPos, fromPos, forList }: {
    _id: string, toPos: number, fromPos: number, forList?: string
} ): TaskActionI => ({
    type : TodoUserDataActionTypes.MOVE_TASK_INSIDE_LIST,
    payload : {
        _id,
        toPos,
        fromPos,
        forList
    }
})

export const moveStepActionCreator = (
    { _id, toPos, fromPos, forTask }: { _id: string, toPos: number, fromPos: number, forTask: string }
): moveStepAction => ({
    type : TodoUserDataActionTypes.MOVE_STEP,
    payload : {
        _id,
        toPos,
        fromPos,
        forTask
    }
})

export const toggleStepCompleteActionCreator = (
    { _id }: { _id: string }
): toggleStepCompleteAction => ({
    type : TodoUserDataActionTypes.STEP_TOGGLE_COMPLETE,
    payload : {
        _id
    }
})

export const addAllActionCreator = ( { groups, lists, steps, tasks }: {
    groups: GroupStateI[],
    lists: ListStateI[],
    tasks: TaskStateI[],
    steps: StepStateI[]
} ): addAllAction => ({
    type : TodoUserDataActionTypes.ADD_ALL,
    payload : {
        groups,
        lists,
        steps,
        tasks
    }
})

export const clearIncomingChangesActionCreator = (): clearIncomingChanges => ({
    type : TodoUserDataActionTypes.CLEAR_INCOMING_CHANGES
})

export const finishRenamingItemSuccessActionCreator = ( newName: string ): finishRenamingItemSuccess => ({
    type : TodoUserDataActionTypes.FINISH_RENAMING_SUCCESS,
    payload : newName
})
export const finishRenamingItemFailedActionCreator = (): finishRenamingItemFailed => ({
    type : TodoUserDataActionTypes.FINISH_RENAMING_FAILED
})
export const startRenamingStep = ( _id: string ): startRenamingItem => ({
    type : TodoUserDataActionTypes.START_RENAMING,
    payload : {
        _id,
        item_type : itemsType.STEP
    }
})
export const startRenamingTask = ( _id: string ): startRenamingItem => ({
    type : TodoUserDataActionTypes.START_RENAMING,
    payload : {
        _id,
        item_type : itemsType.TASK
    }
})
export const startRenamingList = ( _id: string ): startRenamingItem => ({
    type : TodoUserDataActionTypes.START_RENAMING,
    payload : {
        _id,
        item_type : itemsType.LIST
    }
})
export const startRenamingGroup = ( _id: string ): startRenamingItem => ({
    type : TodoUserDataActionTypes.START_RENAMING,
    payload : {
        _id,
        item_type : itemsType.GROUP
    }
})

export const addFavouriteActionCreator = (
    { _id, isCompleted }: { _id: string, isCompleted: boolean }
): TaskActionI => ({
    type : TodoUserDataActionTypes.TASK_ADD_FAVOURITES,
    payload : {
        _id,
        isCompleted
    }
})

export const removeFavouriteActionCreator = ( {
    _id,
    favourites
}: { _id: string, favourites: null | number } ): TaskActionI => ({
    type : TodoUserDataActionTypes.TASK_REMOVE_FAVOURITES,
    payload : {
        _id,
        favourites
    }
})
export const addMyDayActionCreator = (
    { _id, isCompleted }: { _id: string, isCompleted: boolean }
): TaskActionI => ({
    type : TodoUserDataActionTypes.TASK_ADD_MY_DAY,
    payload : {
        _id,
        isCompleted
    }
})

export const removeMyDayActionCreator = ( {
    _id,
    myDay
}: { _id: string, myDay: null | number } ): TaskActionI => ({
    type : TodoUserDataActionTypes.TASK_REMOVE_MY_DAY,
    payload : {
        _id,
        myDay
    }
})

export const TaskToggleCompleteActionCreator = (
    { _id, position, completedAt, favourites, myDay }: toggleTaskCompleteAtActionPayload
): TaskActionI => ({
    type : TodoUserDataActionTypes.TASK_TOGGLE_COMPLETE,
    payload : {
        _id,
        favourites,
        position,
        completedAt,
        myDay
    }
}) as TaskActionI

export const changeTaskDataActionCreator = ( { _id, categories, endAt, description }: {
    _id: string, categories?: Category[], endAt?: [number, number, number] | null, description?: string
} ): TaskActionI => ({
    type : TodoUserDataActionTypes.CHANGE_OTHER_TASK_DATA,
    payload : {
        _id,
        categories,
        endAt,
        description
    }
})

export const clearAllDataActionCreator = (): TodoUserDataActionI => ({
    type : TodoUserDataActionTypes.CLEAR_ALL
})