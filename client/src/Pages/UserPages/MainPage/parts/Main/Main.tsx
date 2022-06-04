import * as React from 'react'
import { useTypedSelector } from '../../../../../hooks/useTypedSelector'
import s from './Main.module.css'

const Main: React.FC = ( { children } ) => {
    const { rightSidebarId, isOnFullScreen, openedNavbar } = useTypedSelector(
        state => state.extensibilityState)
    return (
        <main className={ isOnFullScreen && (openedNavbar || rightSidebarId) ? s.pos_absolute : undefined }>
            { children }
        </main>
    )
}

export default Main