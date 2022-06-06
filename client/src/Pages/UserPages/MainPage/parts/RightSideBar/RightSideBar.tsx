import * as React from 'react'
import s from './RightSideBar.module.css'
import { useTypedSelector } from '../../../../../hooks/useTypedSelector'
import { ExtensibilityActionI, ExtensibilityRightSidebarId } from '../../../../../types/Extensibility'
import Settings from './Settings/Settings'
import TaskDetails from './TaskDetails/TaskDetails'
import { closeRightSidebarActionCreator } from '../../../../../store/actionsCreator/extensibilityActionCreator'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'

const RightSideBar: React.FC = () => {
    const dispatch = useDispatch<Dispatch<ExtensibilityActionI>>()
    const { rightSidebarId, isOnFullScreen } = useTypedSelector(state => state.extensibilityState)
    if ( !rightSidebarId )
        return null

    const closeRightSideBar = () => {
        dispatch(closeRightSidebarActionCreator())
    }
    return <>
        <div className={ isOnFullScreen ? s.pos_absolute : s.wrapper }>
            {
                rightSidebarId.type === ExtensibilityRightSidebarId.SETTINGS ?
                    <Settings/>
                    :
                    <TaskDetails
                        key={ rightSidebarId.taskId + 'TaskDetails' }
                        _id={ rightSidebarId.taskId }/>
            }
        </div>
        { isOnFullScreen && <div className={ s.background } onClick={ closeRightSideBar }/> }
    </>
}

export default RightSideBar