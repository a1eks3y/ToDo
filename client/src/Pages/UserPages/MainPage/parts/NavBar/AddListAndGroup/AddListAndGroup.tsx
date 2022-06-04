import * as React from 'react'
import { Dispatch, useState } from 'react'
import s from './AddListAndGroup.module.css'
import { useDispatch } from 'react-redux'
import { addGroupAction, addListAction } from '../../../../../../types/todoUserData'
import {
    addGroupActionCreator,
    addListActionCreator
} from '../../../../../../store/actionsCreator/todoUserDataActionCreator'
import { useHint } from '../../../../../../hooks/useHint'
import Hint from '../../../../../../Components/Hint/Hint'
import { Types } from 'mongoose'

const AddListAndGroup: React.FC = () => {
    const dispatch = useDispatch<Dispatch<addListAction | addGroupAction>>()
    const [name, setName] = useState('')

    const createGroup = ( e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement, MouseEvent> ) => {
        if ( name ) {
            dispatch(addGroupActionCreator({
                _id : new Types.ObjectId().toString(),
                name
            }))
            e.currentTarget.blur()
            setName('')
        }
    }
    const createList = ( e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement, MouseEvent> ) => {
        if ( name ) {
            dispatch(addListActionCreator({
                _id : new Types.ObjectId().toString(),
                name
            }))
            e.currentTarget.blur()
            setName('')
        }
    }
    const { pos, hintText, onParentMouseEnter, onParentMouseLeave } = useHint('Create group')
    return (
        <div className={ s.wrapper }>
            <div className={ s.icon_wrapper } onClick={ createList }>
                <i className={ s.addIcon + ' ' + s.iconSize_24 }/>
            </div>
            <input className={ s.input } placeholder={ 'Create list' } value={ name }
                   maxLength={ 50 }
                   spellCheck={ false }
                   onChange={ e => setName(e.target.value) }
                   onKeyDown={ e => {
                       if ( e.key === 'Enter' ) {
                           createList(e)
                       }
                   } }
            />
            <div className={ s.addGroup_wrapper } onClick={ createGroup }>
                <button className={ s.iconSize_24 } onMouseLeave={ onParentMouseLeave }
                        onMouseEnter={ onParentMouseEnter }>
                    { pos && <Hint hintText={ hintText } pos={ pos }/> }
                    <i className={ s.iconSize_24 }>
                        <svg className={ s.iconSize_24 } focusable="false" aria-hidden="true" width="24" height="24"
                             viewBox="0 0 24 24">
                            <g fillRule="evenodd" stroke="none" strokeWidth="1" fill="#2564cf">
                                <path d="M16.9996,3.9997 L18.0006,3.9997 L18.0006,6.0007 L20.0006,6.0007 L20.0006,7.0007
                                L18.0006,7.0007 L18.0006,8.9997 L16.9996,8.9997 L16.9996,7.0007 L14.9996,7.0007 L14.9996
                                ,6.0007 L16.9996,6.0007 L16.9996,3.9997 Z M19,16.5 L19,12 L20,12 L20,16.5 C20,17.879
                                18.878,19 17.5,19 L6.5,19 C5.122,19 4,17.879 4,16.5 L4,6.5 C4,5.121 5.122,4 6.5,4 L12,4
                                L12,5 L6.5,5 C5.673,5 5,5.673 5,6.5 L5,16.5 C5,17.327 5.673,18 6.5,18 L17.5,18 C18.327,
                                18 19,17.327 19,16.5 Z M8,15 L8,8 L9,8 L9,15 L8,15 Z"/>
                            </g>
                        </svg>
                    </i>
                </button>
            </div>
        </div>
    )
}

export default AddListAndGroup