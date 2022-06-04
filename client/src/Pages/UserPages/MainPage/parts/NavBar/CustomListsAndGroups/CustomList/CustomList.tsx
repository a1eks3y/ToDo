import * as React from 'react'
import { KeyboardEvent, useState } from 'react'
import s from './CustomList.module.css'
import { useTypedSelector } from '../../../../../../../hooks/useTypedSelector'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { dragItemTypes, dragListAction } from '../../../../../../../types/drag&drop'
import { dragListActionCreator } from '../../../../../../../store/actionsCreator/drag&droppActionCreator'
import { Dispatch } from 'redux'
import { ListContextMenu } from '../../../../../../../types/contextMenu'
import { listContextMenuActionCreator } from '../../../../../../../store/actionsCreator/contextMenuActionCreator'
import {
    finishRenamingItemFailedActionCreator,
    finishRenamingItemSuccessActionCreator,
    moveTaskBetweenListsActionCreator
} from '../../../../../../../store/actionsCreator/todoUserDataActionCreator'
import {
    TodoUserDataActionI
} from '../../../../../../../types/todoUserData'
import { useIsDragging } from '../../../../../../../hooks/useIsDragging'
import { ExtensibilityActionI, ExtensibilityRightSidebarId } from '../../../../../../../types/Extensibility'
import { closeRightSidebarActionCreator } from '../../../../../../../store/actionsCreator/extensibilityActionCreator'

interface Props {
    name: string,
    position: number,
    _id: string,
    forGroup?: string
}

const CustomList: React.FC<Props> = (
    { name, _id, position, forGroup }
) => {
    const location = useLocation().pathname.split('/')[ 1 ]
    const { notDragging, onMouseDown } = useIsDragging(( e ) => {
            dispatch(dragListActionCreator(
                position, name, _id, e.clientX, e.clientY, forGroup
            ))
        },
        () => {
            if ( location === _id )
                return
            navigate('/' + _id)
            if ( rightSidebarId?.type === ExtensibilityRightSidebarId.TASK_DETAILS )
                dispatch(closeRightSidebarActionCreator())
        }
    )
    const rightSidebarId = useTypedSelector(state => state.extensibilityState.rightSidebarId)
    const dragItem = useTypedSelector(state => state.dragAndDrop.dragItem)
    const numberOfTasks = useTypedSelector(state => state.todoUserData.tasks)
        .filter(el => el.forList === _id).length
    const itemRenameId = useTypedSelector(state =>
        state.todoUserData.incoming_changes?.change_data?._id)
    const [newName, setNewName] = useState<string>(name)
    const dispatch = useDispatch<Dispatch<
        dragListAction | ListContextMenu | TodoUserDataActionI | ExtensibilityActionI>>()
    const navigate = useNavigate()
    const onContextMenu = ( e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent> ) => {
        e.preventDefault()
        dispatch(listContextMenuActionCreator({
            clientX : e.clientX,
            clientY : e.clientY,
            _id,
            name,
            forGroup,
            position
        }))
    }
    const onBlurHandler = () => {
        if ( newName.length && newName !== name ) {
            dispatch(finishRenamingItemSuccessActionCreator(newName))
        } else {
            dispatch(finishRenamingItemFailedActionCreator())
        }
    }
    const enterKeyPres = ( e: KeyboardEvent<HTMLInputElement> ) => {
        if ( e.key === 'Enter' )
            if ( newName.length && newName !== name ) {
                dispatch(finishRenamingItemSuccessActionCreator(newName))
            } else {
                dispatch(finishRenamingItemFailedActionCreator())
            }
    }
    const moveToThisList = () => {
        if ( dragItem?.itemType === dragItemTypes.task && dragItem.forList !== _id )
            dispatch(moveTaskBetweenListsActionCreator({
                _id : dragItem._id,
                fromForList : dragItem.forList,
                toForList : _id,
                fromPos : dragItem.position,
                toPos : dragItem.position === null ? null : numberOfTasks
            }))
    }
    return (
        <div
            className={ s.list + ' noselect '
                + (itemRenameId === _id ?
                    forGroup ? s.rename_bg_forGroup : s.rename_bg
                    :
                    forGroup ? s.black_list : s.white_list) }
            onMouseDown={ onMouseDown }
            onMouseUp={ () => {
                moveToThisList()
                notDragging()
            } }
            onMouseLeave={ notDragging }
            onContextMenu={ onContextMenu }
        >
            <i className={ s.icon } aria-hidden/>
            { _id !== itemRenameId ?
                <span className={ s.name }>
                    { name }
                </span>
                :
                <input className={ s.name + ' ' + s.input }
                       value={ newName }
                       spellCheck={ false }
                       onBlur={ onBlurHandler }
                       onKeyPress={ enterKeyPres }
                       onChange={ e =>
                           setNewName(e.target.value)
                       }
                       autoFocus={ true }
                       onMouseDown={ e => e.stopPropagation() }
                />
            }
            <span className={ s.number_of_tasks }>
                { !!numberOfTasks && numberOfTasks }
            </span>
        </div>
    )
}

export default CustomList