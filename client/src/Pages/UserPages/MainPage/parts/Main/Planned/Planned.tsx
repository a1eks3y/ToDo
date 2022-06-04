import * as React from 'react'
import { useTypedSelector } from '../../../../../../hooks/useTypedSelector'
import NativeList, { listColor } from '../NativeList/NativeList'
import { monthNumberToName } from '../../../../../../store/actionsCreator/syncDateActionCreator'

const Planned: React.FC = () => {
    const tasks = useTypedSelector(state => state.todoUserData.tasks)
        .filter(el => el.endAt && !el.completedAt)
        .sort(( a, b ) => {
            if(!a.endAt || !b.endAt)
                return Number()
            const aEndAtTimestamp = +new Date(a.endAt[ 0 ], a.endAt[ 1 ], a.endAt[ 2 ])
            const bEndAtTimestamp = +new Date(b.endAt[ 0 ], b.endAt[ 1 ], b.endAt[ 2 ])
            return (
                aEndAtTimestamp - bEndAtTimestamp === 0 ?
                    +new Date(b.createdAt[ 0 ], b.createdAt[ 1 ], b.createdAt[ 2 ],
                        b.createdAt[ 3 ], b.createdAt[ 4 ], b.createdAt[ 5 ])
                    -
                    +new Date(a.createdAt[ 0 ], a.createdAt[ 1 ], a.createdAt[ 2 ],
                        a.createdAt[ 3 ], a.createdAt[ 4 ], a.createdAt[ 5 ])
                    :
                    aEndAtTimestamp - bEndAtTimestamp
            )
        })
    const { time } = useTypedSelector(state => state.syncDate)
    if ( !time )
        return null
    const { dayOfWeek, date, month } = time
    return <NativeList name={ 'Planned' } tasks={ tasks } list={ undefined } color={ listColor.BLUE }
                       time={ { date, dayOfWeek : dayOfWeek.str, month : monthNumberToName[ month - 1 ] } }/>
}

export default Planned