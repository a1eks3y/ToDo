import * as React from 'react'
import s from './ChooseDate.module.css'
import { Dispatch, SetStateAction, useState } from 'react'
import { chooseDateType, contextMenuActionI } from '../../../../../../types/contextMenu'
import { getDayOfWeek } from '../../../../../../store/actionsCreator/syncDateActionCreator'
import { useTypedSelector } from '../../../../../../hooks/useTypedSelector'
import { useDispatch } from 'react-redux'
import { clearContextMenuActionCreator } from '../../../../../../store/actionsCreator/contextMenuActionCreator'
import CustomDate from '../../../../../../Components/CustomDate/CustomDate'
import { useHideWhenMouseOnAnotherElement } from '../../../../../../hooks/useHideWhenMouseOnAnotherElement'

interface Props {
    offsetWidth: number,
    offsetHeight: number,
    width: number,
    height: number,
    setDate: Dispatch<SetStateAction<chooseDateType | undefined>>,
    initialDate?: chooseDateType
}

interface chooseDatePosI {
    offsetTop: number,
    offsetLeft: number,
    width: number
}

const ChooseDate: React.FC<Props> = (
    { setDate, offsetWidth, offsetHeight, width, height, initialDate }
) => {
    const dispatch = useDispatch<Dispatch<contextMenuActionI>>()
    const time = useTypedSelector(state => state.syncDate.time)
    const [chooseDatePos, setChooseDatePos] = useState<chooseDatePosI | false>(false)
    const { onMouseLeave, onMouseEnter } = useHideWhenMouseOnAnotherElement(
        chooseDatePos, setChooseDatePos
    )
    if ( !time )
        return null
    const top = (offsetHeight + height > window.innerHeight ?
        offsetHeight - height < 0 ?
            10
            :
            offsetHeight - height
        :
        offsetHeight + height)
    const left = (offsetWidth + width / 2 - 109 < 8 ? 8 : offsetWidth + width / 2 - 109)
    const style = {
        top : top + 'px',
        left : left + 'px'
    }
    const tomorrowDate = new Date(
        +new Date(`${ time.month }, ${ time.date }, ${ time.year }`) + 24 * 3600 * 1000
    )
    const nextWeekDate = new Date(
        +new Date(`${ time.month }, ${ time.date }, ${ time.year }`)
        +
        (7 - time.dayOfWeek.num) * 24 * 3600 * 1000
    )
    const openChooseDate = ( e: React.MouseEvent<HTMLLIElement, MouseEvent> ) => {
        if ( !chooseDatePos )
            setChooseDatePos({
                offsetTop : e.currentTarget.offsetTop,
                offsetLeft : e.currentTarget.offsetLeft,
                width : e.currentTarget.offsetWidth
            })
    }
    return (
        <>
            <div style={ style }
                 className={ s.choose_date }
                 onMouseDown={ e => e.stopPropagation() }
            >
                <div className={ s.deadline }>Deadline</div>
                <ul className={ s.items_wrapper }>
                    <li className={ s.wrapper_item } onMouseDown={ () => {
                        setDate({
                            year : time.year,
                            month : time.month,
                            day : time.date
                        })
                        dispatch(clearContextMenuActionCreator())
                    } } onMouseEnter={ onMouseEnter } onMouseLeave={ onMouseLeave }>
                        <div className={ s.menu_item }>
                            <i className={ s.icon }>
                                <svg width="24" height="24" viewBox="0 0 24 24">
                                    <g fillRule="evenodd">
                                        <path d="M15.9997 4.9997h1v1h3.001v14H3.9997v-14h3v-1h1v1h8v-1zm-11 14h14v-9h-14v9zm
                                    12-10.999h-1V7l-8 .0007v1h-1V7h-2v2.0007h14.001V7h-2.001v1.0007z"/>
                                        <path d="M11 15h2v-2h-2v2zm-1 1h4v-4h-4v4z"/>
                                    </g>
                                </svg>
                            </i>
                            <div>Today</div>
                            <div className={ s.secondary_text }>
                                {
                                    time.dayOfWeek.str.substr(0, 3)
                                }
                            </div>
                        </div>
                    </li>
                    <li className={ s.wrapper_item } onMouseDown={ () => {
                        setDate({
                            year : tomorrowDate.getFullYear(),
                            month : tomorrowDate.getMonth() + 1,
                            day : tomorrowDate.getDate()
                        })
                        dispatch(clearContextMenuActionCreator())
                    } } onMouseEnter={ onMouseEnter } onMouseLeave={ onMouseLeave }>
                        <div className={ s.menu_item }>
                            <i className={ s.icon }>
                                <svg width="24" height="24" viewBox="0 0 24 24">
                                    <g fillRule="evenodd">
                                        <path d="M15.9997 4.9997h1v1h3.001v14H3.9997v-14h3v-1h1v1h8v-1zm-11 14h14v-9h-14v9zm
                                    12-10.999h-1l.0003-1H7.9997v1h-1v-1h-2v2h14.001v-2h-2.001v1z"/>
                                        <path d="M11.6465 16.6465l.707.707 2.854-2.853-2.854-2.854-.707.707 1.646 1.647h
                                    -4.292v1h4.292z"/>
                                    </g>
                                </svg>
                            </i>
                            <div>Tomorrow</div>
                            <div className={ s.secondary_text }>
                                {
                                    getDayOfWeek(
                                        tomorrowDate.getDate(),
                                        tomorrowDate.getMonth() + 1,
                                        tomorrowDate.getFullYear()
                                    ).str.substr(0, 3)
                                }
                            </div>
                        </div>
                    </li>
                    <li className={ s.wrapper_item } onMouseDown={ () => {
                        setDate({
                            year : nextWeekDate.getFullYear(),
                            month : nextWeekDate.getMonth() + 1,
                            day : nextWeekDate.getDate()
                        })
                        dispatch(clearContextMenuActionCreator())
                    } } onMouseEnter={ onMouseEnter } onMouseLeave={ onMouseLeave }>
                        <div className={ s.menu_item }>
                            <i className={ s.icon }>
                                <svg width="24" height="24" viewBox="0 0 24 24">
                                    <g fillRule="evenodd">
                                        <path d="M15.9997 4.9997h1v1h3.001v14H3.9997v-14h3v-1h1v1h8v-1zm-11
                                        14h14v-9h-14v9zm 12-10.999h-1v-1h-8v1h-1v-1h-2v2h14.001l-.001-2h-2v1z"/>
                                        <path d="M13.3535 17.3535l2.854-2.854-2.854-2.853-.707.707 2.146 2.146-2.146
                                        2.147zm-4 0l2.854-2.854-2.854-2.853-.707.707 2.146 2.146-2.146 2.147z"/>
                                    </g>
                                </svg>
                            </i>
                            <div>Next week</div>
                            <div className={ s.secondary_text }>Mon</div>
                        </div>
                    </li>
                    <li className={ s.separator }/>
                    <li className={ s.wrapper_item + ' ' + (chooseDatePos ? s.hovered : '') }
                        onMouseEnter={ openChooseDate }
                        onClick={ openChooseDate }
                    >
                        <div className={ s.menu_item }>
                            <i className={ s.icon + ' ' + s.dateTime_icon }/>
                            <div>Choose date</div>
                            <i className={ s.icon + ' ' + s.chevronRight }/>
                        </div>
                    </li>
                    {
                        initialDate &&
                        <>
                            <li className={ s.separator }/>
                            <li className={ s.wrapper_item } onMouseDown={ () => {
                                setDate(undefined)
                                dispatch(clearContextMenuActionCreator())
                            } } onMouseEnter={ onMouseEnter } onMouseLeave={ onMouseLeave }>
                                <div className={ s.menu_item + ' ' + s.delete_item }>
                                    <i className={ s.icon + ' ' + s.delete_icon }/>
                                    <div>Remove due date</div>
                                </div>
                            </li>
                        </>
                    }
                </ul>
            </div>
            {
                chooseDatePos &&
                <CustomDate offsetWidth={ chooseDatePos.offsetLeft + left }
                            offsetHeight={ chooseDatePos.offsetTop + top }
                            width={ chooseDatePos.width }
                            setFullDate={ setDate }
                            setChooseDatePos={ setChooseDatePos }
                            initialDate={ initialDate }
                />
            }
        </>
    )
}
export default ChooseDate