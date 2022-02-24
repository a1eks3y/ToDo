import { bindActionCreators } from 'redux'
import { useDispatch } from 'react-redux'
import * as AuthActionsCreators from '../store/async_actions/authAction'

export const useAction = () => {
    const dispatch = useDispatch()
    return bindActionCreators({
        ...AuthActionsCreators
    }, dispatch)
}