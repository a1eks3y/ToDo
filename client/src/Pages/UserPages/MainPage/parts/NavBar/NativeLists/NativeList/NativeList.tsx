import * as React from 'react'
import s from './NativeList.module.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTypedSelector } from '../../../../../../../hooks/useTypedSelector'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { ExtensibilityActionI, ExtensibilityRightSidebarId } from '../../../../../../../types/Extensibility'
import { closeRightSidebarActionCreator } from '../../../../../../../store/actionsCreator/extensibilityActionCreator'

interface State {
    name: string
    numberOfTasks: number
    children: React.ReactNode
    active_color: string,
    onMouseUp?: () => void
}

const NativeList: React.FC<State> = ( {
    name, numberOfTasks, children,
    active_color, onMouseUp
} ) => {
    const rightSidebarId = useTypedSelector(state => state.extensibilityState.rightSidebarId)
    const dispatch = useDispatch<Dispatch<ExtensibilityActionI>>()
    const navigate = useNavigate()
    const location = useLocation().pathname.split('/')[ 1 ]
    const pathname = [
        name.split(' ')[0],
        name.split(' ')[1] ?
            name.split(' ')[1].charAt(0).toUpperCase() + name.split(' ')[1].slice(1) : ''
    ].join('')
    const clickHandler = () => {
        if ( location === pathname )
            return
        if ( rightSidebarId?.type === ExtensibilityRightSidebarId.TASK_DETAILS )
            dispatch(closeRightSidebarActionCreator())
        navigate(pathname)
    }

    return (
        <div
            className={ s.list + ' ' + (location === pathname ? s.list_chosen : s.list_hover) }
            style={ {
                color : location === pathname ? active_color : 'black'
            } }
            onClick={ clickHandler }
            onMouseUp={ onMouseUp }
        >
            <div className={ s.svg_wrapper }>
                { children }
            </div>
            <div className={ s.name }>
                { name }
            </div>
            <div className={ s.numberOfTasks } aria-hidden={ !numberOfTasks }>
                { !!numberOfTasks && numberOfTasks }
            </div>
        </div>
    )
}

export default NativeList