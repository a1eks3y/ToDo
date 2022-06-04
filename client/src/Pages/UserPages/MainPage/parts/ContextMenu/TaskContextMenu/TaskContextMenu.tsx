import * as React from 'react'
import { CSSProperties, useState } from 'react'
import s from './TaskContextMenu.module.css'
import TaskItem from './TaskItem/TaskItem'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { ClearContextMenu } from '../../../../../../types/contextMenu'
import { TaskActionI, toggleTaskCompleteAtActionPayload } from '../../../../../../types/todoUserData'
import {
    addFavouriteActionCreator,
    addMyDayActionCreator,
    addTaskActionCreator,
    changeTaskDataActionCreator,
    deleteTaskActionCreator,
    moveTaskBetweenListsActionCreator,
    removeFavouriteActionCreator,
    removeMyDayActionCreator,
    TaskToggleCompleteActionCreator
} from '../../../../../../store/actionsCreator/todoUserDataActionCreator'
import { useTypedSelector } from '../../../../../../hooks/useTypedSelector'
import TaskItemWithContext, { showContentEnum } from './TaskItemWithContext/TaskItemWithContext'
import { useHideWhenMouseOnAnotherElement } from '../../../../../../hooks/useHideWhenMouseOnAnotherElement'
import { Types } from 'mongoose'
import { ExtensibilityActionI, ExtensibilityRightSidebarId } from '../../../../../../types/Extensibility'
import { closeRightSidebarActionCreator } from '../../../../../../store/actionsCreator/extensibilityActionCreator'

interface Props {
    _id: string,
    name: string,
    myDay?: null | number,
    isCompleted: boolean,
    favourites?: null | number,
    endAt?: [number, number, number],
    forList: string | undefined,
    position: number | null,
    stylePosition: CSSProperties
}

enum isMoveToHoveredEnum {
    COPY_TO = 'COPY_TO',
    MOVE_TO = 'MOVE_TO'
}

type isMoveToHoveredT = {
    type: isMoveToHoveredEnum.MOVE_TO | isMoveToHoveredEnum.COPY_TO,
    pos: showContentEnum.RIGHT | showContentEnum.LEFT | showContentEnum.BOTTOM | showContentEnum.TOP
} | false

const TaskContextMenu: React.FC<Props> = ( {
    _id, position, favourites, myDay, forList, isCompleted,
    endAt, name, stylePosition
} ) => {
    const { lists, tasks } = useTypedSelector(state => state.todoUserData)
    const rightSideBar = useTypedSelector(state => state.extensibilityState.rightSidebarId)
    const fullTime = useTypedSelector(state => state.syncDate.time)
    const dispatch = useDispatch<Dispatch<ClearContextMenu | TaskActionI | ExtensibilityActionI>>()
    const [isMoveOrCopyTo, setIsMoveOrCopyTo] = useState<isMoveToHoveredT>(false)
    const { onMouseLeave, onMouseEnter } = useHideWhenMouseOnAnotherElement(
        isMoveOrCopyTo, setIsMoveOrCopyTo
    )
    if ( !fullTime )
        return <></>
    const { clientCurDate, ...time } = fullTime
    const toggleMyDay = () => {
        if ( myDay === undefined ) {
            dispatch(addMyDayActionCreator({
                _id,
                isCompleted
            }))
        } else {
            dispatch(removeMyDayActionCreator({
                _id,
                myDay
            }))
        }
    }
    const toggleFavourites = () => {
        if ( favourites === undefined ) {
            dispatch(addFavouriteActionCreator({
                _id,
                isCompleted
            }))
        } else {
            dispatch(removeFavouriteActionCreator({
                _id,
                favourites
            }))
        }
    }
    const toggleComplete = () => {
        if ( !isCompleted ) {
            const now = new Date(+new Date() - +clientCurDate + +new Date(
                time.year, time.month, time.date,
                time.hours, time.minutes, time.seconds
            ))
            dispatch(TaskToggleCompleteActionCreator({
                _id,
                completedAt : [
                    now.getFullYear(), now.getMonth() + 1, now.getDate(),
                    now.getHours(), now.getMinutes(), now.getSeconds()
                ],
                myDay,
                favourites,
                position
            } as toggleTaskCompleteAtActionPayload))
        } else {
            dispatch(TaskToggleCompleteActionCreator({
                _id,
                myDay,
                favourites,
                position
            } as toggleTaskCompleteAtActionPayload))
        }
    }
    const chooseEndAtAsToday = () => {
        dispatch(changeTaskDataActionCreator({
            _id,
            endAt : [time.year, time.month, time.date]
        }))
    }
    const chooseEndAtAsNextDay = () => {
        const nextDay = new Date(time.year, time.month, time.date + 1)
        dispatch(changeTaskDataActionCreator({
            _id,
            endAt : [nextDay.getFullYear(), nextDay.getMonth() + 1, nextDay.getDate()]
        }))
    }
    const deleteEndAt = () => {
        dispatch(changeTaskDataActionCreator({
            _id,
            endAt : null
        }))
    }
    const deleteTask = () => {
        dispatch(deleteTaskActionCreator({
            _id,
            position,
            forList
        }))
        if ( rightSideBar?.type === ExtensibilityRightSidebarId.TASK_DETAILS && rightSideBar.taskId === _id )
            dispatch(closeRightSidebarActionCreator())
    }
    const copyTo = ( toForList: string | undefined ) => {
        const createdAt: [number, number, number, number, number, number] = (() => {
            const syncTimeDate = new Date(time.year, time.month - 1, time.date,
                time.hours, time.minutes, time.seconds)
            const clientDate = new Date()
            const currentDate = new Date(+syncTimeDate + +clientDate - +clientCurDate)
            return [currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate(),
                currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds()]
        })()
        dispatch(addTaskActionCreator({
            _id : new Types.ObjectId().toString(),
            endAt,
            createdAt,
            forList : toForList,
            name,
            isMyDay : myDay !== undefined ? true : undefined,
            isFavourite : favourites !== undefined ? true : undefined
        }))
    }
    const moveTo = ( toForList: string | undefined ) => {
        dispatch(moveTaskBetweenListsActionCreator({
            _id,
            fromForList : forList,
            toForList,
            fromPos : position,
            toPos : position === null ? null : tasks.filter(el => el.forList === toForList).length
        }))
    }
    const showContent = (
        e: React.MouseEvent<HTMLLIElement, MouseEvent>,
        type: isMoveToHoveredEnum.MOVE_TO | isMoveToHoveredEnum.COPY_TO
    ) => {
        const DOMRect = e.currentTarget.getBoundingClientRect()
        setIsMoveOrCopyTo({
            pos : DOMRect.right + 230 > window.innerWidth + 5 ?
                DOMRect.left - 235 > 0 ? showContentEnum.LEFT :
                    DOMRect.top > window.innerHeight / 2 ?
                        showContentEnum.TOP
                        :
                        showContentEnum.BOTTOM
                :
                showContentEnum.RIGHT,
            type
        })
    }
    return (
        <div className={ s.wrapper } style={ stylePosition } onMouseDown={ e => e.stopPropagation() }>
            <ul>
                <li onMouseEnter={ onMouseEnter } onMouseLeave={ onMouseLeave }>
                    <TaskItem isRed={ false }
                              text={ myDay !== undefined ? 'Remove from my day' : 'Add to my day' }
                              onMouseDown={ toggleMyDay }
                    >
                        { myDay !== undefined ?
                            <svg viewBox="0 0 24 24">
                                <path fillRule="evenodd"
                                      d="M14.081 13.374l-3.455-3.455c.126-.083.258-.157.402-.219.304-.133.628-.2.972-.2s.667.067.969.2c.302.132.566.312.793.539.227.226.406.491.539.793.133.301.199.625.199.968 0 .344-.066.668-.199.973-.062.143-.137.275-.22.401zM15.5 12c0-.484-.091-.938-.273-1.363-.183-.425-.433-.796-.75-1.113-.318-.318-.689-.568-1.113-.75-.425-.183-.879-.274-1.364-.274-.484 0-.938.091-1.363.274-.266.114-.503.263-.726.43L7 6.293 6.293 7 17 17.707l.707-.707-2.911-2.911c.167-.223.317-.46.431-.725.182-.425.273-.879.273-1.364zm-10.9998.5003h3v-1h-3zm7-5h1v-3h-1zm6.1562-.4531l-.703-.703-2.125 2.117.711.711zm-1.1562 5.4531h3v-1h-3zm-5 7h1v-3h-1zM6.344 16.9534l.703.703 2.125-2.117-.711-.711zm4.6832-2.6481c-.304-.13-.57-.309-.797-.535-.226-.227-.405-.493-.535-.797-.13-.305-.195-.629-.195-.973 0-.121.019-.236.035-.353l-.821-.82c-.133.371-.214.759-.214 1.173 0 .484.091.938.273 1.363.183.425.433.796.75 1.114.318.317.689.567 1.114.75.425.182.879.273 1.363.273.415 0 .802-.081 1.173-.214l-.821-.82c-.116.015-.231.034-.352.034-.344 0-.668-.065-.973-.195z"/>
                            </svg>
                            :
                            <i className={ s.icon + ' ' + s.iconSunny }/>
                        }
                    </TaskItem>
                </li>
                <li onMouseEnter={ onMouseEnter } onMouseLeave={ onMouseLeave }>
                    <TaskItem isRed={ false }
                              text={ favourites !== undefined ? 'Unmark favorites' : 'Mark as favourites' }
                              onMouseDown={ toggleFavourites }
                    >
                        { favourites !== undefined ?
                            <svg viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 7.3516l1.141 3.648h3.921c-.531.407-1.057.813-1.578
                        1.219-.396.31-.802.616-1.208.923l-3.293-2.536L12 7.3516zm8 2.648h-6.125l-1.875-6-1.861
                        5.956-4.834-3.722-.61.793 14.002 10.781.61-.793-4.212-3.243L20 9.9996zm-5.312
                        5.9399c.138.446.275.893.414 1.342L12 14.8905l-3.102
                        2.391c
                        .199-.646.396-1.288.594-1.926.198-.638.402-1.28.61-1.926-.537-.401-1.066-.804-1.586-1.211-.521
                        -.406-1.047-.812-1.578-1.218h1.334l-1.298-1H4l4.938 3.796L7 20.0005l5-3.844 5
                        3.844-.937-3.002-1.375-1.059z"/>
                            </svg>
                            :
                            <i className={ s.icon + ' ' + s.favouriteStar }/>
                        }
                    </TaskItem>
                </li>
                <li onMouseEnter={ onMouseEnter } onMouseLeave={ onMouseLeave }>
                    <TaskItem isRed={ false }
                              text={ isCompleted ? 'Unmark completed' : 'Mark as completed' }
                              onMouseDown={ toggleComplete }
                    >
                        {
                            isCompleted ?
                                <svg viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M5 12c0-3.859 3.141-7 7-7s7 3.141 7 7-3.141 7-7
                            7-7-3.141-7-7zm-1 0c0 4.411 3.589 8 8 8s8-3.589 8-8-3.589-8-8-8-8 3.589-8 8z"/>
                                </svg>
                                :
                                <svg viewBox="0 0 24 24">
                                    <g fillRule="evenodd">
                                        <path d="M5 12c0-3.859 3.141-7 7-7s7 3.141 7 7-3.141 7-7 7-7-3.141-7-7zm-1 0c0 4.411
                                3.589 8 8 8s8-3.589 8-8-3.589-8-8-8-8 3.589-8 8z"/>
                                        <path
                                            d="M10.9902 13.3027l-1.986-2.01-.711.703 2.693 2.725 4.721-4.721-.707-.707z"/>
                                    </g>
                                </svg>
                        }
                    </TaskItem>
                </li>
                <div className={ s.separator }/>
                <li onMouseEnter={ onMouseEnter } onMouseLeave={ onMouseLeave }>
                    <TaskItem isRed={ false } text={ 'With a deadline today' } onMouseDown={ chooseEndAtAsToday }>
                        <svg focusable="false" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                             viewBox="0 0 24 24">
                            <g fillRule="evenodd">
                                <path
                                    d="M15.9997 4.9997h1v1h3.001v14H3.9997v-14h3v-1h1v1h8v-1zm-11 14h14v-9h-14v9zm12-10.999h-1V7l-8 .0007v1h-1V7h-2v2.0007h14.001V7h-2.001v1.0007z"/>
                                <path d="M11 15h2v-2h-2v2zm-1 1h4v-4h-4v4z"/>
                            </g>
                        </svg>
                    </TaskItem>
                </li>
                <li onMouseEnter={ onMouseEnter } onMouseLeave={ onMouseLeave }>
                    <TaskItem isRed={ false } text={ 'Deadline tomorrow' } onMouseDown={ chooseEndAtAsNextDay }>
                        <svg viewBox="0 0 24 24">
                            <g fillRule="evenodd">
                                <path d="M15.9997 4.9997h1v1h3.001v14H3.9997v-14h3v-1h1v1h8v-1zm-11
                        14h14v-9h-14v9zm12-10.999h-1l.0003-1H7.9997v1h-1v-1h-2v2h14.001v-2h-2.001v1z"/>
                                <path
                                    d="M11.6465 16.6465l.707.707 2.854-2.853-2.854-2.854-.707.707 1.646 1.647h-4.292v1h4.292z"
                                />
                            </g>
                        </svg>
                    </TaskItem>
                </li>
                { !!endAt && <li onMouseEnter={ onMouseEnter } onMouseLeave={ onMouseLeave }>
                    <TaskItem isRed={ false } text={ 'Delete deadline' } onMouseDown={ deleteEndAt }>
                        <i className={ s.icon + ' ' + s.iconCalendar }/>
                    </TaskItem>
                </li> }
                { lists.length !== 0 && <>
                    <div className={ s.separator }/>
                    <li
                        onMouseEnter={ e =>
                            showContent(e, isMoveToHoveredEnum.MOVE_TO) }
                        onMouseDown={ e =>
                            showContent(e, isMoveToHoveredEnum.MOVE_TO) }
                    >
                        <TaskItemWithContext onMouseDown={ moveTo } _id={ _id } forList={ forList }
                                             text={ 'Move task to...' }
                                             showContent={
                                                 isMoveOrCopyTo &&
                                                 isMoveOrCopyTo.type === isMoveToHoveredEnum.MOVE_TO &&
                                                 isMoveOrCopyTo.pos
                                             }
                        >
                            <svg viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M4 16h3v-3H4v3zm1-1h1v-1H5v1zm-1 5h3v-3H4v3zm1-1h1v-1H5v1zm3
                                -4h12.001v-1H8zm0 4h12.001v-1H8zm4.0001-15.0002v6.293l-2.287-2.287-.707.707 3.493 3.494
                                3.495-3.494-.707-.707-2.287 2.287v-6.293z"/>
                            </svg>
                        </TaskItemWithContext>
                    </li>
                    <li
                        onMouseEnter={ e =>
                            showContent(e, isMoveToHoveredEnum.COPY_TO) }
                        onMouseDown={ e =>
                            showContent(e, isMoveToHoveredEnum.COPY_TO) }
                    >
                        <TaskItemWithContext onMouseDown={ copyTo } _id={ _id } forList={ forList }
                                             text={ 'Copy task to...' }
                                             showContent={
                                                 isMoveOrCopyTo &&
                                                 isMoveOrCopyTo.type === isMoveToHoveredEnum.COPY_TO &&
                                                 isMoveOrCopyTo.pos
                                             }
                        >
                            <i className={ s.icon + ' ' + s.copyIcon }/>
                        </TaskItemWithContext>
                    </li>
                </>
                }
                <div className={ s.separator }/>
                <li onMouseEnter={ onMouseEnter } onMouseLeave={ onMouseLeave }>
                    <TaskItem isRed={ true } text={ 'Delete task' } onMouseDown={ deleteTask }>
                        <i className={ s.icon + ' ' + s.iconDelete }/>
                    </TaskItem>
                </li>
            </ul>
        </div>
    )
}

export default TaskContextMenu