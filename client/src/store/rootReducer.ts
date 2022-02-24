import { combineReducers } from 'redux'
import { AuthReducer } from './reducers/authReducer'
import { messageReducer } from './reducers/messageReducer'

export const RootReducer = combineReducers({
    auth : AuthReducer,
    message : messageReducer
})