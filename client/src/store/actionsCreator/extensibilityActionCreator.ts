import { ExtensibilityActionI, ExtensibilityActionTypes } from '../../types/Extensibility'

export const toggleNavbarActionCreator = (): ExtensibilityActionI => (
    { type : ExtensibilityActionTypes.TOGGLE_NAVBAR }
)
export const closeRightSidebarActionCreator = (): ExtensibilityActionI => (
    { type : ExtensibilityActionTypes.CLOSE_RIGHT_SIDEBAR }
)
export const toggleProfileActionCreator = (): ExtensibilityActionI => (
    { type : ExtensibilityActionTypes.TOGGLE_PROFILE }
)
export const openSettingsActionCreator = (): ExtensibilityActionI => (
    { type : ExtensibilityActionTypes.OPEN_SETTINGS }
)

export const toggleIsOnFullScreenActionCreator = (): ExtensibilityActionI => (
    { type : ExtensibilityActionTypes.TOGGLE_IS_ON_FULL_SCREEN }
)

export const toggleCanBeOpenedTogetherActionCreator = (): ExtensibilityActionI => (
    { type : ExtensibilityActionTypes.TOGGLE_CAN_BE_OPENED_TOGETHER }
)

export const openTaskDetailsActionCreator = ( _id: string ): ExtensibilityActionI => ({
    type : ExtensibilityActionTypes.OPEN_TASK_DETAILS,
    payload : { _id }
})