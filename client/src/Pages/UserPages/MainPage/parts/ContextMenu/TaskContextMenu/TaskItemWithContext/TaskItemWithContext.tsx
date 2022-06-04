import * as React from 'react'
import s from './TaskItemWithContext.module.css'
import { useTypedSelector } from '../../../../../../../hooks/useTypedSelector'
import TaskItem from '../TaskItem/TaskItem'

interface Props {
    _id: string,
    forList?: string,
    onMouseDown: ( toForList: (string | undefined) | string ) => void,
    text: string,
    showContent: showContentEnum.RIGHT | showContentEnum.LEFT | showContentEnum.TOP | showContentEnum.BOTTOM | false
}

export enum showContentEnum {
    RIGHT = 'RIGHT',
    LEFT = 'LEFT',
    TOP = 'TOP',
    BOTTOM = 'BOTTOM'
}

const TaskItemWithContext: React.FC<Props> = (
    {
        children, text, showContent,
        forList, onMouseDown
    }
) => {
    const lists = useTypedSelector(state => state.todoUserData.lists)
    return (
        <div className={ s.wrapper }>
            <div className={ s.iconWrapper }>
                { children }
            </div>
            <div>
                { text }
            </div>
            <div>
                <i className={ s.arrowIcon }/>
            </div>
            {
                showContent && <ul className={
                    s.lists + ' ' + (
                        showContent !== showContentEnum.BOTTOM && showContent !== showContentEnum.TOP ?
                            lists.length === 1 ? s.oneList : lists.length % 2 === 1 ? s.oddLists : s.evenLists : ''
                    )
                    + ' ' + (
                        (showContent === showContentEnum.RIGHT && s.right_lists) ||
                        (showContent === showContentEnum.TOP && s.top_lists) ||
                        (showContent === showContentEnum.BOTTOM && s.bottom_lists) ||
                        (showContent === showContentEnum.LEFT && s.left_lists)
                    )
                }>
                    { !!forList && <li className={ s.list }>

                        <TaskItem text={ 'Tasks' } isRed={ false } onMouseDown={ () => {
                            onMouseDown(undefined)
                        } }>
                            <i className={ s.icon + ' ' + s.iconHome }/>
                        </TaskItem>
                    </li> }
                    { lists.map(( { _id, name } ) => <li key={ _id }>
                        <TaskItem text={ name } isRed={ false } onMouseDown={ () => {
                            onMouseDown(_id)
                        } }>
                            <i className={ s.icon + ' ' + s.iconList }/>
                        </TaskItem>
                    </li>) }
                </ul>
            }
        </div>
    )
}

export default TaskItemWithContext