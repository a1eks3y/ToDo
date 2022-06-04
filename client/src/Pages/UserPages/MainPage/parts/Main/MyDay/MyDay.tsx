import * as React from 'react'
import NativeList, { listColor } from '../NativeList/NativeList'
import { useTypedSelector } from '../../../../../../hooks/useTypedSelector'
import { monthNumberToName } from '../../../../../../store/actionsCreator/syncDateActionCreator'

const MyDay: React.FC = () => {
    const tasks = useTypedSelector(state => state.todoUserData.tasks)
        .filter(el => el.myDay !== undefined)
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
                : b.completedAt === null ? -1 : a.myDay! - b.myDay!)
    const { time } = useTypedSelector(state => state.syncDate)
    if ( !time )
        return null
    const { dayOfWeek, date, month } = time
    return <NativeList name={ 'My day' } tasks={ tasks } list={ undefined } color={ listColor.BLACK }
                       time={ { date, dayOfWeek : dayOfWeek.str, month : monthNumberToName[ month - 1 ] } }/>
}

export default MyDay