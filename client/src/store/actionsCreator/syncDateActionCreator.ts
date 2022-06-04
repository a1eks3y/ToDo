import {
    addErrorSyncDateAction,
    allDaysOfWeek,
    clearSyncDateAction,
    SyncDateActionTypes,
    updateTimeSyncDateAction
} from '../../types/syncDate'

const monthCodes: { [ i: number ]: number } = {
    1 : 1,
    2 : 4,
    3 : 4,
    4 : 0,
    5 : 2,
    6 : 5,
    7 : 0,
    8 : 3,
    9 : 6,
    10 : 1,
    11 : 4,
    12 : 6
}
export const monthNumberToName: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December']
const getYearCode = ( year: number ): number => ((6 + Math.floor((year - 2000) / 4) + year - 2000) % 7)

const dayOfWeekCodes: {
    [ i: number ]: allDaysOfWeek.Monday | allDaysOfWeek.Tuesday | allDaysOfWeek.Wednesday
        | allDaysOfWeek.Thursday | allDaysOfWeek.Friday | allDaysOfWeek.Saturday | allDaysOfWeek.Sunday
} = {
    2 : allDaysOfWeek.Monday, //0
    3 : allDaysOfWeek.Tuesday, //1
    4 : allDaysOfWeek.Wednesday, //2
    5 : allDaysOfWeek.Thursday, //3
    6 : allDaysOfWeek.Friday, //4
    0 : allDaysOfWeek.Saturday, //5
    1 : allDaysOfWeek.Sunday //6
}

export const getDayOfWeek = ( d: number, m: number, y: number ) => {
    const res = +(y % 4 === 0) + (d + monthCodes[ m ] + getYearCode(y)) % 7
    return {
        num : res < 2 ? res + 5 : res - 2,
        str : dayOfWeekCodes[ res ]
    }
}

export const getMaxDayInMonth = ( m: number, y: number ) => {
    if ( m !== 2 ) {
        return m % 2 === 0 ? 30 : 30
    }
    return y % 4 === 0 ? 29 : 28
}

export const updateSyncTimeActionCreator = ( { date, month, year, minutes, seconds, hours, clientCurDate }: {
    year: number, month: number, date: number, hours: number, minutes: number, seconds: number, clientCurDate: Date
} ) => ({
    type : SyncDateActionTypes.UPDATE_TIME,
    payload : {
        clientCurDate,
        year,
        month,
        date,
        hours,
        minutes,
        seconds,
        dayOfWeek : { ...getDayOfWeek(date, month, year) }
    }
}) as updateTimeSyncDateAction

export const addErrorSyncDateActionCreator = (): addErrorSyncDateAction => ({
    type : SyncDateActionTypes.ADD_ERROR
})

export const clearSyncDateActionCreator = (): clearSyncDateAction => ({
    type : SyncDateActionTypes.CLEAR
})