import { combineReducers } from 'redux'
import { AuthReducer } from './reducers/authReducer'
import { messageReducer } from './reducers/messageReducer'
import { extensibilityReducer } from './reducers/extensibilityReducer'
import { syncDateReducer } from './reducers/syncDateReducer'
import { dragAndDropReducer } from './reducers/drag&dropReducer'
import { TodoUserDataReducer } from './reducers/todoUserDataReducer'
import { ContextMenuReducer } from './reducers/contextMenuReducer'

export const RootReducer = combineReducers({
    auth : AuthReducer,
    extensibilityState : extensibilityReducer,
    syncDate: syncDateReducer,
    dragAndDrop: dragAndDropReducer,
    todoUserData: TodoUserDataReducer,
    message : messageReducer,
    contextMenu : ContextMenuReducer
})