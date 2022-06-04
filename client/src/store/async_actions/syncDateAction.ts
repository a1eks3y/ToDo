import { Dispatch } from 'redux'
import { syncDateActionI } from '../../types/syncDate'
import axios from 'axios'
import { addErrorSyncDateActionCreator, updateSyncTimeActionCreator } from '../actionsCreator/syncDateActionCreator'

interface SyncDateActionPayloadI {
    userTimezone: number
    numberOfErrors: number
}

export const SyncDateAction = ( { userTimezone, numberOfErrors }: SyncDateActionPayloadI ) => {
    return async ( dispatch: Dispatch<syncDateActionI> ) => {
        try {
            if ( !userTimezone )
                return
            const res = await axios.get('https://worldtimeapi.org/api/timezone/Etc/GMT')
            const time = res.data.datetime.split(/\./)[ 0 ]
            const date = new Date(+new Date(time) + userTimezone * 1000 * 3600)
            dispatch(updateSyncTimeActionCreator({
                clientCurDate: new Date(),
                year : date.getFullYear(),
                month : date.getMonth() + 1,
                date : date.getDate(),
                hours : date.getHours(),
                minutes : date.getMinutes(),
                seconds : date.getSeconds()
            }))
        } catch (e) {
            dispatch(addErrorSyncDateActionCreator())
            if ( numberOfErrors >= 3 )
                window.location.reload()
        }
    }
}