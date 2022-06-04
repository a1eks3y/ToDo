import * as React from 'react'
import { useTypedSelector } from '../../../../../../hooks/useTypedSelector'
import NativeList, { listColor } from '../NativeList/NativeList'
import { monthNumberToName } from '../../../../../../store/actionsCreator/syncDateActionCreator'

const Favourites: React.FC = () => {
    const tasks = useTypedSelector(state => state.todoUserData.tasks)
        .filter(el => el.favourites !== undefined)
        .sort(( a, b ) =>
            a.completedAt ? b.completedAt ?
                    +new Date(b.completedAt[ 0 ], b.completedAt[ 1 ], b.completedAt[ 2 ],
                        b.completedAt[ 3 ],
                        b.completedAt[ 4 ], b.completedAt[ 5 ])
                    -
                    +new Date(a.completedAt[ 0 ], a.completedAt[ 1 ], a.completedAt[ 2 ],
                        a.completedAt[ 3 ],
                        a.completedAt[ 4 ], a.completedAt[ 5 ])
                    : 1
                : b.completedAt === null ? -1 : a.favourites! - b.favourites!)
    const { time } = useTypedSelector(state => state.syncDate)
    if ( !time )
        return null
    const { dayOfWeek, date, month } = time
    return <NativeList name={ 'Favourites' } tasks={ tasks } list={ undefined } color={ listColor.BLUE }
                       time={ { date, dayOfWeek : dayOfWeek.str, month : monthNumberToName[ month - 1 ] } }/>
}

export default Favourites