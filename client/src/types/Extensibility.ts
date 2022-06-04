export type ExtensibilityStateI = {
    openedNavbar: boolean,
    isOnFullScreen: boolean,
    openedProfile: boolean,
    canBeOpenedTogether: boolean,
    rightSidebarId: null | {
        type: ExtensibilityRightSidebarId.SETTINGS
    } | {
        type: ExtensibilityRightSidebarId.TASK_DETAILS,
        taskId: string
    }
}

export enum ExtensibilityRightSidebarId {
    SETTINGS = 'SETTINGS',
    TASK_DETAILS = 'TASK_DETAILS'
}

interface toggleNavbar {
    type: ExtensibilityActionTypes.TOGGLE_NAVBAR
}

interface closeRightSidebar {
    type: ExtensibilityActionTypes.CLOSE_RIGHT_SIDEBAR
}

interface openSettings {
    type: ExtensibilityActionTypes.OPEN_SETTINGS
}

interface toggleProfile {
    type: ExtensibilityActionTypes.TOGGLE_PROFILE
}

interface openStep {
    type: ExtensibilityActionTypes.OPEN_TASK_DETAILS
    payload: {
        _id: string
    }
}

interface toggleIsOnFullScreen {
    type: ExtensibilityActionTypes.TOGGLE_IS_ON_FULL_SCREEN
}

interface toggleCanBeOpenedTogether {
    type: ExtensibilityActionTypes.TOGGLE_CAN_BE_OPENED_TOGETHER
}

export enum ExtensibilityActionTypes {
    TOGGLE_NAVBAR = '@extensibility/TOGGLE_NAVBAR',
    CLOSE_RIGHT_SIDEBAR = '@extensibility/CLOSE_RIGHT_SIDEBAR',
    OPEN_SETTINGS = '@extensibility/OPEN_SETTINGS',
    TOGGLE_PROFILE = '@extensibility/TOGGLE_PROFILE',
    OPEN_TASK_DETAILS = '@extensibility/OPEN_TASK_DETAILS',
    TOGGLE_IS_ON_FULL_SCREEN = '@extensibility/TOGGLE_IS_ON_FULL_SCREEN',
    TOGGLE_CAN_BE_OPENED_TOGETHER = '@extensibility/TOGGLE_CAN_BE_OPENED_TOGETHER'
}

export type ExtensibilityActionI = toggleNavbar | closeRightSidebar | openSettings | toggleProfile |
    openStep | toggleIsOnFullScreen | toggleCanBeOpenedTogether