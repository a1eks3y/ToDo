import * as React from 'react'
import { useTypedSelector } from '../../../../../../hooks/useTypedSelector'
import NativeList, { listColor } from '../NativeList/NativeList'
import { monthNumberToName } from '../../../../../../store/actionsCreator/syncDateActionCreator'

interface Props {
    _id: string,
    name: string
}

const CustomList: React.FC<Props> = ( { _id, name } ) => {
    const tasks = useTypedSelector(state => state.todoUserData.tasks)
        .filter(el => el.forList === _id)
        .sort(( a, b ) =>
            a.position === null ? b.position === null ?
                    +new Date(a.completedAt![ 0 ], a.completedAt![ 1 ], a.completedAt![ 2 ],
                        a.completedAt![ 3 ],
                        a.completedAt![ 4 ], a.completedAt![ 5 ])
                    -
                    +new Date(b.completedAt![ 0 ], b.completedAt![ 1 ], b.completedAt![ 2 ],
                        b.completedAt![ 3 ],
                        b.completedAt![ 4 ], b.completedAt![ 5 ])
                    : 1
                : b.position === null ? -1 : a.position - b.position
        )
    const { time } = useTypedSelector(state => state.syncDate)
    if ( !time )
        return null
    const { dayOfWeek, date, month } = time
    return <NativeList name={ name } tasks={ tasks } list={ _id } color={ listColor.BLUE }
                       time={ { date, dayOfWeek : dayOfWeek.str, month : monthNumberToName[ month - 1 ] } }/>
}

export default CustomList