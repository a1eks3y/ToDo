import * as React from 'react'
import { useTypedSelector } from '../../../../../../hooks/useTypedSelector'
import NativeList, { listColor } from '../NativeList/NativeList'
import { monthNumberToName } from '../../../../../../store/actionsCreator/syncDateActionCreator'

const All: React.FC = () => {
    const lists = useTypedSelector(state => state.todoUserData.lists)
    const listsObj: { [ i: string ]: number } = {}
    for ( let i = 0 ; i < lists.length ; i++ ) {
        const list = lists[ i ]
        listsObj[ list.name ] = i + 1
    }
    let tasks = useTypedSelector(state => state.todoUserData.tasks)
        .filter(el => el.position !== null)
        .sort(( a, b ) => {
            return a.forList === b.forList ?
                a.position! - b.position!
                :
                !a.forList ? -1 : !b.forList ? 1 :
                    listsObj[ a.forList ] - listsObj[ b.forList ]
        })
    const { time } = useTypedSelector(state => state.syncDate)
    if ( !time )
        return null
    const { dayOfWeek, date, month } = time
    return <NativeList name={ 'All' } tasks={ tasks } list={ undefined } color={ listColor.RED }
                       time={ { date, dayOfWeek : dayOfWeek.str, month : monthNumberToName[ month - 1 ] } }/>
}

export default All