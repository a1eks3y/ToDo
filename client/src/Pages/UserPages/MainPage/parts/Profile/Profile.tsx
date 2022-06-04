import * as React from 'react'
import s from './Profile.module.css'
import { useTypedSelector } from '../../../../../hooks/useTypedSelector'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { ExtensibilityActionI } from '../../../../../types/Extensibility'
import { useEffect } from 'react'
import { toggleProfileActionCreator } from '../../../../../store/actionsCreator/extensibilityActionCreator'
import { AuthActionLogout } from '../../../../../types/Auth'
import { logoutActionCreator } from '../../../../../store/actionsCreator/authActionCreator'
import { TodoUserDataActionI } from '../../../../../types/todoUserData'
import { clearAllDataActionCreator } from '../../../../../store/actionsCreator/todoUserDataActionCreator'
import { useAction } from '../../../../../hooks/useAction'

const Profile: React.FC = () => {
    const auth = useTypedSelector(state => state.auth.userData)
    const isOpened = useTypedSelector(state => state.extensibilityState.openedProfile)
    const incoming_changes = useTypedSelector(state => state.todoUserData.incoming_changes)
    const { updateServerDataCb } = useAction()
    const dispatch = useDispatch<Dispatch<ExtensibilityActionI | AuthActionLogout | TodoUserDataActionI>>()
    useEffect(() => {
        const onClick = () => {
            if ( isOpened )
                dispatch(toggleProfileActionCreator())
        }
        document.addEventListener('click', onClick)
        return () => document.removeEventListener('click', onClick)
    })
    const logout = () => {
        localStorage.removeItem('jwt')
        dispatch(logoutActionCreator())
        if ( incoming_changes?.timeOfLastChange ) {
            updateServerDataCb({
                change_pos_items: incoming_changes.change_pos,
                change_data_items: incoming_changes.change_data?.items
            })
        }
        dispatch(clearAllDataActionCreator())
    }
    if ( !isOpened || !auth )
        return null
    return (
        <div className={ s.profile + ' ' + s.login_box } onMouseUp={ e => e.preventDefault() }>
            <h4>Hi, { auth.username }</h4>
            <button className={ s.btn } onClick={ e => {
                e.preventDefault()
                logout()
            } }>
                <span/>
                <span/>
                <span/>
                <span/>
                Log out
            </button>
        </div>
    )
}

export default Profile