import * as React from 'react'
import { CSSProperties, Dispatch } from 'react'
import s from './GroupContextMenu.module.css'
import { useTypedSelector } from '../../../../../../hooks/useTypedSelector'
import { useDispatch } from 'react-redux'
import { ClearContextMenu } from '../../../../../../types/contextMenu'
import { clearContextMenuActionCreator } from '../../../../../../store/actionsCreator/contextMenuActionCreator'
import { deleteGroupActionI, startRenamingItem } from '../../../../../../types/todoUserData'
import {
    deleteGroupActionCreator,
    startRenamingGroup
} from '../../../../../../store/actionsCreator/todoUserDataActionCreator'

interface Props {
    _id: string,
    position: number,
    stylePosition: CSSProperties
}

const GroupContextMenu: React.FC<Props> = ( { _id, position, stylePosition } ) => {
    const doesHaveListItems = !!(useTypedSelector(state => state.todoUserData.lists)
        .filter(el => el.forGroup === _id).length)
    const dispatch = useDispatch<Dispatch<ClearContextMenu | deleteGroupActionI | startRenamingItem>>()
    const renameClickHandler = () => {
        dispatch(clearContextMenuActionCreator())
        setTimeout(() => dispatch(startRenamingGroup(_id)))
    }
    const deleteClickHandler = () => {
        dispatch(clearContextMenuActionCreator())
        dispatch(deleteGroupActionCreator({ _id, position }))
    }
    return (
        <div style={ stylePosition }
             className={ s.wrapper }
             onMouseDown={e => e.stopPropagation()}
        >
            <div className={ s.contextMenu_item } onMouseDown={ renameClickHandler }>
                <i className={ s.rename_icon + ' ' + s.iconSize_24 }/>
                <span className={ s.rename_text }>
                    Rename group
                </span>
            </div>
            <div className={ s.line }/>
            <div className={ s.contextMenu_item }
                 onMouseDown={ deleteClickHandler }
            >
                {
                    doesHaveListItems ?
                        <>
                            <i className={ s.iconSize_24 + ' ' + s.ungroup_icon }>
                                <svg width="24px" height="24px" focusable="false" viewBox="0 0 24 24">
                                    <g fillRule="evenodd" stroke="none" strokeWidth="1">
                                        <path d="M8,15 L8,8 L9.001,8 L9.001,15 L8,15 Z M17.5,4 C18.878,4 20,5.121 20,6.5
                                        L20,7 L19,7 L19,6.5 C19,5.673 18.327,5 17.5,5 L17,5 L17,4 L17.5,4 Z M10,19
                                        L10,18 L14,18 L14,19 L10,19 Z M4,13 L4,10 L5,10 L5,13 L4,13 Z M19,13 L19,10
                                        L20,10 L20,13 L19,13 Z M19,16.5 L19,16 L20,16 L20,16.5 C20,17.879 18.878,19
                                        17.5,19 L17,19 L17,18 L17.5,18 C18.327,18 19,17.327 19,16.5 Z M10,5 L10,4 L14,4
                                        L14,5 L10,5 Z M5,16.5 C5,17.327 5.673,18 6.5,18 L7,18 L7,19 L6.5,19 C5.122,19
                                        4,17.879 4,16.5 L4,16 L5,16 L5,16.5 Z M4,6.5 C4,5.121 5.122,4 6.5,4 L7,4 L7,5
                                        L6.5,5 C5.673,5 5,5.673 5,6.5 L5,7 L4,7 L4,6.5 Z"/>
                                    </g>
                                </svg>
                            </i>
                            <span className={ s.delete_text }>Ungroup lists</span>
                        </>
                        :
                        <>
                            <i className={ s.delete_icon + ' ' + s.iconSize_24 }/>
                            <span className={ s.delete_text }>Delete group</span>
                        </>
                }
            </div>
        </div>
    )
}

export default GroupContextMenu