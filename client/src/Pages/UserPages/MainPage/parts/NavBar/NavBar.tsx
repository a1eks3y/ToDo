import * as React from 'react'
import { Dispatch, useEffect } from 'react'
import s from './NavBar.module.css'
import NativeLists from './NativeLists/NativeLists'
import { useDispatch } from 'react-redux'
import { ExtensibilityActionI } from '../../../../../types/Extensibility'
import {
    toggleCanBeOpenedTogetherActionCreator, toggleIsOnFullScreenActionCreator,
    toggleNavbarActionCreator
} from '../../../../../store/actionsCreator/extensibilityActionCreator'
import CustomListsAndGroups from './CustomListsAndGroups/CustomListsAndGroups'
import AddListAndGroup from './AddListAndGroup/AddListAndGroup'
import { useTypedSelector } from '../../../../../hooks/useTypedSelector'

const NavBar: React.FC = () => {
    const { openedNavbar, isOnFullScreen, canBeOpenedTogether } = useTypedSelector(
        state => state.extensibilityState)
    const dispatch = useDispatch<Dispatch<ExtensibilityActionI>>()
    const toggleNavBar = () => {
        dispatch(toggleNavbarActionCreator())
    }
    useEffect(() => {
        const onWindowResize = () => {
            const newIsOnFillScreen = window.innerWidth < 770
            const newCanBeOpenedTogether = window.innerWidth > 908
            if ( newIsOnFillScreen !== isOnFullScreen )
                dispatch(toggleIsOnFullScreenActionCreator())
            if ( newCanBeOpenedTogether !== canBeOpenedTogether )
                dispatch(toggleCanBeOpenedTogetherActionCreator())
        }
        window.addEventListener('resize', onWindowResize)
        return () => window.removeEventListener('resize', onWindowResize)
    }, [isOnFullScreen, openedNavbar, dispatch, canBeOpenedTogether])
    if ( !openedNavbar )
        return null
    return (
        <>
            <nav className={ 'noselect' + (isOnFullScreen ? ' ' + s.nav_fullscreen : '') }>
                <div className={ s.navbar_icon_wrapper }>
                    <i className={ s.navbar_icon } onClick={ toggleNavBar }/>
                </div>
                <div className={ s.lists_and_groups }>
                    <NativeLists key={ 'nativeLists' }/>
                    <CustomListsAndGroups key={ 'customListsAndGroups' }/>
                </div>
                <AddListAndGroup key={ 'addListAndGroup' }/>
            </nav>
            { isOnFullScreen && <div className={ s.background } onClick={ toggleNavBar }/> }
        </>
    )
}

export default NavBar