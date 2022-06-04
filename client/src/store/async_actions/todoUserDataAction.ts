import { Dispatch } from 'react'
import {
    actionIncomingChangesType, changeData,
    clearIncomingChanges,
    changePosT, itemForAdd, itemForDelete, itemForMove, itemForComplete
} from '../../types/todoUserData'
import axios from 'axios'
import { addMessageActionCreator, willBeDeletedMessageActionCreator } from '../actionsCreator/messageActionCreator'
import { MessageAction } from '../../types/Message'
import { clearIncomingChangesActionCreator } from '../actionsCreator/todoUserDataActionCreator'

async function switchActionType(
    acc: itemForMove[] | itemForDelete[] | itemForAdd[] | itemForComplete[],
    actionType: string
) {
    const jwt = localStorage.getItem('jwt')
    switch ( actionType ) {
        case actionIncomingChangesType.DELETE: {
            await axios.post('api/for_authorized_users/delete',
                { data : acc.map(( { actionType, ...data } ) => data) }, {
                    headers : {
                        Authorization : `Bearer ${ jwt }`
                    }
                })
            break
        }
        case actionIncomingChangesType.MOVE: {
            await axios.post('api/for_authorized_users/change_position', {
                data : acc.map(( { actionType, ...data } ) => data)
            }, {
                headers : {
                    Authorization : `Bearer ${ jwt }`
                }
            })
            break
        }
        case actionIncomingChangesType.ADD: {
            await axios.post('api/for_authorized_users/create', {
                data : acc.map(( { actionType, ...data } ) => data)
            }, {
                headers : {
                    Authorization : `Bearer ${ jwt }`
                }
            })
            break
        }
        case actionIncomingChangesType.COMPLETE: {
            console.log(acc)
            acc = acc as unknown as itemForComplete[]
            await axios.post('api/for_authorized_users/complete', {
                data : acc.map(( { actionType, ...data } ) => ({
                    ...data
                }))
            }, {
                headers : {
                    Authorization : `Bearer ${ jwt }`
                }
            })
            break
        }
    }
}

export const updateServerDataCb = (
    { change_pos_items, change_data_items }: { change_pos_items?: changePosT, change_data_items?: changeData[] }
) => {
    return async ( dispatch: Dispatch<MessageAction | clearIncomingChanges> ) => {
        const jwt = localStorage.getItem('jwt')
        let id = new Date().getTime()
        try {
            if ( change_data_items?.length )
                await axios.post('api/for_authorized_users/change_data', { data : change_data_items }, {
                    headers : {
                        Authorization : `Bearer ${ jwt }`
                    }
                })
            let acc: itemForMove[] | itemForDelete[] | itemForAdd[] | itemForComplete[] = []
            if ( change_pos_items?.length )
                for ( let el of change_pos_items ) {
                    if ( !acc.length ) {
                        acc = [el] as itemForMove[] | itemForDelete[] | itemForAdd[]
                        continue
                    }
                    if ( acc[ acc.length - 1 ].actionType === el.actionType ) {
                        acc = [...acc, el] as itemForMove[] | itemForDelete[] | itemForAdd[] | itemForComplete[]
                        if ( change_pos_items[ change_pos_items.length - 1 ] === el ) {
                            await switchActionType(acc, acc[ acc.length - 1 ].actionType)
                            acc = []
                        }
                    } else {
                        await switchActionType(acc, acc[ acc.length - 1 ].actionType)
                        acc = [el] as itemForMove[] | itemForDelete[] | itemForAdd[]
                    }
                }
            if ( acc[ 0 ] ) {
                await switchActionType(acc, acc[ 0 ].actionType)
            }
            dispatch(clearIncomingChangesActionCreator())
        } catch (e) {
            dispatch(clearIncomingChangesActionCreator())
            dispatch(addMessageActionCreator(
                id, 'Something went wrong. Reloading page in 6s...', true
            ))
            setTimeout(() => {
                dispatch(willBeDeletedMessageActionCreator(id))
                window.location.reload()
            }, 6000)
        }
    }
}