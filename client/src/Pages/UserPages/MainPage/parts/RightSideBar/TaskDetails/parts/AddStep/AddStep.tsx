import * as React from 'react'
import s from './AddStep.module.css'
import {
    addStepActionCreator
} from '../../../../../../../../store/actionsCreator/todoUserDataActionCreator'
import {
    StepActionI
} from '../../../../../../../../types/todoUserData'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { useState } from 'react'
import { Types } from 'mongoose'

interface Props {
    forTask: string,
    interfaceRGB: interfaceColor.RED | interfaceColor.BLUE
}

export enum interfaceColor {
    BLUE = 'rgb(37, 100, 207)',
    RED = 'rgb(210, 83, 78)'
}

const AddStep: React.FC<Props> = ( { forTask, interfaceRGB } ) => {
    const dispatch = useDispatch<Dispatch<StepActionI>>()
    const [name, setName] = useState<string>('')
    const [wasFocused, setWasFocused] = useState<boolean>(false)
    const createStep = () => {
        if ( name !== '' ) {
            dispatch(addStepActionCreator({
                _id : new Types.ObjectId().toString(),
                name,
                forTask
            }))
            setName('')
        }
    }
    return (
        <div className={ s.wrapper + ' noselect' }
             onMouseDown={ () => setWasFocused(true) }
        >
            {
                !wasFocused ?
                    <i className={ s.icon + ' ' + s.plusIcon } style={ {
                        color : interfaceRGB
                    } }/>
                    :
                    <i className={ s.icon }>
                        <svg viewBox="0 0 24 24">
                            <path fillRule="evenodd"
                                  d="M6 12c0-3.309 2.691-6 6-6s6 2.691 6 6-2.691 6-6 6-6-2.691-6-6zm-1 0c0 3.859 3.141 7
                                  7 7s7-3.141 7-7-3.141-7-7-7-7 3.141-7 7z"/>
                        </svg>
                    </i>
            }
            <input
                className={ s.input + (interfaceRGB === interfaceColor.RED ? ' ' + s.red_input : '') }
                placeholder={ 'Create step' }
                value={ name }
                onChange={ e => setName(e.target.value) }
                onKeyDown={ e => {
                    if ( e.key === 'Enter' ) {
                        createStep()
                        e.currentTarget.blur()
                    }
                } }
                spellCheck={ false }
                maxLength={ 50 }
                autoFocus={ wasFocused }
            />
            {
                name !== '' &&
                <button
                    className={
                        s.add_step + ' clear-btn-style' + (name === '' ? '' : ' ' + s.active)
                    }
                    onClick={ createStep }
                >
                    Add
                </button>
            }
        </div>
    )
}

export default AddStep