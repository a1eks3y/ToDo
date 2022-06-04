import {
    ExtensibilityActionI,
    ExtensibilityActionTypes,
    ExtensibilityRightSidebarId,
    ExtensibilityStateI
} from '../../types/Extensibility'

const defaultState: ExtensibilityStateI = {
    openedNavbar : true,
    openedProfile : false,
    isOnFullScreen : window.innerWidth < 770,
    rightSidebarId : null,
    canBeOpenedTogether : window.innerWidth > 908
}

export const extensibilityReducer = (
    state: ExtensibilityStateI = defaultState,
    action: ExtensibilityActionI ): ExtensibilityStateI => {
    switch ( action.type ) {
        case ExtensibilityActionTypes.TOGGLE_NAVBAR:
            return {
                ...state,
                openedNavbar : !state.openedNavbar,
                rightSidebarId : !state.openedNavbar && state.rightSidebarId && !state.canBeOpenedTogether ?
                    null : state.rightSidebarId
            }
        case ExtensibilityActionTypes.CLOSE_RIGHT_SIDEBAR:
            return {
                ...state,
                rightSidebarId : null
            }
        case ExtensibilityActionTypes.TOGGLE_PROFILE:
            return {
                ...state,
                openedProfile : !state.openedProfile
            }
        case ExtensibilityActionTypes.OPEN_SETTINGS:
            return {
                ...state,
                rightSidebarId : { type : ExtensibilityRightSidebarId.SETTINGS },
                openedNavbar : state.openedNavbar && state.canBeOpenedTogether ?
                    false : state.openedNavbar
            }
        case ExtensibilityActionTypes.OPEN_TASK_DETAILS:
            return {
                ...state,
                rightSidebarId : {
                    type : ExtensibilityRightSidebarId.TASK_DETAILS,
                    taskId : action.payload._id
                },
                openedNavbar : state.openedNavbar && !state.canBeOpenedTogether ?
                    false : state.openedNavbar
            }
        case ExtensibilityActionTypes.TOGGLE_IS_ON_FULL_SCREEN:
            return {
                ...state,
                isOnFullScreen : !state.isOnFullScreen
            }
        case ExtensibilityActionTypes.TOGGLE_CAN_BE_OPENED_TOGETHER:
            return {
                ...state,
                canBeOpenedTogether : !state.canBeOpenedTogether,
                openedNavbar: state.openedNavbar && state.rightSidebarId && !state.canBeOpenedTogether ?
                    false : state.openedNavbar
            }
        default:
            return state
    }
}