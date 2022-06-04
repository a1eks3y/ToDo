import * as React from 'react'
import { useTypedSelector } from '../../../../../../hooks/useTypedSelector'
import NativeList, { listColor } from '../NativeList/NativeList'
import { monthNumberToName } from '../../../../../../store/actionsCreator/syncDateActionCreator'

const Completed: React.FC = () => {
    const tasks = useTypedSelector(state => state.todoUserData.tasks)
        .filter(el => el.completedAt)
        .sort(( a, b ) => {
            if ( !a.completedAt || !b.completedAt )
                return Number()
            const aDate = new Date(a.completedAt[ 0 ], a.completedAt[ 1 ], a.completedAt[ 2 ],
                a.completedAt[ 3 ], a.completedAt[ 4 ], a.completedAt[ 5 ])
            const bDate = new Date(a.completedAt[ 0 ], a.completedAt[ 1 ], a.completedAt[ 2 ],
                a.completedAt[ 3 ], a.completedAt[ 4 ], a.completedAt[ 5 ])
            return +aDate - +bDate
        })
    const { time } = useTypedSelector(state => state.syncDate)
    if ( !time )
        return null
    const { dayOfWeek, date, month } = time
    return <NativeList name={ 'Completed' } tasks={ tasks } list={ undefined } color={ listColor.RED }
                       time={ { date, dayOfWeek : dayOfWeek.str, month : monthNumberToName[ month - 1 ] } }/>
}

export default Completed