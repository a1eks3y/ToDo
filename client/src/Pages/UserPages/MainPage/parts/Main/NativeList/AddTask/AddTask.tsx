import * as React from 'react'
import { Dispatch, useState } from 'react'
import s from './AddTask.module.css'
import { chooseDateType, contextMenuActionI, contextMenuActionType } from '../../../../../../../types/contextMenu'
import { useDispatch } from 'react-redux'
import { chooseDateContextMenuActionCreator } from '../../../../../../../store/actionsCreator/contextMenuActionCreator'
import { useTypedSelector } from '../../../../../../../hooks/useTypedSelector'
import { getDayOfWeek, monthNumberToName } from '../../../../../../../store/actionsCreator/syncDateActionCreator'
import { addTaskActionCreator } from '../../../../../../../store/actionsCreator/todoUserDataActionCreator'
import { addTaskActionI } from '../../../../../../../types/todoUserData'
import { Types } from 'mongoose'
import { useHint } from '../../../../../../../hooks/useHint'
import Hint from '../../../../../../../Components/Hint/Hint'

interface Props {
    isMyDay?: true,
    isFavourite?: true,
    forList?: string,
    isPlanned?: true,
    color: listColor.RED | listColor.BLUE | listColor.BLACK
}

enum listColor {
    BLACK = 'rgb(50, 49, 48)',
    BLUE = 'rgb(37, 100, 207)',
    RED = 'rgb(210, 83, 78)'
}

const AddTask: React.FC<Props> = (
    { isMyDay, isFavourite, forList, isPlanned, color }
) => {
    const deadline = useHint('Add a deadline')
    const [isFocused, setIsFocused] = useState<boolean>(true)
    const [taskName, setTaskName] = useState<string>('')
    const [chosenDate, setChosenDate] = useState<chooseDateType | undefined>()
    const time = useTypedSelector(state => state.syncDate.time)
    const dispatch = useDispatch<Dispatch<contextMenuActionI | addTaskActionI>>()
    const item = useTypedSelector(state => state.contextMenu.item)
    if ( !time )
        return null
    const curDate = new Date(time.year, time.month, time.date)
    const CreateTask = () => {
        if ( taskName === '' )
            return
        const createdAt: [number, number, number, number, number, number] = (() => {
            const syncTimeDate = new Date(time.year, time.month - 1, time.date,
                time.hours, time.minutes, time.seconds)
            const clientDate = new Date()
            const currentDate = new Date(+syncTimeDate + +clientDate - +time.clientCurDate)
            return [currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate(),
                currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds()]
        })()
        dispatch(addTaskActionCreator({
            _id : new Types.ObjectId().toString(),
            name : taskName,
            isMyDay,
            createdAt,
            forList,
            ...(chosenDate ?
                    { endAt : [chosenDate.year, chosenDate.month, chosenDate.day] }
                    :
                    (
                        isPlanned ?
                            { endAt : [time.year, time.month, time.date] }
                            :
                            {}
                    )
            ),
            isFavourite
        }))
        setTaskName('')
        setChosenDate(undefined)
    }
    return (
        <div className={ s.add_task }>
            <div className={ s.input_wrapper }>
                <label className={ s.not_completed }>
                    {
                        isFocused ?
                            <i>
                                <svg width="24" height="24" viewBox="0 0 24 24">
                                    <path fillRule="evenodd"
                                          d="M12 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8
                                              8m0-17c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9"/>
                                </svg>
                            </i>
                            :
                            <i className={ s.unFocused_icon }/>
                    }
                </label>
                <input className={ (isFocused ? s.input : s.unFocused_input) +
                    ' ' + (color === listColor.RED ? s.red_placeholder : s.blue_placeholder) }
                       maxLength={ 255 }
                       spellCheck={ false }
                       onChange={ e => setTaskName(e.target.value) }
                       value={ taskName }
                       placeholder={ 'Add task' }
                       onFocus={ () => setIsFocused(true) }
                       autoFocus={ true }
                       onKeyDown={ e => e.key === 'Enter' && CreateTask() }
                />
            </div>
            <div className={ s.tool_bar }>
                <ul className={ s.change_newTask_data }>
                    <li className={ s.change_newTask_data_item + ' ' + (chosenDate ? s.chosen_date_wrapper : '') }
                        onMouseDown={ e => {
                            e.stopPropagation()
                            !taskName && setIsFocused(false)
                            if ( item?.type !== contextMenuActionType.CHOOSE_DATE )
                                dispatch(chooseDateContextMenuActionCreator({
                                    fullDate : chosenDate,
                                    setDate : setChosenDate,
                                    offsetHeight : e.pageY,
                                    offsetWidth : e.pageX,
                                    width : e.currentTarget.offsetWidth,
                                    height : e.currentTarget.offsetHeight
                                }))
                        } }
                        onMouseLeave={ deadline.onParentMouseLeave }
                        onMouseEnter={ deadline.onParentMouseEnter }
                    >
                        <i className={ s.icon_calendar }/>
                        {
                            item?.type !== contextMenuActionType.CHOOSE_DATE &&
                            deadline.pos && <Hint hintText={ deadline.hintText } pos={ deadline.pos }/>
                        }
                        { chosenDate &&
                            <span className={ s.chosen_date }>
                                {
                                    (
                                        (chosenDate.day - time.date === 1 || chosenDate.day - time.date === 0) &&
                                        time.month === chosenDate.month &&
                                        time.year === chosenDate.year &&
                                        (
                                            chosenDate.day - time.date === 1 ?
                                                'Tomorrow'
                                                :
                                                'Today'
                                        )
                                    ) || (
                                        (
                                            +curDate < +new Date(
                                                chosenDate.year, chosenDate.month, chosenDate.day
                                            ) ?
                                                'Deadline: '
                                                :
                                                'Expired, '
                                        )
                                        + getDayOfWeek(
                                            chosenDate.day, chosenDate.month, chosenDate.year
                                        ).str.substr(0, 3)
                                        + ', ' + chosenDate.day
                                        + ' ' + monthNumberToName[ chosenDate.month - 1 ]
                                        + (chosenDate.year !== time.year ? (' ' + chosenDate.year) : '')
                                    )
                                }
                            </span>
                        }
                    </li>
                    {/*  notification coming soon  */ }
                </ul>
                <div className={ s.create_task_wrapper }>
                    <button className={ s.create_task } disabled={ taskName === '' } onClick={ CreateTask }>
                        Create
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddTask