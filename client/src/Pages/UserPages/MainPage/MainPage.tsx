import * as React from 'react'
import { Dispatch, useEffect, useRef, useState } from 'react'
import NavBar from './parts/NavBar/NavBar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Main from './parts/Main/Main'
import s from './MainPage.module.css'
import Header from './parts/Header/Header'
import { useAction } from '../../../hooks/useAction'
import { useTypedSelector } from '../../../hooks/useTypedSelector'
import { useDispatch } from 'react-redux'
import { DropAction } from '../../../types/drag&drop'
import { dropActionCreator } from '../../../store/actionsCreator/drag&droppActionCreator'
import DragItem from './parts/DragItems/DragItem'
import ContextMenu from './parts/ContextMenu/ContextMenu'
import { ClearContextMenu } from '../../../types/contextMenu'
import { clearContextMenuActionCreator } from '../../../store/actionsCreator/contextMenuActionCreator'
import Profile from './parts/Profile/Profile'
import RightSideBar from './parts/RightSideBar/RightSideBar'
import { ExtensibilityActionI, ExtensibilityRightSidebarId } from '../../../types/Extensibility'
import {
    openTaskDetailsActionCreator,
    toggleNavbarActionCreator
} from '../../../store/actionsCreator/extensibilityActionCreator'

let syncTimeIntervalId: NodeJS.Timer | null = null

const MainPage: React.FC = () => {
    const { rightSidebarId, openedNavbar, isOnFullScreen } = useTypedSelector(state => state.extensibilityState)
    const incoming_changes = useTypedSelector(state =>
        state.todoUserData.incoming_changes)
    const numberOfErrors = useTypedSelector(state => state.syncDate.errors)
    const userTimezone = useTypedSelector(state => state.auth.userData?.timezone)
    const isDragging = useTypedSelector(state => state.dragAndDrop.isDragging)
    const isOpen = useTypedSelector(state => state.contextMenu.isOpen)
    const tasks = useTypedSelector(state => state.todoUserData.tasks)
    const dispatch = useDispatch<Dispatch<DropAction | ClearContextMenu | ExtensibilityActionI>>()
    const { SyncDateAction, updateServerDataCb } = useAction()
    const [isFirstLoading, setIsFirstLoading] = useState(true)
    const updateServerDataTimeoutId = useRef<NodeJS.Timeout | null>(null)
    const path = useLocation().pathname.split('/')[ 1 ]
    const navigate = useNavigate()
    const curNavigate = useRef(navigate)
    curNavigate.current = navigate
    const taskAtTheMoment = useRef(tasks)
    taskAtTheMoment.current = tasks
    const curDispatch = useRef(dispatch)
    curDispatch.current = dispatch
    const openedNavbarCur = useRef(openedNavbar)
    openedNavbarCur.current = openedNavbar
    useEffect(() => {
        const lastLocation = localStorage.getItem('lastLocation')
        localStorage.removeItem('lastLocation')
        if ( lastLocation ) {
            curNavigate.current(lastLocation)
            const openedNavbar = JSON.stringify(localStorage.getItem('isOpenedNavBar'))
            localStorage.removeItem('isOpenedNavBar')
            if ( (openedNavbar === 'false' || openedNavbar === 'true')
                && openedNavbarCur.current + '' !== openedNavbar ) {
                curDispatch.current(toggleNavbarActionCreator())
            }
            const lastTaskDetailsId = localStorage.getItem('lastTaskDetailsId')
            localStorage.removeItem('lastTaskDetailsId')
            if ( lastTaskDetailsId ) {
                const lastTask = taskAtTheMoment.current.find(el => el._id === lastTaskDetailsId)
                if ( lastTask && (
                    (lastLocation === 'Myday' && lastTask.myDay !== undefined) ||
                    (lastLocation === 'Favourites' && lastTask.favourites !== undefined) ||
                    (lastLocation === 'Planned' && lastTask.endAt !== undefined) ||
                    (lastLocation === 'Completed' && lastTask.completedAt !== undefined) ||
                    (lastLocation === 'All') ||
                    (lastTask.forList === lastLocation)
                ) )
                    curDispatch.current(openTaskDetailsActionCreator(lastTask._id))
            }
        }
    }, [])
    useEffect(() => {
        localStorage.removeItem('lastTaskDetailsId')
        localStorage.removeItem('isOpenedNavBar')
        localStorage.removeItem('lastLocation')
        rightSidebarId?.type === ExtensibilityRightSidebarId.TASK_DETAILS &&
        localStorage.setItem('lastTaskDetailsId', rightSidebarId.taskId)

        localStorage.setItem('isOpenedNavBar', `${ openedNavbar }`)
        localStorage.setItem('lastLocation', path)
    }, [openedNavbar, path, rightSidebarId])
    useEffect(() => {
        if ( !isFirstLoading ) {
            if ( syncTimeIntervalId === null && !!userTimezone ) {
                syncTimeIntervalId = setInterval(() => {
                    SyncDateAction({ userTimezone, numberOfErrors })
                }, 30 * 1000)
            }
        } else {
            setIsFirstLoading(false)
            userTimezone && SyncDateAction({ userTimezone, numberOfErrors })
        }
        return () => {
            if ( syncTimeIntervalId !== null ) {
                clearInterval(syncTimeIntervalId)
                syncTimeIntervalId = null
            }
        }
    }, [userTimezone, SyncDateAction, numberOfErrors, isFirstLoading])

    useEffect(() => { //send data if page are going to be closed
        window.onbeforeunload = () => {
            incoming_changes && updateServerDataCb({
                change_pos_items : incoming_changes.change_pos,
                change_data_items : incoming_changes.change_data?.items
            })
        }
        return () => {
            window.onbeforeunload = () => {
            }
        }
    }, [updateServerDataCb, incoming_changes])

    useEffect(() => {
        if ( updateServerDataTimeoutId.current !== null ) {
            clearTimeout(updateServerDataTimeoutId.current)
            updateServerDataTimeoutId.current = null
        }
        if ( incoming_changes?.timeOfLastChange ) {
            updateServerDataTimeoutId.current = setTimeout(() => {
                incoming_changes && updateServerDataCb({
                    change_pos_items : incoming_changes.change_pos,
                    change_data_items : incoming_changes.change_data?.items
                })
            }, incoming_changes?.timeOfLastChange + 5000 - new Date().getTime())
        }
    }, [incoming_changes, updateServerDataCb])

    const mouseUpHandler = () => {
        if ( isDragging )
            dispatch(dropActionCreator())
    }
    const onMouseDownHandler = () => {
        if ( isOpen )
            dispatch(clearContextMenuActionCreator())
    }
    return (
        <div className={ s.content + ' ' +
            (!isOnFullScreen ?
                (rightSidebarId ? s.rightSidebar + ' ' : '') + (openedNavbar ? s.openedNavbar + ' ' : '')
                : '') }
             onMouseUp={ mouseUpHandler }
             onMouseDown={ onMouseDownHandler }
        >
            <Header/>
            <NavBar/>
            <Main>
                <Outlet/>
            </Main>
            <Profile/>
            <RightSideBar/>
            <DragItem/>
            <ContextMenu/>
        </div>
    )
}

export default MainPage