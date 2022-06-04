import * as React from 'react'
import s from './ListContextMenu.module.css'
import { useDispatch } from 'react-redux'
import { CSSProperties, Dispatch, useState } from 'react'
import { ClearContextMenu } from '../../../../../../types/contextMenu'
import { useTypedSelector } from '../../../../../../hooks/useTypedSelector'
import { clearContextMenuActionCreator } from '../../../../../../store/actionsCreator/contextMenuActionCreator'
import { deleteListActionI, moveListAction, startRenamingItem } from '../../../../../../types/todoUserData'
import {
    deleteListActionCreator, moveListActionCreator,
    startRenamingList
} from '../../../../../../store/actionsCreator/todoUserDataActionCreator'
import { useHideWhenMouseOnAnotherElement } from '../../../../../../hooks/useHideWhenMouseOnAnotherElement'

interface Props {
    _id: string,
    position: number,
    forGroup?: string,
    stylePosition: CSSProperties
}

const ListContextMenu: React.FC<Props> = (
    { _id, position, forGroup, stylePosition }
) => {
    const lists = useTypedSelector(state => state.todoUserData.lists)
    const groups = useTypedSelector(state => state.todoUserData.groups)
    const dispatch = useDispatch<Dispatch<ClearContextMenu | deleteListActionI | startRenamingItem | moveListAction>>()
    const [isMoveToHovered, setIsMoveToHovered] = useState<boolean>(false)
    const { onMouseLeave, onMouseEnter } = useHideWhenMouseOnAnotherElement(
        isMoveToHovered, setIsMoveToHovered
    )
    const renameClickHandler = () => {
        dispatch(clearContextMenuActionCreator())
        setTimeout(() => dispatch(startRenamingList(_id)))
    }
    const deleteClickHandler = () => {
        dispatch(clearContextMenuActionCreator())
        dispatch(deleteListActionCreator({ _id, position }))
    }
    const moveToGroup = ( groupId: string ) => {
        dispatch(moveListActionCreator({
            _id,
            prevGroup : forGroup,
            forGroup : groupId,
            fromPos : position,
            toPos : lists.filter(( { forGroup } ) => groupId === forGroup).length
        }))
        dispatch(clearContextMenuActionCreator())
    }
    const removeFromGroup = () => {
        dispatch(moveListActionCreator({
            _id,
            prevGroup : forGroup,
            forGroup : undefined,
            fromPos : position,
            toPos : groups.filter(el => el._id === forGroup)[ 0 ].position + 1
        }))
    }
    return (
        <div style={ stylePosition } className={ s.wrapper }>
            { !!(groups.length - (forGroup ? 1 : 0)) && (
                <>
                    <div className={ s.contextMenu_item + ' ' + s.move_to }
                         onMouseEnter={ () => setIsMoveToHovered(true) }
                         onMouseDown={ ( e ) => {
                             e.stopPropagation()
                             setIsMoveToHovered(true)
                         } }
                    >
                        <i className={ s.iconSize_24 }>
                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <g fillRule="evenodd" stroke="none" strokeWidth="1">
                                    <path d="M20,6.5 L20,8 L19,8 L19,6.5 C19,5.673 18.327,5 17.5,5 L6.5,5 C5.673,5 5,
                                    5.673 5,6.5 L5,16.5 C5,17.327 5.673,18 6.5,18 L17.5,18 C18.327,18 19,17.327 19,16.5
                                    L19,15 L20,15 L20,16.5 C20,17.879 18.879,19 17.5,19 L6.5,19 C5.122,19 4,17.879
                                    4,16.5 L4,6.5 C4,5.121 5.122,4 6.5,4 L17.5,4 C18.879,4 20,5.121 20,6.5 Z M8,15 L8,8
                                    L9,8 L9,15 L8,15 Z M19.9971,11.0029 L19.9971,12.0029 L15.7041,12.0029 L17.3511,
                                    13.6489 L16.6431,14.3569 L13.7901,11.5029 L16.6431,8.6489 L17.3511,9.3569 L15.7041,
                                    11.0029 L19.9971,11.0029 Z"/>
                                </g>
                            </svg>
                        </i>
                        <span className={ s.rename_text }>
                            Move list to...
                        </span>
                        <i className={ s.iconSize_24 + ' ' + s.arrow }/>
                        {
                            isMoveToHovered && <div className={ s.groups } style={ {
                                top : groups.length - + !!forGroup === 1 ? -6 + 'px' :
                                    groups.length - + !!forGroup === 2 ? -21 + 'px' :
                                        (-groups.length + 1 - (forGroup ? 1 : 0)) * 19 - 4 + 'px'
                            } }>
                                {
                                    groups.map(( { name, _id } ) => _id !== forGroup && (
                                        <div className={ s.group_wrapper } key={ _id }
                                             onClick={ () => moveToGroup(_id) }
                                        >
                                            <div className={ s.group }>
                                                <i>
                                                    <svg className={ s.icon_group }
                                                         width="24" height="24"
                                                         viewBox="0 0 24 24">
                                                        <g fillRule="evenodd" stroke="none" strokeWidth="1">
                                                            <path
                                                                d="M19,16.5 L19,6.5 C19,5.673 18.327,5 17.5,5 L6.5,5 C5.673,
                                                            5 5,5.673 5,6.5 L5,16.5C5,17.327 5.673,18 6.5,18 L17.5,18
                                                            C18.327,18 19,17.327 19,16.5 Z M6.5,4 L17.5,4 C18.878,4 20,
                                                            5.121 20,6.5 L20,16.5 C20,17.879 18.878,19 17.5,19 L6.5,19
                                                            C5.122,19 4,17.879 4,16.5 L4,6.5 C4,5.121 5.122,4 6.5,4 Z M8
                                                            ,15 L8,8 L9,8 L9,15 L8,15 Z"/>
                                                        </g>
                                                    </svg>
                                                </i>
                                                <span className={ s.group_name + ' noselect' }>
                                                { name.length > 25 ?
                                                    name.substring(0, 25) + '...'
                                                    :
                                                    name
                                                }
                                            </span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        }
                    </div>
                </>
            ) }
            { forGroup &&
                (
                    <div className={ s.contextMenu_item }
                         onMouseDown={ removeFromGroup }
                         onMouseLeave={ onMouseLeave }
                         onMouseEnter={ onMouseEnter }
                    >
                        <i className={ s.iconSize_24 }>
                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <g fillRule="evenodd" stroke="none" strokeWidth="1">
                                    <path d="M19,16.5 L19,15 L20,15 L20,16.5 C20,17.879 18.879,19 17.5,19 L6.5,19
                                    C5.121,19 4,17.879 4,16.5 L4,6.5 C4,5.121 5.121,4 6.5,4 L17.5,4 C18.879,4 20,5.121
                                    20,6.5 L20,8 L19,8 L19,6.5 C19,5.673 18.327,5 17.5,5 L6.5,5 C5.673,5 5,5.673 5,6.5
                                    L5,16.5 C5,17.327 5.673,18 6.5,18 L17.5,18 C18.327,18 19,17.327 19,16.5 Z M8,15 L8,
                                    8 L9,8 L9,15 L8,15 Z M17.3535,14.3574 L16.6465,13.6504 L18.2925,12.0034 L13.9995,
                                    12.0034 L13.9995,11.0034 L18.2925,11.0034 L16.6465,9.3574 L17.3535,8.6504 L20.2075,
                                    11.5034 L17.3535,14.3574 Z"/>
                                </g>
                            </svg>
                        </i>
                        <span className={ s.rename_text }>
                            Remove from group
                        </span>
                    </div>
                )
            }
            <div className={ s.contextMenu_item } onMouseDown={ renameClickHandler }
                 onMouseLeave={ onMouseLeave }
                 onMouseEnter={ onMouseEnter }
            >
                <i className={ s.rename_icon + ' ' + s.iconSize_24 }/>
                <span className={ s.rename_text }>
                    Rename list
                </span>
            </div>
            <div className={ s.line }/>
            <div className={ s.contextMenu_item }
                 onMouseDown={ () => {
                     deleteClickHandler()
                 } }
                 onMouseLeave={ onMouseLeave }
                 onMouseEnter={ onMouseEnter }
            >
                <i className={ s.delete_icon + ' ' + s.iconSize_24 }/>
                <span className={ s.delete_text }>Delete list</span>
            </div>
        </div>
    )
}

export default ListContextMenu