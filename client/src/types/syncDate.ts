interface timeStateI {
    clientCurDate: Date,
    year: number,
    month: number,
    date: number,
    hours: number,
    minutes: number,
    seconds: number,
    dayOfWeek: {
        num: 2
        str: allDaysOfWeek.Monday
    } | {
        num: 3,
        str: allDaysOfWeek.Tuesday
    } | {
        num: 4,
        str: allDaysOfWeek.Wednesday
    } | {
        num: 5,
        str: allDaysOfWeek.Thursday
    } | {
        num: 6,
        str: allDaysOfWeek.Friday
    } | {
        num: 0,
        str: allDaysOfWeek.Saturday
    } | {
        num: 1,
        str: allDaysOfWeek.Sunday
    }
}
export type syncDateStateI = {
    time: timeStateI | null,
    errors: number
}

export enum allDaysOfWeek {
    Monday = 'Monday',
    Tuesday = 'Tuesday',
    Wednesday = 'Wednesday',
    Thursday = 'Thursday',
    Friday = 'Friday',
    Saturday = 'Saturday',
    Sunday = 'Sunday'
}

export enum SyncDateActionTypes {
    UPDATE_TIME = '@syncDate/UPDATE_TIME',
    CLEAR = '@syncDate/CLEAR',
    ADD_ERROR = '@syncDate/ADD_ERROR'
}

export interface addErrorSyncDateAction {
    type: SyncDateActionTypes.ADD_ERROR
}

export interface updateTimeSyncDateAction {
    type: SyncDateActionTypes.UPDATE_TIME
    payload: timeStateI
}

export interface clearSyncDateAction {
    type: SyncDateActionTypes.CLEAR
}

export type syncDateActionI = clearSyncDateAction | updateTimeSyncDateAction | addErrorSyncDateAction