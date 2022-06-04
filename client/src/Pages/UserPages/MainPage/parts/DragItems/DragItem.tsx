import * as React from 'react'
import { useTypedSelector } from '../../../../../hooks/useTypedSelector'
import { dragItemTypes } from '../../../../../types/drag&drop'
import DragGroup from './Group/DragGroup'
import DragList from './List/DragList'
import DragTask from './Task/DragTask'
import DragStep from './Step/DragStep'

const DragItem: React.FC = () => {
    const { dragItem, isDragging } = useTypedSelector(state => state.dragAndDrop)
    if ( isDragging && dragItem ) {
        switch ( dragItem.itemType ) {
            case dragItemTypes.step: {
                const { itemType, ...dragItemToProps } = dragItem
                return <DragStep { ...dragItemToProps }/>
            }
            case dragItemTypes.task: {
                const { itemType, ...dragItemToProps } = dragItem
                return <DragTask { ...dragItemToProps }/>
            }
            case dragItemTypes.list: {
                const { itemType, ...dragItemToProps } = dragItem
                return <DragList { ...dragItemToProps }/>
            }
            case dragItemTypes.group: {
                const { itemType, ...dragItemToProps } = dragItem
                return <DragGroup { ...dragItemToProps }/>
            }
            default:
                return null
        }
    } else return null
}

export default DragItem