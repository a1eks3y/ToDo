import * as React from 'react'
import s from './DragList.module.css'
import { useTypedSelector } from '../../../../../../hooks/useTypedSelector'
import { useMoveItems } from '../../../../../../hooks/useMoveItems'

interface DragProps {
    _id: string,
    name: string,
    x: number,
    y: number
}

const DragList: React.FC<DragProps> = ( { _id, name, x, y } ) => {
    const numberOfTasks = useTypedSelector(state => state.todoUserData.tasks)
        .filter(el => el.forList === _id).length
    const { mouseX, mouseY } = useMoveItems(x, y)
    const width = window.innerWidth >= 1010 ? 263 : 186
    return (
        <div className={ s.drag_list } style={ {
            top : (mouseY + 36 > window.innerHeight ? window.innerHeight - 36 : mouseY) + 'px',
            left : (mouseX + width > window.innerWidth ? window.innerWidth - width : mouseX) + 'px'
        } }>
            <div className={ s.list + ' noselect' }>
                <i className={ s.icon } aria-hidden/>
                <span className={ s.name }>
                    { name }
                </span>
                <span className={ s.number_of_tasks }>
                    { !!numberOfTasks && numberOfTasks }
                </span>
            </div>
        </div>
    )
}

export default DragList