import * as React from 'react'
import s from './Task.module.css'
import Hint from '../../../../../../../../Components/Hint/Hint'
import {
    addFavouriteActionCreator,
    finishRenamingItemFailedActionCreator,
    finishRenamingItemSuccessActionCreator,
    removeFavouriteActionCreator,
    startRenamingTask,
    TaskToggleCompleteActionCreator
} from '../../../../../../../../store/actionsCreator/todoUserDataActionCreator'
import { TodoUserDataActionI, toggleTaskCompleteAtActionPayload } from '../../../../../../../../types/todoUserData'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { useTypedSelector } from '../../../../../../../../hooks/useTypedSelector'
import { useHint } from '../../../../../../../../hooks/useHint'
import { useMemo, useState } from 'react'

interface Props {
    _id: string,
    myDay?: number | null,
    favourites?: number | null,
    position: number | null,
    isCompleted: boolean,
    name: string,
    interfaceRGB: interfaceColor.RED | interfaceColor.BLUE
}

export enum interfaceColor {
    BLUE = 'rgb(37, 100, 207)',
    RED = 'rgb(210, 83, 78)'
}

const Task: React.FC<Props> = ( {
    isCompleted, name, favourites, _id,
    myDay, position, interfaceRGB
} ) => {
    const fullTime = useTypedSelector(state => state.syncDate.time)
    const dispatch = useDispatch<Dispatch<TodoUserDataActionI>>()
    const { onParentMouseEnter, onParentMouseLeave, pos, hintText } = useHint(
        useMemo(() => favourites === undefined ?
            'Marking a task as favourite' : 'Remove from favourites', [favourites])
    )
    const [newName, setNewName] = useState<string>(name)
    if ( !fullTime )
        return null
    const { clientCurDate, ...time } = fullTime
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
    return (
        <div className={ s.wrapper + ' noselect' }>
            <div className={ s.toggleComplete }
                 onClick={ toggleCompletedAt }
            >
                <svg width="24" height="24" viewBox="0 0 24 24"
                     style={ {
                         fill : interfaceRGB === interfaceColor.RED ?
                             interfaceColor.RED : interfaceColor.BLUE
                     } }
                >
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
            <div className={ s.name_wrapper }>
                <div className={ s.name }>
                    <textarea
                        maxLength={ 255 }
                        value={ newName }
                        className={
                            s.name_textarea + ' ' + (isCompleted ? s.completed : '')
                        }
                        onChange={ e => {
                            setNewName(e.target.value)
                        } }
                        onFocus={ () => {
                            dispatch(startRenamingTask(_id))
                        } }
                        onBlur={ () => {
                            if ( newName !== name ) {
                                dispatch(finishRenamingItemSuccessActionCreator(newName))
                            } else {
                                dispatch(finishRenamingItemFailedActionCreator())
                            }
                        } }
                    />
                    <div className={ s.find_height_helper }>
                        { newName }
                    </div>
                </div>
            </div>
            <div
                className={ s.toggleFavourite }
            >
                <i
                    onMouseEnter={ onParentMouseEnter }
                    onMouseLeave={ onParentMouseLeave }
                    onClick={ toggleFavourite }
                    className={
                        s.icon + ' ' + s.hint_parent + ' ' +
                        (favourites !== undefined ? s.ActiveStarIcon : s.starIcon)
                    }
                >
                    { pos && <Hint hintText={ hintText } pos={ pos }/> }
                </i>
            </div>
        </div>
    )
}

export default Task