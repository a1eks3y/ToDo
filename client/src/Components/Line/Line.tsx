import * as React from 'react'
import s from './Line.module.css'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import { dragItemTypes, DropAction } from '../../types/drag&drop'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { dropActionCreator } from '../../store/actionsCreator/drag&droppActionCreator'
import { TodoUserDataActionI, TodoUserDataActionTypes } from '../../types/todoUserData'
import {
    moveGroupActionCreator,
    moveListActionCreator,
    moveStepActionCreator,
    moveTaskInsideListActionCreator
} from '../../store/actionsCreator/todoUserDataActionCreator'

interface Props {
    position: number,
    locked?: boolean,
    forTask?: string,
    forList?: string | undefined,
    forGroup?: string,
    forListName?: string
}

const Line: React.FC<Props> = (
    {
        forGroup, position, forList, locked,
        forListName, forTask
    }
) => {
    const { dragItem, isDragging } = useTypedSelector(state => state.dragAndDrop)
    const dispatch = useDispatch<Dispatch<DropAction | TodoUserDataActionI>>()
    let canLineBeMouseUp: boolean = !!locked
    if ( !canLineBeMouseUp && isDragging && dragItem && !locked ) switch ( dragItem.itemType ) {
        case dragItemTypes.step:
            canLineBeMouseUp = !!dragItem.forTask && !!forTask && dragItem.forTask === forTask &&
                dragItem.position !== position
                && dragItem.position + 1 !== position
            break
        case dragItemTypes.task:
            canLineBeMouseUp = !forGroup &&
                typeof forListName === 'string' &&
                (
                    (
                        !forList &&
                        forListName === 'My day' && typeof dragItem.myDay === 'number' &&
                        dragItem.myDay !== position
                        && dragItem.myDay + 1 !== position
                    )
                    ||
                    (
                        !forList &&
                        forListName === 'Favourites' && typeof dragItem.favourites === 'number' &&
                        dragItem.favourites !== position
                        && dragItem.favourites + 1 !== position
                    )
                    ||
                    (
                        ( !!forList || (forListName === 'Tasks' && !forList)) &&
                        typeof dragItem.position === 'number' &&
                        dragItem.position !== position
                        && dragItem.position + 1 !== position
                    )
                )
            break
        case dragItemTypes.list:
            canLineBeMouseUp = forList === undefined && (
                forGroup === dragItem.forGroup ?
                    dragItem.position !== position && dragItem.position + 1 !== position : true)
            break
        case dragItemTypes.group:
            canLineBeMouseUp = !forGroup && forList === undefined && dragItem.position !== position
                && dragItem.position + 1 !== position
    }
    const mouseUpHandler = () => {
        if ( canLineBeMouseUp ) {
            dispatch(dropActionCreator())
            if ( dragItem )
                switch ( dragItem.itemType ) {
                    case dragItemTypes.step:
                        dispatch(moveStepActionCreator({
                            _id : dragItem._id,
                            fromPos : dragItem.position,
                            toPos : position,
                            forTask : dragItem.forTask
                        }))
                        break

                    case dragItemTypes.task:
                        switch ( true ) {
                            case !forList && forListName === 'My day':
                                typeof dragItem.myDay === 'number' && dispatch({
                                    type : TodoUserDataActionTypes.MOVE_TASK_MY_DAY,
                                    payload : {
                                        _id : dragItem._id,
                                        fromMyDay : dragItem.myDay,
                                        toMyDay : position
                                    }
                                })
                                break
                            case !forList && forListName === 'Favourites':
                                typeof dragItem.favourites === 'number' && dispatch({
                                    type : TodoUserDataActionTypes.MOVE_TASK_FAVOURITES,
                                    payload : {
                                        _id : dragItem._id,
                                        fromFavourite : dragItem.favourites,
                                        toFavourite : position
                                    }
                                })
                                break
                            default:
                                typeof dragItem.position === 'number' && dispatch(
                                    moveTaskInsideListActionCreator({
                                        _id : dragItem._id,
                                        fromPos : dragItem.position,
                                        toPos : position,
                                        forList
                                    }))
                        }
                        break
                    case dragItemTypes.list:
                        dispatch(moveListActionCreator({
                            _id : dragItem._id,
                            fromPos : dragItem.position,
                            toPos : position,
                            prevGroup : dragItem.forGroup,
                            forGroup
                        }))
                        break
                    case dragItemTypes.group:
                        dispatch(moveGroupActionCreator({
                            _id : dragItem._id,
                            fromPos : dragItem.position,
                            toPos : position
                        }))
                        break

                }
        }
    }
    return (
        <div className={ s.wrapper + ' ' + (canLineBeMouseUp && !locked ? s.wrapper_hover : '') }
             onMouseUp={ mouseUpHandler }>
            <div
                className={
                    ((forGroup && s.forGroup_line) || (forListName !== undefined && s.forList_line) || s.line)
                    + ' ' + (canLineBeMouseUp && !locked ? s.hover : '')
                }
            />
        </div>
    )
}

export default Line