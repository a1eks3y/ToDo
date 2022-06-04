import * as React from 'react'
import s from './TaskItem.module.css'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { ClearContextMenu } from '../../../../../../../types/contextMenu'
import { clearContextMenuActionCreator } from '../../../../../../../store/actionsCreator/contextMenuActionCreator'

interface Props {
    text: string,
    isRed: boolean,
    onMouseDown: () => void
}

const TaskItem: React.FC<Props> = (
    { children, isRed, text, onMouseDown }
) => {
    const dispatch = useDispatch<Dispatch<ClearContextMenu>>()
    const closeContextMenu = () => {
        dispatch(clearContextMenuActionCreator())
    }
    return (
        <div
            className={ s.wrapper + (isRed ? ' ' + s.red : '') }
            onMouseDown={ () => {
                onMouseDown()
                closeContextMenu()
            } }
        >
            <div className={ s.icon }>
                { children }
            </div>
            <div className={ s.text_wrapper }>
                <span className={ s.text }>
                    { text }
                </span>
            </div>
        </div>
    )
}

export default TaskItem