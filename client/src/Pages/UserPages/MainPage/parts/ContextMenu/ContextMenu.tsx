import * as React from 'react'
import { useTypedSelector } from '../../../../../hooks/useTypedSelector'
import { contextMenuActionType } from '../../../../../types/contextMenu'
import GroupContextMenu from './GroupContextMenu/GroupContextMenu'
import ListContextMenu from './ListContextMenu/ListContextMenu'
import TaskContextMenu from './TaskContextMenu/TaskContextMenu'
import ChooseDate from './ChooseDate/ChooseDate'
import { CSSProperties } from 'react'

const ContextMenu: React.FC = () => {
    const { isOpen, item } = useTypedSelector(state => state.contextMenu)
    if ( !isOpen || !item )
        return <></>
    if ( item.type !== contextMenuActionType.CHOOSE_DATE ) {
        const { clientX, clientY } = item

        const stylePosition: CSSProperties = {
            ...(window.innerHeight / 2 - clientY >= 0 ?
                { top : clientY + 'px' } : { bottom : window.innerHeight - clientY + 'px' }),
            ...(window.innerWidth / 2 - clientX >= 0 ?
                { left : clientX + 'px' } : { right : window.innerWidth - clientX + 'px' })
        }
        switch ( item.type ) {
            case contextMenuActionType.GROUP:
                return <GroupContextMenu _id={ item._id } stylePosition={ stylePosition }
                                         position={ item.position }/>
            case contextMenuActionType.LIST:
                return <ListContextMenu _id={ item._id } stylePosition={ stylePosition }
                                        position={ item.position } forGroup={ item.forGroup }/>
            case contextMenuActionType.TASK: {
                const { clientY, clientX, type, ...itemData } = item
                return <TaskContextMenu { ...itemData } stylePosition={ stylePosition }/>
            }
        }
    }
    if ( item.type === contextMenuActionType.CHOOSE_DATE )
        return <ChooseDate setDate={ item.setDate }
                           offsetHeight={ item.offsetHeight }
                           offsetWidth={ item.offsetWidth }
                           height={ item.height }
                           width={ item.width }
                           initialDate={ item.fullDate }/>
    return null
}

export default ContextMenu