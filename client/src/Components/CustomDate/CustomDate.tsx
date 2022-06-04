import * as React from 'react'
import s from './CustomDate.module.css'
import { chooseDateType, ClearContextMenu } from '../../types/contextMenu'
import { CSSProperties, Dispatch, SetStateAction, useCallback, useState } from 'react'
import { getDayOfWeek, getMaxDayInMonth, monthNumberToName } from '../../store/actionsCreator/syncDateActionCreator'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import DateCell from './DateCell/DateCell'
import { useDispatch } from 'react-redux'
import { clearContextMenuActionCreator } from '../../store/actionsCreator/contextMenuActionCreator'

interface Props {
    offsetWidth: number,
    offsetHeight: number,
    width: number,
    setFullDate: Dispatch<SetStateAction<chooseDateType | undefined>>,
    initialDate?: chooseDateType,
    setChooseDatePos: Dispatch<React.SetStateAction<false | { offsetTop: number, offsetLeft: number, width: number }>>
}

const CustomDate: React.FC<Props> = (
    {
        setFullDate, offsetWidth, offsetHeight, width, initialDate
    }
) => {
    const dispatch = useDispatch<Dispatch<ClearContextMenu>>()
    const todayDate = useTypedSelector(state => state.syncDate.time)
    const [year, setYear] = useState<number | undefined>(initialDate?.year ?? todayDate?.year)
    const [month, setMonth] = useState<number | undefined>(initialDate?.month ?? todayDate?.month)
    const [chosenYear, setChosenYear] = useState<number | undefined>(initialDate?.year ?? todayDate?.year)
    const [chosenMonth, setChosenMonth] = useState<number | undefined>(initialDate?.month ?? todayDate?.month)
    const [chosenDate, setChosenDate] = useState<number | undefined>(initialDate?.day ?? todayDate?.date)
    const setChosenFullDate = useCallback<( d: number, m: number, y: number ) => void>(
        ( d, m, y ) => {
            setChosenDate(d)
            setChosenMonth(m)
            setChosenYear(y)
        }, [])
    if ( !todayDate || !year || !month || !chosenYear || !chosenMonth || !chosenDate )
        return null
    const firstDayOfWeek = getDayOfWeek(1, month, year).num
    const maxDayOfThisMonth = getMaxDayInMonth(month, year)
    const maxDayOfPrevMonth = getMaxDayInMonth(month, year)
    const lastDayOfWeek = getDayOfWeek(maxDayOfThisMonth, month, year).num
    const style: CSSProperties = {
        top : offsetHeight + 'px',
        left : (offsetWidth + width + 221 > window.innerWidth ?
            offsetWidth - 221 > window.innerWidth ?
                10 : offsetWidth - 221 : offsetWidth + width + 221) + 'px'
    }
    return (
        <div style={ style } className={ s.wrapper }
             onMouseDown={ e => e.stopPropagation() }
        >
            <div className={ s.custom_date }>
                <div className={ s.title }>
                    Choose date
                </div>
                <div className={ s.custom_date_body_wrapper }>
                    <div className={ s.custom_date_body }>
                        <div className={ s.change_month }>
                            <div className={ s.date }>
                                { `${ monthNumberToName[ month - 1 ] } ${ year }` }
                            </div>
                            <div className={ s.icon_wrapper }
                                 onClick={ () => setMonth(prev => {
                                     if ( !prev )
                                         return
                                     if ( prev !== 1 )
                                         return --prev
                                     setYear(y => y ? --y : y)
                                     return 12
                                 }) }
                            >
                                <i className={ s.icon + ' ' + s.arrow_up }/>
                            </div>
                            <div className={ s.icon_wrapper }
                                 onClick={ () => setMonth(prev => {
                                     if ( !prev )
                                         return
                                     if ( prev !== 12 )
                                         return ++prev
                                     setYear(y => y ? ++y : y)
                                     return 1
                                 }) }
                            >
                                <i className={ s.icon + ' ' + s.arrow_down }/>
                            </div>
                        </div>
                        <div className={ s.dayOfWeek }>
                            Mon
                        </div>
                        <div className={ s.dayOfWeek }>
                            Tue
                        </div>
                        <div className={ s.dayOfWeek }>
                            Wed
                        </div>
                        <div className={ s.dayOfWeek }>
                            Thu
                        </div>
                        <div className={ s.dayOfWeek }>
                            Fri
                        </div>
                        <div className={ s.dayOfWeek }>
                            Sat
                        </div>
                        <div className={ s.dayOfWeek }>
                            Sun
                        </div>
                        {
                            [...Array(firstDayOfWeek)].map(( _, inx ) =>
                                <DateCell
                                    year={ (month === 1 ? year - 1 : year) }
                                    month={ (month === 1 ? 12 : month - 1) }
                                    date={ maxDayOfPrevMonth - firstDayOfWeek + inx + 1 }
                                    isCurrentMonth={ false }
                                    key={ (month === 1 ? 12 : month - 1) + '' + inx }
                                    isToday={
                                        todayDate && todayDate.date === maxDayOfPrevMonth - firstDayOfWeek + inx + 1
                                        && todayDate.month === (month === 1 ? 12 : month - 1)
                                        && todayDate.year === (month === 1 ? year - 1 : year)
                                    }
                                    isChosen={
                                        chosenDate === maxDayOfPrevMonth - firstDayOfWeek + inx + 1
                                        && chosenMonth === (month === 1 ? 12 : month - 1)
                                        && chosenYear === (month === 1 ? year - 1 : year)
                                    }
                                    setChosenFullDate={ setChosenFullDate }
                                />
                            )
                        }
                        {
                            [...Array(maxDayOfThisMonth)].map(( _, inx ) =>
                                <DateCell
                                    year={ year }
                                    month={ month }
                                    date={ inx + 1 }
                                    isCurrentMonth={ true }
                                    key={ month + '' + inx }
                                    isToday={
                                        todayDate && todayDate.date === inx + 1
                                        && todayDate.month === month
                                        && todayDate.year === year
                                    }
                                    isChosen={
                                        chosenDate === inx + 1
                                        && chosenMonth === month
                                        && chosenYear === year
                                    }
                                    setChosenFullDate={ setChosenFullDate }
                                />
                            )
                        }
                        {
                            [...Array(6 - lastDayOfWeek)].map(( _, inx ) =>
                                <DateCell
                                    year={ (month === 12 ? year + 1 : year) }
                                    month={ (month === 12 ? 1 : month + 1) }
                                    date={ inx + 1 }
                                    isCurrentMonth={ false }
                                    key={ (month === 11 ? 0 : month + 1) + '' + inx }
                                    isToday={
                                        todayDate && todayDate.date === inx + 1
                                        && todayDate.month === (month === 12 ? 1 : month + 1)
                                        && todayDate.year === (month === 1 ? year - 1 : year)
                                    }
                                    isChosen={
                                        chosenDate === inx + 1
                                        && chosenMonth === (month === 12 ? 1 : month + 1)
                                        && chosenYear === (month === 12 ? year + 1 : year)
                                    }
                                    setChosenFullDate={ setChosenFullDate }
                                />
                            )
                        }
                    </div>
                </div>
                <div className={ s.save_btn_wrapper }>
                    <button className={ s.save_btn } onClick={ () => {
                        setFullDate({
                            year : chosenYear,
                            month : chosenMonth,
                            day : chosenDate
                        })
                        dispatch(clearContextMenuActionCreator())
                    } }>
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CustomDate