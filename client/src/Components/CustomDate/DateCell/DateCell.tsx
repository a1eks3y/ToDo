import * as React from 'react'
import s from './DateCell.module.css'

interface Props {
    isCurrentMonth: boolean,
    date: number,
    month: number,
    year: number,
    isToday: boolean,
    isChosen: boolean,
    setChosenFullDate: ( d: number, m: number, y: number ) => void
}

const DateCell: React.FC<Props> = ( {
    isCurrentMonth, date, month, year, isChosen, setChosenFullDate, isToday
} ) => {

    return (
        <div className={
            `${ s.cell } ${ isCurrentMonth ? s.current_month : s.another_month } ${ isChosen ? s.chosen : '' }
            ${ isToday ? s.today : '' }
            ` }
             onClick={ () => {
                 setChosenFullDate(date, month, year)
             } }
        >
            { date }
        </div>
    )
}

export default DateCell