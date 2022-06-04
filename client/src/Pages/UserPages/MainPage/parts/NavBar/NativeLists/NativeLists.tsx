import * as React from 'react'
import { useMemo } from 'react'
import s from './NativeLists.module.css'
import NativeList from './NativeList/NativeList'
import { useTypedSelector } from '../../../../../../hooks/useTypedSelector'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { TaskActionI } from '../../../../../../types/todoUserData'
import { dragItemTypes } from '../../../../../../types/drag&drop'
import {
    addFavouriteActionCreator,
    addMyDayActionCreator, moveTaskBetweenListsActionCreator
} from '../../../../../../store/actionsCreator/todoUserDataActionCreator'

interface taskI {
    favouritesTasks: number,
    completedAtTasks: number,
    myDayTasks: number,
    plannedTasks: number,
    tasksList: number
}

const NativeLists: React.FC = () => {
    const tasks = useTypedSelector(state => state.todoUserData.tasks)
    const { plannedTasks, favouritesTasks, tasksList, completedAtTasks, myDayTasks } = useMemo<taskI>(() => {
        const initObj: taskI = {
            completedAtTasks : 0,
            myDayTasks : 0,
            favouritesTasks : 0,
            plannedTasks : 0,
            tasksList : 0
        }
        for ( const task of tasks ) {
            if ( task.favourites !== undefined ) initObj.favouritesTasks++
            if ( task.completedAt?.length ) initObj.completedAtTasks++
            if ( task.myDay !== undefined ) initObj.myDayTasks++
            if ( task.endAt?.length ) initObj.plannedTasks++
            if ( !task.forList ) initObj.tasksList++
        }
        return initObj
    }, [tasks])
    const dispatch = useDispatch<Dispatch<TaskActionI>>()
    const dragItem = useTypedSelector(state => state.dragAndDrop.dragItem)
    const addTaskToMyDay = () => {
        if ( dragItem?.itemType === dragItemTypes.task && dragItem.myDay === undefined )
            dispatch(addMyDayActionCreator({
                _id : dragItem._id,
                isCompleted : dragItem.isCompleted
            }))
    }
    const addTaskToFavourites = () => {
        if ( dragItem?.itemType === dragItemTypes.task && dragItem.favourites === undefined )
            dispatch(addFavouriteActionCreator({
                _id : dragItem._id,
                isCompleted : dragItem.isCompleted
            }))
    }
    const moveToTask = () => {
        if ( dragItem?.itemType === dragItemTypes.task && dragItem.forList !== undefined )
            dispatch(moveTaskBetweenListsActionCreator({
                _id : dragItem._id,
                fromForList : dragItem.forList,
                toForList : undefined,
                fromPos : dragItem.position,
                toPos : dragItem.position === null ?
                    null : tasks.filter(el => el.forList === undefined).length
            }))
    }
    return (
        <div className={ s.lists }>
            <NativeList numberOfTasks={ myDayTasks } name={ 'My day' } onMouseUp={ addTaskToMyDay }
                        active_color={ 'black' } key={ 'My day' }>
                <i className={ s.iconSize_24 + ' ' + s.icon_Sunny }/>
            </NativeList>
            <NativeList numberOfTasks={ favouritesTasks } name={ 'Favourites' } onMouseUp={ addTaskToFavourites }
                        active_color={ '#2e5cdb' } key={ 'Favourites' }>
                <i className={ s.iconSize_24 + ' ' + s.icon_FavoriteStar }/>
            </NativeList>
            <NativeList numberOfTasks={ plannedTasks } name={ 'Planned' }
                        active_color={ '#2e5cdb' } key={ 'Planned' }>
                <i className={ s.iconSize_24 + ' ' + s.icon_Calendar }/>
            </NativeList>
            <NativeList numberOfTasks={ tasks.length } name={ 'All' }
                        active_color={ '#c23732' } key={ 'All' }>
                <i className={ s.iconSize_24 }>
                    <svg focusable="false">
                        <path
                            d="M3 12c0-2.168 1.36-4 3.5-4 1.352 0 2.291.498 3.053 1.26.486.486.899 1.078 1.293
                        1.729.176-.316.363-.647.564-.982a9.018 9.018 0 00-1.15-1.454C9.334 7.627 8.148 7 6.5 7 3.64 7 2
                        9.466 2 12s1.64 5 4.5 5c1.648 0 2.834-.627 3.76-1.553.92-.919 1.551-2.078 2.177-3.204.633-1.14
                        1.225-2.198 2.01-2.983C15.21 8.498 16.148 8 17.5 8c2.14 0 3.5 1.832 3.5 4s-1.36 4-3.5 4c-1.352
                        0-2.291-.498-3.053-1.26-.486-.486-.899-1.078-1.293-1.729-.176.316-.363.647-.564.982a9.02 9.02 0
                        001.15 1.454c.926.926 2.112 1.553 3.76 1.553 2.86 0 4.5-2.466 4.5-5s-1.64-5-4.5-5c-1.648
                        0-2.834.627-3.76 1.553-.893.893-1.547 2.07-2.159 3.171-.585 1.054-1.168 2.155-2.028 3.016C8.79
                        15.502 7.852 16 6.5 16 4.36 16 3 14.168 3 12z"/>
                    </svg>
                </i>
            </NativeList>
            <NativeList numberOfTasks={ completedAtTasks } name={ 'Completed' }
                        active_color={ '#c23732' } key={ 'Completed' }>
                <i className={ s.iconSize_24 }>
                    <svg focusable="false" viewBox="0 0 24 24">
                        <g fillRule="evenodd">
                            <path
                                d="M12 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8m0-17c-4.963 0-9 4.037-9
                            9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9"/>
                            <path d="M10.9902 13.3027l-2.487-2.51-.71.704 3.193 3.224 5.221-5.221-.707-.707z"/>
                        </g>
                    </svg>
                </i>
            </NativeList>
            <NativeList numberOfTasks={ tasksList } name={ 'Tasks' } onMouseUp={ moveToTask }
                        active_color={ '#2e5cdb' } key={ 'Tasks' }>
                <i className={ s.iconSize_24 + ' ' + s.icon_Home }/>
            </NativeList>
        </div>
    )
}

export default NativeLists