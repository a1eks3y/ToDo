import * as React from 'react'
import { SetStateAction, useMemo } from 'react'
import s from './Task.module.css'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import {
    Category,
    TaskCategories,
    TodoUserDataActionI,
    toggleTaskCompleteAtActionPayload
} from '../../../../../../../types/todoUserData'
import {
    addFavouriteActionCreator,
    removeFavouriteActionCreator,
    TaskToggleCompleteActionCreator
} from '../../../../../../../store/actionsCreator/todoUserDataActionCreator'
import { useTypedSelector } from '../../../../../../../hooks/useTypedSelector'
import { useHint } from '../../../../../../../hooks/useHint'
import Hint from '../../../../../../../Components/Hint/Hint'
import { dragTaskAction } from '../../../../../../../types/drag&drop'
import { contextMenuActionI } from '../../../../../../../types/contextMenu'
import { useIsDragging } from '../../../../../../../hooks/useIsDragging'
import { dragTaskActionCreator } from '../../../../../../../store/actionsCreator/drag&droppActionCreator'
import { taskContextMenuActionCreator } from '../../../../../../../store/actionsCreator/contextMenuActionCreator'
import { getDayOfWeek, monthNumberToName } from '../../../../../../../store/actionsCreator/syncDateActionCreator'
import { ExtensibilityActionI } from '../../../../../../../types/Extensibility'
import { openTaskDetailsActionCreator } from '../../../../../../../store/actionsCreator/extensibilityActionCreator'

interface Props {
    _id: string,
    name: string,
    isCompleted: boolean,
    favourites?: number | null,
    myDay?: number | null,
    position: number | null,
    forList: string | undefined,
    list: string | undefined,
    forListName: string,
    chosenTaskId: string,
    setChosenTaskId: React.Dispatch<SetStateAction<string>>,
    color: listColor.RED | listColor.BLUE | listColor.BLACK,
    curListName: string,
    endAt?: [number, number, number],
    categories: never[] | Category[]
}

enum listColor {
    BLACK = 'rgb(50, 49, 48)',
    BLUE = 'rgb(37, 100, 207)',
    RED = 'rgb(210, 83, 78)'
}

type DispatchA = TodoUserDataActionI | dragTaskAction | contextMenuActionI | ExtensibilityActionI
const Task: React.FC<Props> = ( {
    _id, name, isCompleted, favourites, myDay,
    position, forList, list,
    forListName, chosenTaskId, setChosenTaskId, color,
    curListName, endAt, categories
} ) => {
    const dispatch = useDispatch<Dispatch<DispatchA>>()
    const { notDragging, onMouseDown } = useIsDragging(
        ( e ) => {
            dispatch(dragTaskActionCreator({
                _id,
                name,
                x : e.clientX,
                y : e.clientY,
                forList,
                position,
                myDay : curListName === 'My day' && !list ? typeof myDay === 'number' ? myDay : undefined : undefined,
                favourites,
                isCompleted
            }))
        },
        () => {
            dispatch(openTaskDetailsActionCreator(_id))
        }
    )
    const { onParentMouseEnter, onParentMouseLeave, pos, hintText } = useHint(
        useMemo(() => favourites === undefined ?
            'Marking a task as favourite' : 'Remove from favourites', [favourites])
    )
    const fullTime = useTypedSelector(state => state.syncDate.time)
    if ( !fullTime )
        return null
    const { clientCurDate, ...time } = fullTime
    const nowDate = new Date(+new Date() - +clientCurDate + +new Date(
        time.year, time.month - 1, time.date,
        time.hours, time.minutes, time.seconds
    ))
    const toggleCompletedAt = () => {
        if ( !isCompleted ) {
            const now = new Date(+new Date() - +clientCurDate + +new Date(
                time.year, time.month - 1, time.date,
                time.hours, time.minutes, time.seconds
            ))
            dispatch(TaskToggleCompleteActionCreator({
                _id,
                completedAt : [
                    now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds()],
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
    const toggleFavourite = () => {
        if ( favourites === undefined ) {
            dispatch(addFavouriteActionCreator({ _id, isCompleted }))
        } else {
            dispatch(removeFavouriteActionCreator({ _id, favourites }))
        }
    }
    const onContextMenu = ( e: React.MouseEvent<HTMLLabelElement, MouseEvent> ) => {
        e.preventDefault()
        dispatch(taskContextMenuActionCreator({
            _id,
            myDay,
            forList,
            position,
            name,
            isCompleted,
            favourites,
            endAt,
            clientX : e.clientX,
            clientY : e.clientY
        }))
    }
    return (
        <>
            <input type="radio" id={ _id } name={ `${ list }` } className={ s.input }
                   checked={ chosenTaskId === _id } onChange={ () => setChosenTaskId(_id) }/>
            <label htmlFor={ _id } className={ s.label }
                   onChange={ () => setChosenTaskId(_id) }
                   onMouseDown={ onMouseDown }
                   onMouseUp={ notDragging }
                   onMouseLeave={ notDragging }
                   onContextMenu={ onContextMenu }
            >
                <div className={ s.wrapper + ' noselect' }>
                    <div className={ s.toggleComplete }
                         onClick={ toggleCompletedAt }
                         onMouseDown={ e => e.stopPropagation() }
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24"
                             style={ { fill : color === listColor.RED ? color : listColor.BLUE } }>
                            { isCompleted ?
                                <path fillRule="evenodd"
                                      d="M10.9854 15.0752l-3.546-3.58 1.066-1.056 2.486 2.509 4.509-4.509 1.06 1.061-5.575
                                  5.575zm1.015-12.075c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z"/>
                                :
                                <g fillRule="evenodd">
                                    <path d="M12 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8m0-17c-4.963 0-9
                            4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9"/>
                                    <path
                                        d="M10.9902 13.3027l-2.487-2.51-.71.704 3.193 3.224 5.221-5.221-.707-.707z"
                                    />
                                </g>
                            }
                        </svg>
                    </div>
                    <div className={ s.info_and_name }>
                        <span className={ s.name + ' ' + (isCompleted ? s.completed : '') }>{ name }</span>
                        { (forList === undefined ? curListName !== 'Tasks' : forList !== list) &&
                            <div className={ s.info }>
                                <span className={ s.forListName }>{ forListName }</span>
                                { endAt && (() => {
                                    const endAtDate = new Date(endAt[ 0 ], endAt[ 1 ] - 1, endAt[ 2 ])
                                    return +endAtDate - +nowDate >= -24 * 60 * 60 * 1000 ?
                                        <span className={ s.deadline }>
                                            <svg width="16" height="16" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M10 3v1H5.999V3H5v1H3v9h10V4h-2V3h-1zm1
                                                3V5h1v2H4V5h1v1h.999V5H10v1h1zm-7 6h8V7.999H4V12z"/>
                                            </svg>
                                            <span className={ s.deadline_text }>
                                                {
                                                    (
                                                        (endAtDate.getDate() - time.date === 1
                                                            || endAtDate.getDate() - time.date === 0) &&
                                                        time.month === endAtDate.getMonth() + 1 &&
                                                        time.year === endAtDate.getFullYear() &&
                                                        (
                                                            endAtDate.getDate() - time.date === 1 ?
                                                                'Tomorrow'
                                                                :
                                                                'Today'
                                                        )
                                                    )
                                                    ||
                                                    (
                                                        'Deadline: '

                                                        + getDayOfWeek(
                                                            endAtDate.getDate(), endAtDate.getMonth() + 1,
                                                            endAtDate.getFullYear()
                                                        ).str.substr(0, 3)
                                                        + ', ' + endAtDate.getDate()
                                                        + ' ' + monthNumberToName[ endAtDate.getMonth() ]
                                                        + (endAtDate.getFullYear() !== time.year ?
                                                            (' ' + endAtDate.getFullYear()) : '')
                                                    )
                                                }
                                            </span>
                                        </span>
                                        :
                                        <span className={ s.deadline + ' ' + s.overdue }>
                                            <svg width="16" height="16" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M10 3v1H5.999V3H5v1H3v9h10V4h-2V3h-1zm1
                                                3V5h1v2H4V5h1v1h.999V5H10v1h1zm-7 6h8V7.999H4V12z"/>
                                            </svg>
                                            {
                                                (
                                                    'Expired, ' + getDayOfWeek(
                                                        endAtDate.getDate(), endAtDate.getMonth() + 1,
                                                        endAtDate.getFullYear()
                                                    ).str?.substr(0, 3)
                                                    + ', ' + endAtDate.getDate()
                                                    + ' ' + monthNumberToName[ endAtDate.getMonth() ]
                                                    + (endAtDate.getFullYear() !== time.year ?
                                                        (' ' + endAtDate.getFullYear()) : '')
                                                )
                                            }
                                        </span>
                                })() }
                                { categories.map(el => <span key={ el } className={
                                    s.category + ' ' + ((el === TaskCategories.YELLOW && s.yellow_category) ||
                                        (el === TaskCategories.RED && s.red_category) ||
                                        (el === TaskCategories.PURPLE && s.purple_category) ||
                                        (el === TaskCategories.ORANGE && s.orange_category) ||
                                        (el === TaskCategories.GREEN && s.green_category) ||
                                        (el === TaskCategories.BLUE && s.blue_category)
                                    )
                                }>
                                    <span className={ s.category_icon }/>
                                    <span className={ s.category_text }>
                                        { el } category
                                    </span>
                                </span>) }
                            </div>
                        }
                    </div>
                    <div
                        className={ s.toggleFavourite }
                    >
                        <i
                            onMouseEnter={ onParentMouseEnter }
                            onMouseLeave={ onParentMouseLeave }
                            onClick={ toggleFavourite }
                            onMouseDown={ e => e.stopPropagation() }
                            className={
                                s.icon + ' ' + s.hint_parent + ' ' +
                                (favourites === undefined ? s.starIcon : s.ActiveStarIcon)
                            }
                        >
                            { pos && <Hint hintText={ hintText } pos={ pos }/> }
                        </i>
                    </div>
                </div>
            </label>
        </>
    )
}

export default Task