import * as React from 'react'
import s from './Description.module.css'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { TaskActionI } from '../../../../../../../../types/todoUserData'
import { changeTaskDataActionCreator } from '../../../../../../../../store/actionsCreator/todoUserDataActionCreator'

interface Props {
    _id: string,
    description: string
}

const Description: React.FC<Props> = ( { _id, description } ) => {
    const dispatch = useDispatch<Dispatch<TaskActionI>>()
    return (
        <div className={ s.wrapper }>
            <textarea
                value={ description }
                placeholder={ 'Add a note' }
                onChange={ e => dispatch(
                    changeTaskDataActionCreator({
                        _id,
                        description : e.target.value
                    })) }
                className={ s.desc }
                spellCheck={ false }
            />
            <div className={ s.find_height_helper }>
                { description.split('\n').map(( el, inx ) => <React.Fragment key={ el + inx }>
                    { el }
                    <br/>
                </React.Fragment>) }
            </div>
        </div>
    )
}

export default Description