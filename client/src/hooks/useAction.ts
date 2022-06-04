import { bindActionCreators } from 'redux'
import { useDispatch } from 'react-redux'
import * as AuthActions from '../store/async_actions/authAction'
import { SyncDateAction } from '../store/async_actions/syncDateAction'
import * as TodoUserDataActions from '../store/async_actions/todoUserDataAction'

export const useAction = () => {
    const dispatch = useDispatch()
    return bindActionCreators({
        ...AuthActions,
        SyncDateAction,
        ...TodoUserDataActions
    }, dispatch)
}