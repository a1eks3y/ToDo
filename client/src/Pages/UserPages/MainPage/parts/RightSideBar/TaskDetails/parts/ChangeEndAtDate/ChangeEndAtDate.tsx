import * as React from 'react'
import s from './ChangeEndAtDate.module.css'
import { getDayOfWeek, monthNumberToName } from '../../../../../../../../store/actionsCreator/syncDateActionCreator'
import { useTypedSelector } from '../../../../../../../../hooks/useTypedSelector'
import { ChooseDateContextMenu, chooseDateType } from '../../../../../../../../types/contextMenu'
import {
    chooseDateContextMenuActionCreator
} from '../../../../../../../../store/actionsCreator/contextMenuActionCreator'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { TodoUserDataActionI } from '../../../../../../../../types/todoUserData'
import { useEffect, useRef, useState } from 'react'
import { changeTaskDataActionCreator } from '../../../../../../../../store/actionsCreator/todoUserDataActionCreator'

interface Props {
    _id: string,
    endAt?: [number, number, number]
}

const ChangeEndAtDate: React.FC<Props> = ( { _id, endAt } ) => {
    const dispatch = useDispatch<Dispatch<ChooseDateContextMenu | TodoUserDataActionI>>()
    const fullTime = useTypedSelector(state => state.syncDate.time)
    const [chosenDate, setChosenDate] = useState<chooseDateType | undefined>(endAt ? {
        day : endAt[ 2 ],
        month : endAt[ 1 ],
        year : endAt[ 0 ]
    } : undefined)
    const dataRef = useRef({
        endAt,
        _id,
        dispatch
    })
    dataRef.current = {
        endAt,
        _id,
        dispatch
    }
    useEffect(() => {
        const { endAt, _id, dispatch } = dataRef.current
        if ( typeof chosenDate !== typeof endAt ||
            (chosenDate !== undefined && endAt !== undefined &&
                +new Date(chosenDate.year, chosenDate.month, chosenDate.day)
                !==
                +new Date(endAt[ 0 ], endAt[ 1 ] - 1, endAt[ 2 ])
            ) ) {
            dispatch(changeTaskDataActionCreator({
                _id,
                endAt : chosenDate ? [chosenDate.year, chosenDate.month, chosenDate.day] : null
            }))
        }
    }, [chosenDate])
    if ( !fullTime )
        return null
    const { clientCurDate, ...time } = fullTime
    const nowDate = new Date(+new Date() - +clientCurDate + +new Date(
        time.year, time.month - 1, time.date,
        time.hours, time.minutes, time.seconds
    ))
    return (
        <div className={ s.wrapper + ' ' + (endAt ?
                +new Date(endAt[ 0 ], endAt[ 1 ] - 1, endAt[ 2 ]) - +nowDate >= -24 * 60 * 60 * 1000
                    ?
                    s.deadline
                    :
                    s.overdue
                :
                ''
        ) }
             onMouseDown={ e => {
                 const target = e.currentTarget.getBoundingClientRect()
                 dispatch(chooseDateContextMenuActionCreator({
                     fullDate : chosenDate,
                     setDate : setChosenDate,
                     offsetHeight : target.top,
                     offsetWidth : target.left,
                     width : target.width,
                     height : target.height
                 }))
             } }
        >
            <i className={ s.icon }/>
            { endAt !== undefined ? (() => {
                const endAtDate = new Date(endAt[ 0 ], endAt[ 1 ] - 1, endAt[ 2 ])
                return +endAtDate - +nowDate >= -24 * 60 * 60 * 1000 ?
                    <span className={ s.deadline + ' ' + s.text }>
                        {
                            (
                                (endAtDate.getDate() - time.date === 1
                                    || endAtDate.getDate() - time.date === 0) &&
                                time.month === endAtDate.getMonth() + 1 &&
                                time.year === endAtDate.getFullYear() &&
                                (
                                    endAtDate.getDate() - time.date === 1 ?
                                        'Tomorrow'
                                        :
                                        'Today'
                                )
                            )
                            ||
                            (
                                'Deadline: '

                                + getDayOfWeek(
                                    endAtDate.getDate(), endAtDate.getMonth() + 1,
                                    endAtDate.getFullYear()
                                ).str.substr(0, 3)
                                + ', ' + endAtDate.getDate()
                                + ' ' + monthNumberToName[ endAtDate.getMonth() ]
                                + (endAtDate.getFullYear() !== time.year ?
                                    (' ' + endAtDate.getFullYear()) : '')
                            )
                        }
                    </span>
                    :
                    <span className={ s.text + ' ' + s.overdue }>
                        {
                            (
                                'Expired, ' + getDayOfWeek(
                                    endAtDate.getDate(), endAtDate.getMonth() + 1,
                                    endAtDate.getFullYear()
                                ).str?.substr(0, 3)
                                + ', ' + endAtDate.getDate()
                                + ' ' + monthNumberToName[ endAtDate.getMonth() ]
                                + (endAtDate.getFullYear() !== time.year ?
                                    (' ' + endAtDate.getFullYear()) : '')
                            )
                        }
                    </span>
            })() : <span className={ s.text }>Add deadline</span> }
        </div>
    )
}

export default ChangeEndAtDate