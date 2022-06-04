import * as React from 'react'
import s from './ToggleMyDay.module.css'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { TaskActionI } from '../../../../../../../../types/todoUserData'
import {
    addMyDayActionCreator,
    removeMyDayActionCreator
} from '../../../../../../../../store/actionsCreator/todoUserDataActionCreator'
import Hint from '../../../../../../../../Components/Hint/Hint'
import { useHint } from '../../../../../../../../hooks/useHint'

interface Props {
    _id: string,
    isCompleted: boolean,
    myDay?: number | null
}

const ToggleMyDay: React.FC<Props> = ( { _id, isCompleted, myDay } ) => {
    const dispatch = useDispatch<Dispatch<TaskActionI>>()
    const { onParentMouseEnter, onParentMouseLeave, pos, hintText } = useHint('Remove from "My day"')
    const toggleMyDay = () => {
        if ( myDay === undefined ) {
            dispatch(addMyDayActionCreator({
                _id,
                isCompleted
            }))
        } else {
            dispatch(removeMyDayActionCreator({
                _id,
                myDay
            }))
        }
        onParentMouseLeave()
    }
    return (
        <div className={ s.wrapper + (myDay !== undefined ? ' ' + s.myDay : '') }
             onClick={ () => myDay === undefined && toggleMyDay() }>
            <i className={ s.icon }/>
            <span className={ s.text }>
                {
                    myDay === undefined ?
                        'Add to "My day"'
                        :
                        'Remove from "My day"'
                }
            </span>
            {
                myDay !== undefined && <div className={ s.btn_wrapper }>
                    <button
                        onMouseEnter={ onParentMouseEnter }
                        onMouseLeave={ onParentMouseLeave }
                        onClick={ toggleMyDay }
                        className={ s.btn + ' clear-btn-style' }
                    >
                        { pos && <Hint hintText={ hintText } pos={ pos }/> }
                    </button>
                </div>
            }
        </div>
    )
}

export default ToggleMyDay