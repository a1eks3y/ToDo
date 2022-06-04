import * as React from 'react'
import s from './Step.module.css'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { StepStateI, TodoUserDataActionI } from '../../../../../../../../../types/todoUserData'
import { useHint } from '../../../../../../../../../hooks/useHint'
import { useState } from 'react'
import {
    deleteStepActionCreator,
    finishRenamingItemFailedActionCreator, finishRenamingItemSuccessActionCreator, startRenamingStep,
    toggleStepCompleteActionCreator
} from '../../../../../../../../../store/actionsCreator/todoUserDataActionCreator'
import Hint from '../../../../../../../../../Components/Hint/Hint'
import { useIsDragging } from '../../../../../../../../../hooks/useIsDragging'
import { dragStepActionCreator } from '../../../../../../../../../store/actionsCreator/drag&droppActionCreator'
import { dragStepAction } from '../../../../../../../../../types/drag&drop'
import { useTypedSelector } from '../../../../../../../../../hooks/useTypedSelector'

interface Props extends StepStateI {
    chosenStepId: string,
    setChosenStepId: React.Dispatch<React.SetStateAction<string>>,
    interfaceRGB: interfaceColor.RED | interfaceColor.BLUE
}

export enum interfaceColor {
    BLUE = 'rgb(37, 100, 207)',
    RED = 'rgb(210, 83, 78)'
}

const Step: React.FC<Props> = ( {
    isCompleted, name, _id, chosenStepId, setChosenStepId,
    interfaceRGB, forTask, position
} ) => {
    const isDragging = useTypedSelector(state => state.dragAndDrop.isDragging)
    const dispatch = useDispatch<Dispatch<TodoUserDataActionI | dragStepAction>>()
    const { onParentMouseEnter, onParentMouseLeave, pos, hintText } = useHint('Delete step')
    const { notDragging, onMouseDown } = useIsDragging(
        ( e ) => {
            dispatch(dragStepActionCreator({
                _id,
                name,
                x : e.clientX,
                y : e.clientY,
                interfaceRGB,
                forTask,
                position,
                isCompleted
            }))
        }
    )
    const [newName, setNewName] = useState<string>(name)
    const toggleCompleted = () => {
        dispatch(toggleStepCompleteActionCreator({ _id }))
    }
    const deleteStep = () => {
        dispatch(deleteStepActionCreator({
            _id,
            position,
            forTask
        }))
    }
    return (
        <>
            <input id={ _id }
                   type="checkbox"
                   checked={ chosenStepId === _id }
                   onChange={ () => setChosenStepId(_id) }
                   className={ s.input }
                   name="steps"
            />
            <label
                htmlFor={ _id }
                className={ s.wrapper + ' noselect' }
                onMouseDown={ ( e ) => {
                    setChosenStepId(_id)
                    onMouseDown(e)
                } }
                onMouseUp={ notDragging }
                onMouseLeave={ notDragging }
            >
                <div className={ s.toggleComplete }
                     onClick={ toggleCompleted }
                >
                    <svg width="24" height="24" viewBox="0 0 24 24"
                         style={ {
                             fill : interfaceRGB === interfaceColor.RED ?
                                 interfaceColor.RED : interfaceColor.BLUE
                         } }
                    >
                        { isCompleted ?
                            <path fillRule="evenodd" d="M11.2354 14.5615l-2.796-2.815 1.065-1.057 1.737 1.749
                            3.261-3.249 1.058 1.062-4.325 4.31zm.765-9.562c-3.86 0-7 3.141-7 7 0 3.86 3.14 7 7 7 3.859
                            0 7-3.14 7-7 0-3.859-3.141-7-7-7z"/>
                            :
                            <g fillRule="evenodd">
                                <path d="M6 12c0-3.309 2.691-6 6-6s6 2.691 6 6-2.691 6-6 6-6-2.691-6-6zm-1 0c0 3.859
                                3.141 7 7 7s7-3.141 7-7-3.141-7-7-7-7 3.141-7 7z"/>
                                <path d="M11.2402 12.792l-1.738-1.749-.709.705 2.443 2.46 3.971-3.957-.706-.708z"/>
                            </g>
                        }
                    </svg>
                </div>
                <div className={ s.name_wrapper }>
                    <div className={ s.name + ' noselect' }>
                        <textarea
                            maxLength={ 255 }
                            value={ newName }
                            disabled={ isDragging }
                            className={
                                s.name_textarea + ' noselect ' + (isCompleted ? s.completed : '') +
                                (isDragging ? ' ' + s.step_dragging : '')
                            }
                            onKeyDown={ e => {
                                if ( e.key === 'Enter' ) {
                                    e.currentTarget.blur()
                                }
                            } }
                            onChange={ e => {
                                setNewName(e.target.value)
                            } }
                            onFocus={ () => {
                                dispatch(startRenamingStep(_id))
                            } }
                            onBlur={ () => {
                                if ( newName !== name ) {
                                    dispatch(finishRenamingItemSuccessActionCreator(newName))
                                } else {
                                    dispatch(finishRenamingItemFailedActionCreator())
                                }
                            } }
                            spellCheck={ false }
                        />
                        <div className={ s.find_height_helper }>
                            { newName }
                        </div>
                    </div>
                </div>
                <div
                    className={ s.icon_wrapper }
                >
                    <i
                        onMouseEnter={ onParentMouseEnter }
                        onMouseLeave={ onParentMouseLeave }
                        onClick={ deleteStep }
                        className={
                            s.icon + ' ' + s.deleteIcon
                        }
                    >
                        { pos && <Hint hintText={ hintText } pos={ pos }/> }
                    </i>
                </div>
            </label>
        </>
    )
}

export default Step