import * as React from 'react'
import { BaseSyntheticEvent, useRef, useState } from 'react'
import s from './CustomGroup.module.css'
import { useTypedSelector } from '../../../../../../../hooks/useTypedSelector'
import CustomList from '../CustomList/CustomList'
import Line from '../../../../../../../Components/Line/Line'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { dragGroupAction, dragItemTypes } from '../../../../../../../types/drag&drop'
import { dragGroupActionCreator } from '../../../../../../../store/actionsCreator/drag&droppActionCreator'
import { GroupContextMenu } from '../../../../../../../types/contextMenu'
import { groupContextMenuActionCreator } from '../../../../../../../store/actionsCreator/contextMenuActionCreator'
import {
    finishRenamingItemSuccess,
    finishRenamingItemFailed,
    moveListAction,
    TodoUserDataActionTypes
} from '../../../../../../../types/todoUserData'
import {
    finishRenamingItemFailedActionCreator,
    finishRenamingItemSuccessActionCreator
} from '../../../../../../../store/actionsCreator/todoUserDataActionCreator'

interface Props {
    name: string,
    position: number,
    _id: string
}

const CustomGroup: React.FC<Props> = (
    { name, _id, position }
) => {
    const [newName, setNewName] = useState(name)
    const itemRenameId = useTypedSelector(state =>
        state.todoUserData.incoming_changes?.change_data?._id)
    const dragAndDrop = useTypedSelector(state => state.dragAndDrop)
    const lists = useTypedSelector(state => state.todoUserData.lists)
        .filter(el => el.forGroup === _id)
    const [isClosed, setIsClosed] = useState(false)
    const [prevIsClosed, setPrevIsClosed] = useState(false)
    const isDraggingLocal = useRef<[boolean, number]>([false, +new Date()])
    const dispatch = useDispatch<Dispatch<dragGroupAction | GroupContextMenu | moveListAction | finishRenamingItemSuccess
        | finishRenamingItemFailed>>()
    const onMouseDown = ( e: React.MouseEvent<HTMLDivElement, MouseEvent> ): NodeJS.Timeout | void => {
        // @ts-ignore
        if ( e.target.tagName !== 'INPUT' ) {
            let date = +new Date()
            isDraggingLocal.current = [true, date]
            return setTimeout(() => {
                if ( isDraggingLocal.current[ 0 ] && isDraggingLocal.current[ 1 ] === date ) {
                    dispatch(dragGroupActionCreator(
                        position, name, _id, e.clientX, e.clientY
                    ))
                }
            }, 100)
        }
    }
    const notDragging = () => {
        isDraggingLocal.current = [false, +new Date()]
    }
    const onContextMenuHandler = ( e: React.MouseEvent<HTMLDivElement> ) => {
        e.preventDefault()
        dispatch(groupContextMenuActionCreator({
            clientX : e.clientX,
            clientY : e.clientY,
            position,
            name,
            _id
        }))
    }
    const moveList = () => {
        const { dragItem, isDragging } = dragAndDrop
        if ( !lists.length &&
            isDragging &&
            dragItem &&
            dragItem.itemType === dragItemTypes.list &&
            dragItem.forGroup !== _id )
            dispatch({
                type : TodoUserDataActionTypes.MOVE_LIST,
                payload : {
                    _id : dragItem._id,
                    forGroup : _id,
                    prevGroup : dragItem.forGroup,
                    toPos : 0,
                    fromPos : dragItem.position
                }
            })
    }
    const onClickHandler = ( e: BaseSyntheticEvent ) => {
        if ( e.target.tagName !== 'INPUT' ) {
            setPrevIsClosed(isClosed)
            setIsClosed( !isClosed)
        }
    }
    const onBlurHandler = () => {
        if ( newName.length && newName !== name ) {
            dispatch(finishRenamingItemSuccessActionCreator(newName))
        } else {
            dispatch(finishRenamingItemFailedActionCreator())
        }
    }
    const onKeyPress = ( e: React.KeyboardEvent<HTMLInputElement> ) => {
        if ( e.key === 'Enter' )
            if ( newName.length && newName !== name ) {
                dispatch(finishRenamingItemSuccessActionCreator(newName))
            } else {
                dispatch(finishRenamingItemFailedActionCreator())
            }
    }
    return (
        <div className={ lists.some(el => el._id === itemRenameId) ? '' : s.group }>
            <div className={ s.inner } onClick={ onClickHandler } onMouseDown={ onMouseDown }
                 onMouseUp={ notDragging }
                 onMouseLeave={ notDragging }
                 onContextMenu={ onContextMenuHandler }
            >
                { (isClosed || prevIsClosed) && <i>
                    <svg className={
                        s.icon_group +
                        (prevIsClosed ? ' ' + s.close_icon : '')
                    }
                         focusable="false" aria-hidden="true" width="24" height="24"
                         viewBox="0 0 24 24">
                        <g fillRule="evenodd" stroke="none" strokeWidth="1">
                            <path
                                d="M19,16.5 L19,6.5 C19,5.673 18.327,5 17.5,5 L6.5,5 C5.673,5 5,5.673 5,6.5 L5,16.5
                                C5,17.327 5.673,18 6.5,18 L17.5,18 C18.327,18 19,17.327 19,16.5 Z M6.5,4 L17.5,4 C18.878
                                ,4 20,5.121 20,6.5 L20,16.5 C20,17.879 18.878,19 17.5,19 L6.5,19 C5.122,19 4,17.879 4,
                                16.5 L4,6.5 C4,5.121 5.122,4 6.5,4 Z M8,15 L8,8 L9,8 L9,15 L8,15 Z"/>
                        </g>
                    </svg>
                </i>
                }
                { itemRenameId !== _id ?
                    <span className={ s.name }>
                        { name }
                    </span>
                    :
                    <input value={ newName }
                           className={ s.name }
                           onClick={ () => false }
                           onChange={ e => setNewName(e.target.value) }
                           spellCheck={ false }
                           onBlur={ onBlurHandler } onKeyPress={ onKeyPress }
                           autoFocus={ true }
                    />
                }
                <span className={ s.icon_arrow_wrapper }>
                    <i
                        className={
                            s.icon_arrow + (isClosed ? (' ' + s.Closed) : prevIsClosed ? ' ' + s.was_closed : '')
                        }
                    />
                </span>
            </div>

            <div className={ s.lists_wrapper +
                (
                    !lists.length &&
                    dragAndDrop.isDragging &&
                    dragAndDrop.dragItem &&
                    dragAndDrop.dragItem.itemType === dragItemTypes.list &&
                    dragAndDrop.dragItem.forGroup !== _id ?
                        ' ' + s.drop_item : ''
                )
            } onMouseDown={ ( e ) => !lists.length && onMouseDown(e) }
                 onMouseUp={ () => {
                     moveList()
                     !lists.length && notDragging()
                 } }
                 onMouseLeave={ () =>
                     !lists.length && notDragging()
                 }
            >
                <div className={ s.lists + (isClosed ? ' ' + s.lists_close : '') } key={ 1 + _id }>
                    {
                        !lists.length ?
                            <span className={ s.lists_empty + ' noselect' } onContextMenu={ onContextMenuHandler }>
                                Drag items here to add lists
                            </span>
                            :
                            <>
                                <Line forGroup={ _id } key={ 0 + _id } position={ 0 }/>
                                {
                                    lists.map(( el, inx ) => (
                                            <React.Fragment key={ el._id + 'fragment' }>
                                                <CustomList name={ el.name }
                                                            position={ el.position }
                                                            _id={ el._id }
                                                            forGroup={ el.forGroup }
                                                            key={ el._id }
                                                />
                                                <Line position={ inx + 1 } forGroup={ _id }
                                                      key={ (inx + 1) + _id }/>
                                            </React.Fragment>
                                        )
                                    )
                                }
                            </>
                    }
                </div>
                <div className={ s.border_line }/>
            </div>
        </div>
    )
}

export default CustomGroup