import {
    actionIncomingChangesType,
    GroupStateI,
    itemsType,
    ListStateI,
    StepStateI,
    TaskMoveTypes,
    TaskStateI,
    TodoUserDataActionI,
    TodoUserDataActionTypes,
    TodoUserDataI
} from '../../types/todoUserData'

const initialState = {
    groups : [],
    lists : [],
    tasks : [],
    steps : []
}

export const TodoUserDataReducer = ( state: TodoUserDataI = initialState, action: TodoUserDataActionI ): TodoUserDataI => {
    const sortGroupOrStep = <T extends GroupStateI | StepStateI>( a: T, b: T ) =>
        a.position - b.position
    const sortLists = ( a: ListStateI, b: ListStateI ) =>
        a.forGroup === b.forGroup ?
            a.position - b.position
            :
            (state.groups.filter(el => el._id === a.forGroup)[ 0 ]?.position || -1)
            -
            (state.groups.filter(el => el._id === b.forGroup)[ 0 ]?.position || -1)
    const sortTasks = ( a: TaskStateI, b: TaskStateI ) =>
        a.position === null ? 1 : b.position === null ? -1 : a.position - b.position
    switch ( action.type ) {
        case TodoUserDataActionTypes.TOGGLE_IS_CLOSED_GROUP:
            return {
                ...state,
                groups : state.groups.map(el => action.payload === el._id ?
                    { ...el, isClosed : !el.isClosed }
                    :
                    { ...el }
                )
            }
        case TodoUserDataActionTypes.ADD_ALL:
            const { groups, lists, steps, tasks } = action.payload
            return {
                groups : groups.length !== 0 ?
                    [
                        ...state.groups,
                        ...groups.map(el => ({
                            ...el,
                            isClosed : false
                        }))
                    ].sort(sortGroupOrStep)
                    : [...state.groups],
                lists : [...state.lists, ...lists]
                    .sort(sortLists)
                ,
                tasks : [...state.tasks, ...tasks]
                    .sort(sortTasks),
                steps : [...state.steps, ...steps]
                    .sort(sortGroupOrStep)
            }
        case TodoUserDataActionTypes.ADD_GROUP:
            return {
                ...state,
                groups : [...state.groups, {
                    ...action.payload,
                    position : state.lists.filter(el => !el.forGroup).length + state.groups.length,
                    isClosed : false
                }].sort(sortGroupOrStep),
                incoming_changes : {
                    change_pos : [
                        ...(state.incoming_changes?.change_pos || []),
                        {
                            _id : action.payload._id,
                            name : action.payload.name,
                            type : 2,
                            actionType : actionIncomingChangesType.ADD
                        }],
                    timeOfLastChange : new Date().getTime()
                }
            }
        case TodoUserDataActionTypes.ADD_LIST:
            return {
                ...state,
                lists : [...state.lists, {
                    ...action.payload,
                    position : state.lists.filter(el => !el.forGroup).length + state.groups.length
                }]
                    .sort(sortLists),
                incoming_changes : {
                    change_pos : [
                        ...(state.incoming_changes?.change_pos || []),
                        {
                            _id : action.payload._id,
                            name : action.payload.name,
                            type : 3,
                            actionType : actionIncomingChangesType.ADD
                        }],
                    timeOfLastChange : new Date().getTime()
                }
            }
        case TodoUserDataActionTypes.ADD_TASK: {
            const { _id, isMyDay, isFavourite, forList, name, createdAt, endAt } = action.payload
            return {
                ...state,
                tasks : [...state.tasks, {
                    _id,
                    name,
                    createdAt,
                    endAt,
                    forList,
                    description : '',
                    categories : [],
                    position : state.tasks.filter(el => el.forList === forList).length,
                    myDay : isMyDay ?
                        state.tasks.filter(el => typeof el.myDay === 'number').length
                        :
                        undefined,
                    favourites : isFavourite ?
                        state.tasks.filter(el => typeof el.favourites === 'number').length
                        :
                        undefined
                }].sort(sortTasks),
                incoming_changes : {
                    change_pos : [
                        ...(state.incoming_changes?.change_pos || []),
                        {
                            ...action.payload,
                            type : 1,
                            actionType : actionIncomingChangesType.ADD
                        }],
                    timeOfLastChange : new Date().getTime()
                }
            }
        }
        case TodoUserDataActionTypes.ADD_STEP:
            return {
                ...state,
                steps : [
                    ...state.steps,
                    {
                        ...action.payload,
                        isCompleted : false,
                        position : state.steps.filter(el => el.forTask === action.payload.forTask).length
                    }
                ].sort(sortGroupOrStep),
                incoming_changes : {
                    change_pos : [
                        ...(state.incoming_changes?.change_pos || []),
                        {
                            ...action.payload,
                            type : 0,
                            actionType : actionIncomingChangesType.ADD
                        }],
                    timeOfLastChange : new Date().getTime()
                }
            }
        case TodoUserDataActionTypes.CLEAR_ALL:
            return {
                groups : [],
                lists : [],
                tasks : [],
                steps : []
            }
        case TodoUserDataActionTypes.DELETE_GROUP: {
            const { _id, position } = action.payload
            const listsLength = state.lists.filter(el => el.forGroup === _id).length
            return {
                ...state,
                groups : state.groups.filter(el => el._id !== _id).map(el => ({
                        ...el,
                        position : el.position > position ? el.position - 1 + listsLength : el.position
                    })
                ),
                lists : state.lists.map(el => {
                    switch ( true ) {
                        case !el.forGroup:
                            return {
                                ...el,
                                position : el.position > position ? el.position + listsLength - 1 : el.position
                            }
                        case el.forGroup === _id:
                            return {
                                _id : el._id,
                                name : el.name,
                                position : el.position + position
                            }
                        default:
                            return { ...el }
                    }
                }).sort(sortLists),
                incoming_changes : {
                    change_pos : [
                        ...(state.incoming_changes?.change_pos || []),
                        {
                            _id,
                            type : 2,
                            actionType : actionIncomingChangesType.DELETE
                        }
                    ],
                    timeOfLastChange : new Date().getTime()
                }
            }
        }
        case TodoUserDataActionTypes.DELETE_LIST: {
            const { _id, position, forGroup } = action.payload
            const tasks = state.tasks.filter(el => el.forList === _id)
            const obj_id: {
                [ index: string ]: boolean;
            } = {}
            for ( const task of tasks ) {
                obj_id[ task._id ] = true
            }
            return {
                ...state,
                lists : state.lists.filter(el => el._id !== _id).map(el => ({
                    ...el,
                    position : el.forGroup === forGroup || ( !el.forGroup && !forGroup) ?
                        el.position > position ? el.position - 1 : el.position
                        : el.position
                })),
                groups : !forGroup ? state.groups.map(el => ({
                    ...el,
                    position : el.position > position ? el.position - 1 : el.position
                })) : [...state.groups],
                tasks : state.tasks.filter(el => el.forList !== _id),
                steps : state.steps.filter(el => obj_id[ el.forTask ]),
                incoming_changes : {
                    change_pos : [
                        ...(state.incoming_changes?.change_pos || []),
                        {
                            _id,
                            type : 3,
                            actionType : actionIncomingChangesType.DELETE
                        }
                    ],
                    timeOfLastChange : new Date().getTime()
                }
            }
        }
        case TodoUserDataActionTypes.DELETE_TASK: {
            const { _id, position, forList } = action.payload
            return {
                ...state,
                tasks : state.tasks.filter(el => el._id !== _id).map(el => ({
                    ...el,
                    position : typeof el.position === 'number' && typeof position === 'number'
                    && el.forList === forList ?
                        el.position > position ? el.position - 1 : el.position
                        : el.position
                })),
                steps : state.steps.filter(el => el.forTask !== _id),
                incoming_changes : {
                    change_pos : [
                        ...(state.incoming_changes?.change_pos || []),
                        {
                            _id,
                            type : 1,
                            actionType : actionIncomingChangesType.DELETE
                        }
                    ],
                    timeOfLastChange : new Date().getTime()
                }
            }
        }
        case TodoUserDataActionTypes.DELETE_STEP: {
            const { _id, position, forTask } = action.payload
            return {
                ...state,
                steps : state.steps.filter(el => el._id !== _id).map(el => ({
                    ...el,
                    position : el.forTask === forTask ?
                        el.position > position ? el.position - 1 : el.position
                        : el.position
                })),
                incoming_changes : {
                    change_pos : [
                        ...(state.incoming_changes?.change_pos || []),
                        {
                            _id,
                            type : 0,
                            actionType : actionIncomingChangesType.DELETE
                        }
                    ],
                    timeOfLastChange : new Date().getTime()
                }
            }
        }
        case TodoUserDataActionTypes.MOVE_LIST: {
            let { _id, toPos, fromPos, forGroup, prevGroup } = action.payload
            if ( fromPos < toPos && forGroup === prevGroup )
                toPos -= 1
            return {
                ...state,
                lists : state.lists.map(el => {
                        switch ( true ) {
                            case el._id === _id && forGroup === undefined :
                                return {
                                    _id : el._id,
                                    name : el.name,
                                    position : toPos
                                }
                            case el._id === _id && forGroup !== undefined:
                                return {
                                    ...el,
                                    position : toPos,
                                    forGroup
                                }
                            case !!forGroup && !!prevGroup:
                                return {
                                    ...el,
                                    position : el.forGroup === forGroup ?
                                        fromPos > toPos && el.position >= toPos && el.position < fromPos ?
                                            el.position + 1
                                            :
                                            fromPos < toPos && el.position > fromPos && el.position <= toPos ?
                                                el.position - 1
                                                :
                                                el.position
                                        :
                                        el.forGroup === prevGroup && el.position > toPos ?
                                            el.position - 1
                                            :
                                            el.position
                                }
                            case !!forGroup && !prevGroup:
                                return {
                                    ...el,
                                    position : el.forGroup === forGroup && el.position >= toPos ?
                                        el.position + 1
                                        :
                                        !el.forGroup && el.position > fromPos ?
                                            el.position - 1
                                            :
                                            el.position
                                }
                            case !forGroup && !!prevGroup:
                                return {
                                    ...el,
                                    position : el.forGroup === prevGroup && el.position > fromPos ? el.position - 1 :
                                        !el.forGroup && el.position >= toPos ?
                                            el.position + 1
                                            :
                                            el.position
                                }
                            case !forGroup && !prevGroup:
                                return {
                                    ...el,
                                    position : !el.forGroup ?
                                        fromPos > toPos && el.position >= toPos && el.position < fromPos ?
                                            el.position + 1
                                            :
                                            fromPos < toPos && el.position > fromPos && el.position <= toPos ?
                                                el.position - 1
                                                :
                                                el.position
                                        :
                                        el.position
                                }
                            default:
                                return el
                        }
                    }
                ).sort(sortLists),
                groups : state.groups.map(el => {
                    switch ( true ) {
                        case !!forGroup && !prevGroup:
                            return {
                                ...el,
                                position : el.position > fromPos ? el.position - 1 : el.position
                            }
                        case !!forGroup && !!prevGroup:
                            return el
                        case !forGroup && !prevGroup:
                            return {
                                ...el,
                                position : fromPos > toPos && el.position >= toPos &&
                                el.position < fromPos ?
                                    el.position + 1
                                    :
                                    fromPos < toPos && el.position <= toPos ?
                                        el.position - 1
                                        :
                                        el.position
                            }
                        case !forGroup && !!prevGroup:
                            return {
                                ...el,
                                position : el.position >= toPos ? el.position + 1 : el.position

                            }
                        default:
                            return el
                    }
                }).sort(sortGroupOrStep),
                incoming_changes : {
                    change_pos : [
                        ...(state.incoming_changes?.change_pos || []),
                        {
                            _id,
                            type : 3,
                            toPos,
                            forGroup : forGroup ? forGroup : null,
                            actionType : actionIncomingChangesType.MOVE
                        }
                    ],
                    timeOfLastChange : new Date().getTime()
                }
            }
        }
        case TodoUserDataActionTypes.MOVE_GROUP: {
            let { _id, toPos, fromPos } = action.payload
            if ( fromPos < toPos )
                toPos -= 1
            return {
                ...state,
                lists : state.lists.map(el => ({
                    ...el,
                    position : !el.forGroup ? fromPos > toPos && el.position >= toPos && el.position < fromPos ?
                            el.position + 1
                            :
                            fromPos < toPos && el.position > fromPos && el.position <= toPos ?
                                el.position - 1
                                :
                                el.position
                        :
                        el.position
                })).sort(sortLists),
                groups : state.groups.map(el => ({
                    ...el,
                    position : el._id === _id ? toPos :
                        fromPos > toPos && el.position >= toPos && el.position < fromPos ?
                            el.position + 1
                            :
                            fromPos < toPos && el.position > fromPos && el.position <= toPos ?
                                el.position - 1
                                :
                                el.position

                })).sort(sortGroupOrStep),
                incoming_changes : {
                    change_pos : [
                        ...(state.incoming_changes?.change_pos || []),
                        {
                            _id,
                            type : 2,
                            toPos,
                            actionType : actionIncomingChangesType.MOVE
                        }
                    ],
                    timeOfLastChange : new Date().getTime()
                }
            }
        }
        case TodoUserDataActionTypes.MOVE_TASK_INSIDE_LIST: {
            const { _id, toPos, fromPos, forList } = action.payload
            return {
                ...state,
                tasks : state.tasks.map(el => el._id === _id ? {
                    ...el,
                    position : toPos
                } : {
                    ...el,
                    position : forList === el.forList && el.position !== null ?
                        fromPos > toPos && el.position >= toPos && el.position < fromPos ?
                            el.position + 1
                            :
                            fromPos < toPos && el.position > fromPos && el.position <= toPos ?
                                el.position - 1
                                :
                                el.position
                        :
                        el.position
                }).sort(sortTasks),
                incoming_changes : {
                    ...state.incoming_changes,
                    change_pos : [
                        ...(state.incoming_changes?.change_pos ? state.incoming_changes?.change_pos : []),
                        {
                            _id,
                            type : 1,
                            actionType : actionIncomingChangesType.MOVE,
                            move : {
                                toPos,
                                type : TaskMoveTypes.MOVE_INSIDE_LIST
                            }
                        }
                    ],
                    timeOfLastChange : new Date().getTime()
                }
            }
        }
        case TodoUserDataActionTypes.MOVE_TASK_BETWEEN_LISTS: {
            const { _id, fromPos, fromForList, toForList } = action.payload
            return {
                ...state,
                tasks : state.tasks.map(el => {
                    switch ( true ) {
                        case el._id === _id:
                            return {
                                ...el,
                                position : state.tasks.filter(el => el.forList === toForList).length,
                                forList : toForList
                            }
                        case el.forList === fromForList:
                            return {
                                ...el,
                                position : el.position !== null && fromPos !== null && el.position > fromPos ?
                                    el.position - 1 : el.position
                            }
                        default:
                            return el
                    }
                }).sort(sortTasks),
                incoming_changes : {
                    ...state.incoming_changes,
                    change_pos : [
                        ...(state.incoming_changes?.change_pos ? state.incoming_changes?.change_pos : []),
                        {
                            _id,
                            type : 1,
                            actionType : actionIncomingChangesType.MOVE,
                            move : {
                                forList : toForList,
                                type : TaskMoveTypes.MOVE_BETWEEN_LISTS
                            }
                        }
                    ],
                    timeOfLastChange : new Date().getTime()
                }
            }
        }
        case TodoUserDataActionTypes.TASK_ADD_FAVOURITES: {
            const { _id, isCompleted } = action.payload
            return {
                ...state,
                tasks : state.tasks.map(el => el._id === _id ? {
                    ...el,
                    favourites : !isCompleted ?
                        state.tasks.filter(el => typeof el.favourites === 'number').length
                        :
                        null
                } : el),
                incoming_changes : {
                    ...state.incoming_changes,
                    change_pos : [
                        ...(state.incoming_changes?.change_pos || []),
                        {
                            _id,
                            type : 1,
                            move : {
                                type : TaskMoveTypes.FAVOURITES_ADD
                            },
                            actionType : actionIncomingChangesType.MOVE
                        }
                    ],
                    timeOfLastChange : new Date().getTime()
                }
            }
        }
        case TodoUserDataActionTypes.TASK_ADD_MY_DAY: {
            const { _id, isCompleted } = action.payload
            return {
                ...state,
                tasks : state.tasks.map(el => el._id === _id ? {
                    ...el,
                    myDay : !isCompleted ?
                        state.tasks.filter(el => typeof el.myDay === 'number').length
                        :
                        null
                } : el),
                incoming_changes : {
                    ...state.incoming_changes,
                    change_pos : [
                        ...(state.incoming_changes?.change_pos || []),
                        {
                            _id,
                            type : 1,
                            move : {
                                type : TaskMoveTypes.MY_DAY_ADD
                            },
                            actionType : actionIncomingChangesType.MOVE
                        }
                    ],
                    timeOfLastChange : new Date().getTime()
                }
            }
        }
        case TodoUserDataActionTypes.MOVE_TASK_FAVOURITES: {
            let { _id, toFavourite, fromFavourite } = action.payload
            if ( fromFavourite < toFavourite )
                toFavourite -= 1
            return {
                ...state,
                tasks : state.tasks.map(el => typeof el.favourites === 'number' ? {
                    ...el,
                    favourites : el._id === _id ? toFavourite :
                        fromFavourite > toFavourite && el.favourites >= toFavourite
                        && el.favourites < fromFavourite ?
                            el.favourites + 1
                            :
                            fromFavourite < toFavourite && el.favourites <= toFavourite ?
                                el.favourites - 1
                                :
                                el.favourites
                } : el),
                incoming_changes : {
                    ...state.incoming_changes,
                    change_pos : [
                        ...(state.incoming_changes?.change_pos || []),
                        {
                            _id,
                            actionType : actionIncomingChangesType.MOVE,
                            type : 1,
                            move : {
                                favourites : toFavourite,
                                type : TaskMoveTypes.FAVOURITES_MOVE
                            }
                        }
                    ],
                    timeOfLastChange : new Date().getTime()
                }
            }
        }
        case TodoUserDataActionTypes.MOVE_TASK_MY_DAY: {
            let { _id, fromMyDay, toMyDay } = action.payload
            if ( fromMyDay < toMyDay )
                toMyDay -= 1
            return {
                ...state,
                tasks : state.tasks.map(el => typeof el.myDay === 'number' ? {
                    ...el,
                    myDay : el._id === _id ? toMyDay :
                        fromMyDay > toMyDay && el.myDay >= toMyDay
                        && el.myDay < fromMyDay ?
                            el.myDay + 1
                            :
                            fromMyDay < toMyDay && el.myDay <= toMyDay ?
                                el.myDay - 1
                                :
                                el.myDay
                } : el),
                incoming_changes : {
                    ...state.incoming_changes,
                    change_pos : [
                        ...(state.incoming_changes?.change_pos || []),
                        {
                            _id,
                            actionType : actionIncomingChangesType.MOVE,
                            type : 1,
                            move : {
                                myDay : toMyDay,
                                type : TaskMoveTypes.MY_DAY_MOVE
                            }
                        }
                    ],
                    timeOfLastChange : new Date().getTime()
                }
            }
        }
        case TodoUserDataActionTypes.TASK_REMOVE_MY_DAY: {
            const { _id, myDay } = action.payload
            return {
                ...state,
                tasks : state.tasks.map(el => _id === el._id ? {
                        ...el,
                        myDay : undefined
                    } :
                    typeof el.myDay === 'number' && typeof myDay === 'number' ? {
                        ...el,
                        myDay : el.myDay > myDay ? --el.myDay : el.myDay
                    } : el),
                incoming_changes : {
                    ...state.incoming_changes,
                    change_pos : [
                        ...(state.incoming_changes?.change_pos || []),
                        {
                            _id,
                            type : 1,
                            move : {
                                type : TaskMoveTypes.MY_DAY_REMOVE
                            },
                            actionType : actionIncomingChangesType.MOVE
                        }
                    ],
                    timeOfLastChange : new Date().getTime()
                }
            }
        }
        case TodoUserDataActionTypes.TASK_REMOVE_FAVOURITES: {
            const { _id, favourites } = action.payload
            return {
                ...state,
                tasks : favourites !== null ? state.tasks.map(el => el._id === _id ? {
                        ...el,
                        favourites : undefined
                    } :
                    typeof el.favourites === 'number' ? {
                        ...el,
                        favourites : el.favourites > favourites ? --el.favourites : el.favourites
                    } : el) : state.tasks.map(( { favourites, ...el } ) => el._id === _id ? el : {
                    ...el, favourites
                }),
                incoming_changes : {
                    ...state.incoming_changes,
                    change_pos : [
                        ...(state.incoming_changes?.change_pos || []),
                        {
                            _id,
                            type : 1,
                            move : {
                                type : TaskMoveTypes.FAVOURITES_REMOVE
                            },
                            actionType : actionIncomingChangesType.MOVE
                        }
                    ],
                    timeOfLastChange : new Date().getTime()
                }
            }
        }
        case TodoUserDataActionTypes.TASK_TOGGLE_COMPLETE: {
            const { _id, position, myDay, favourites, completedAt } = action.payload
            return typeof position === 'number' ? {
                ...state,
                tasks : state.tasks.map(el => el._id !== _id ? el.position === null ? el : {
                    ...el,
                    position : el.position > position ? --el.position : el.position,
                    myDay : typeof el.myDay === 'number' && typeof myDay === 'number' ?
                        el.myDay > myDay ? --el.myDay : el.myDay : el.myDay,
                    favourites : typeof el.favourites === 'number' && typeof favourites === 'number' ?
                        el.favourites > favourites ?
                            --el.favourites
                            :
                            el.favourites
                        : el.favourites
                } : {
                    ...el,
                    position : null,
                    myDay : myDay !== undefined ? null : undefined,
                    favourites : favourites !== undefined ? null : undefined,
                    completedAt
                }).sort(sortTasks),
                incoming_changes : {
                    change_pos : [
                        ...(state.incoming_changes?.change_pos || []),
                        {
                            _id,
                            type : 1,
                            completedAt,
                            actionType : actionIncomingChangesType.COMPLETE
                        }
                    ],
                    timeOfLastChange : new Date().getTime()
                }
            } : {
                ...state,
                tasks : state.tasks.map(el => el._id === _id ? {
                    ...el,
                    position : state.tasks.filter(filterEl =>
                        filterEl.forList === el.forList && typeof filterEl.position === 'number').length,
                    myDay : el.myDay === null ? state.tasks.filter(
                        filterEl => typeof filterEl.myDay === 'number').length : undefined,
                    favourites : el.favourites === null ? state.tasks.filter(
                        filterEl => typeof filterEl.favourites === 'number').length : undefined,
                    completedAt : undefined
                } : el).sort(sortTasks),
                incoming_changes : {
                    change_pos : [
                        ...(state.incoming_changes?.change_pos || []),
                        {
                            _id,
                            type : 1,
                            completedAt : action.payload.completedAt,
                            actionType : actionIncomingChangesType.COMPLETE
                        }
                    ],
                    timeOfLastChange : new Date().getTime()
                }
            }
        }
        case TodoUserDataActionTypes.STEP_TOGGLE_COMPLETE: {
            const { _id } = action.payload
            return {
                ...state,
                steps : state.steps.map(el => el._id === _id ? {
                    ...el,
                    isCompleted : !el.isCompleted
                } : el).sort(sortGroupOrStep),
                incoming_changes : {
                    change_pos : [
                        ...(state.incoming_changes?.change_pos || []),
                        {
                            _id,
                            type : 0,
                            actionType : actionIncomingChangesType.COMPLETE
                        }
                    ],
                    timeOfLastChange : new Date().getTime()
                }
            }
        }
        case TodoUserDataActionTypes.MOVE_STEP: {
            let { _id, toPos, fromPos, forTask } = action.payload
            if ( fromPos < toPos )
                toPos -= 1
            return {
                ...state,
                steps : state.steps.map(el => (
                    {
                        ...el,
                        position : el.forTask === forTask ? el._id === _id ? toPos :
                                fromPos > toPos && el.position >= toPos && el.position < fromPos ?
                                    el.position + 1
                                    :
                                    fromPos < toPos && el.position <= toPos ?
                                        el.position - 1
                                        :
                                        el.position
                            :
                            el.position
                    }
                )).sort(sortGroupOrStep),
                incoming_changes : {
                    ...state.incoming_changes,
                    change_pos : [
                        ...(state.incoming_changes?.change_pos || []),
                        {
                            _id,
                            type : 0,
                            toPos,
                            actionType : actionIncomingChangesType.MOVE
                        }
                    ],
                    timeOfLastChange : new Date().getTime()
                }
            }
        }
        case TodoUserDataActionTypes.CHANGE_OTHER_TASK_DATA: {
            let exist = false
            const { _id, description, endAt, categories } = action.payload
            return {
                ...state,
                tasks : state.tasks.map(el => el._id === _id ? {
                    ...el,
                    description : description ?? el.description,
                    endAt : endAt === null ? undefined : endAt ?? el.endAt,
                    categories : categories ?? el.categories
                } : el),
                incoming_changes : {
                    ...state.incoming_changes,
                    change_data : {
                        items : [
                            ...(state.incoming_changes?.change_data ? state.incoming_changes.change_data.items.map(
                                el => {
                                    if ( el._id === _id ) {
                                        exist = true
                                        return {
                                            ...el,
                                            ...('description' in el ? { description : description ?? el.description } : {}),
                                            ...('endAt' in el ? { endAt : endAt ?? el.endAt } : {}),
                                            ...('categories' in el ? { categories : categories ?? el.categories } : {})
                                        }
                                    }
                                    return el
                                }
                            ) : []),
                            ...(!exist ? [{
                                _id,
                                type : 1 as 1,
                                ...(endAt ? { endAt } : {}),
                                ...(description !== undefined ? { description } : {}),
                                ...(categories ? { categories } : {})
                            }] : [])
                        ]
                    },
                    timeOfLastChange : new Date().getTime()
                }
            }
        }
        case TodoUserDataActionTypes.CLEAR_INCOMING_CHANGES:
            return {
                groups : state.groups,
                lists : state.lists,
                steps : state.steps,
                tasks : state.tasks
            }
        case TodoUserDataActionTypes.START_RENAMING:
            return {
                ...state,
                incoming_changes : {
                    ...state.incoming_changes,
                    change_data : {
                        ...action.payload,
                        items : state.incoming_changes?.change_data?.items || []
                    }
                }
            }
        case TodoUserDataActionTypes.FINISH_RENAMING_SUCCESS: {
            if ( !state.incoming_changes?.change_data?._id )
                return state

            let exist = false
            if ( state.incoming_changes.change_data.items )
                state.incoming_changes.change_data.items = state.incoming_changes.change_data.items.map(
                    el => {
                        if ( el._id === state.incoming_changes?.change_data?._id ) {
                            exist = true
                            return {
                                ...el,
                                name : action.payload
                            }
                        } else {
                            return el
                        }
                    }
                )
            switch ( state.incoming_changes.change_data.item_type ) {
                case itemsType.STEP:
                    return {
                        ...state,
                        steps : state.steps.map(
                            el => el._id === state.incoming_changes?.change_data?._id ? {
                                ...el,
                                name : action.payload
                            } : el
                        ),
                        incoming_changes : {
                            ...state.incoming_changes,
                            change_data : {
                                items : [
                                    ...(state.incoming_changes.change_data.items || []),
                                    ...(!exist ? [{
                                        _id : state.incoming_changes.change_data._id,
                                        type : 0 as 0,
                                        name : action.payload
                                    }] : [])
                                ]
                            },
                            timeOfLastChange : new Date().getTime()
                        }
                    }
                case itemsType.TASK:
                    return {
                        ...state,
                        tasks : state.tasks.map(
                            el => el._id === state.incoming_changes?.change_data?._id ? {
                                ...el,
                                name : action.payload
                            } : el
                        ),
                        incoming_changes : {
                            ...state.incoming_changes,
                            change_data : {
                                items : [
                                    ...(state.incoming_changes.change_data.items || []),
                                    ...(!exist ?
                                        [{
                                            _id : state.incoming_changes.change_data._id,
                                            type : 1 as 1,
                                            name : action.payload
                                        }] : [])
                                ]
                            },
                            timeOfLastChange : new Date().getTime()
                        }
                    }
                case itemsType.LIST:
                    return {
                        ...state,
                        lists : state.lists.map(
                            el => el._id === state.incoming_changes?.change_data?._id ? {
                                ...el,
                                name : action.payload
                            } : el
                        ),
                        incoming_changes : {
                            ...state.incoming_changes,
                            change_data : {
                                items : [
                                    ...(state.incoming_changes.change_data.items || []),
                                    ...(!exist ?
                                        [{
                                            _id : state.incoming_changes.change_data._id,
                                            type : 3 as 3,
                                            name : action.payload
                                        }] : [])
                                ]
                            },
                            timeOfLastChange : new Date().getTime()
                        }
                    }
                case itemsType.GROUP:
                    return {
                        ...state,
                        groups : state.groups.map(
                            el => el._id === state.incoming_changes?.change_data?._id ? {
                                ...el,
                                name : action.payload
                            } : el
                        ),
                        incoming_changes : {
                            ...state.incoming_changes,
                            change_data : {
                                items : [
                                    ...(state.incoming_changes.change_data.items || []),
                                    ...(!exist ?
                                        [{
                                            _id : state.incoming_changes.change_data._id,
                                            type : 2 as 2,
                                            name : action.payload
                                        }] : [])
                                ]
                            },
                            timeOfLastChange : new Date().getTime()
                        }
                    }
                default:
                    return state
            }
        }
        case TodoUserDataActionTypes.FINISH_RENAMING_FAILED:
            return {
                steps : state.steps,
                tasks : state.tasks,
                lists : state.lists,
                groups : state.groups,
                ...((state.incoming_changes?.timeOfLastChange || state.incoming_changes?.change_pos
                    || state.incoming_changes?.change_data?.items) && {
                    incoming_changes : {
                        ...(state.incoming_changes?.change_data?.items ? {
                            change_data : {
                                items : state.incoming_changes.change_data.items
                            }
                        } : {}),
                        ...(state.incoming_changes?.timeOfLastChange ? {
                            timeOfLastChange : state.incoming_changes.timeOfLastChange
                        } : {}),
                        ...(state.incoming_changes?.change_pos ? {
                            change_pos : state.incoming_changes.change_pos
                        } : {})
                    }
                })
            }
        default:
            return { ...state }
    }
}