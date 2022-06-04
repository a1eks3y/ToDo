import * as React from 'react'
import s from './TaskDetails.module.css'
import { useTypedSelector } from '../../../../../../hooks/useTypedSelector'
import Task from './parts/Task/Task'
import { useLocation } from 'react-router-dom'
import Steps from './parts/Steps/Steps'
import AddStep from './parts/AddStep/AddStep'
import ToggleMyDay from './parts/ToggleMyDay/ToggleMyDay'
import ChangeEndAtDate from './parts/ChangeEndAtDate/ChangeEndAtDate'
import Categories from './parts/Categories/Categories'
import Description from './parts/Description/Description'
import { getDayOfWeek, monthNumberToName } from '../../../../../../store/actionsCreator/syncDateActionCreator'
import { useEffect } from 'react'

interface Props {
    _id: string
}

export enum interfaceColor {
    BLUE = 'rgb(37, 100, 207)',
    RED = 'rgb(210, 83, 78)'
}

const TaskDetails: React.FC<Props> = ( { _id } ) => {
    const task = useTypedSelector(state => state.todoUserData.tasks)
        .find(el => el._id === _id)
    const time = useTypedSelector(state => state.syncDate.time)
    const location = useLocation().pathname.split('/')[ 1 ]
    useEffect(() => {
        const prevTitle = document.title
        if ( task )
            document.title = task.name + ' - To Do'
        return () => {
            document.title = prevTitle
        }
    }, [task])
    if ( !task || !time )
        return null
    const interfaceRGB = location === 'Completed' || location === 'All' ?
        interfaceColor.RED : interfaceColor.BLUE
    return (
        <>
            <div className={ s.taskDetails }>
                <div className={ s.details_body }>
                    <Task
                        key={ _id + 'taskRightSideBar' }
                        _id={ task._id }
                        name={ task.name }
                        position={ task.position }
                        myDay={ task.myDay }
                        favourites={ task.favourites }
                        isCompleted={ !!task.completedAt }
                        interfaceRGB={ interfaceRGB }
                    />
                    <div className={ s.wrapper }>
                        <Steps
                            key={ _id + 'Steps' }
                            taskId={ _id }
                            interfaceRGB={ interfaceRGB }
                        />
                        <AddStep
                            key={ _id + 'AddStep' }
                            forTask={ _id }
                            interfaceRGB={ interfaceRGB }
                        />
                    </div>
                    <div className={ s.wrapper }>
                        <ToggleMyDay
                            key={ task._id + 'ToggleMyDay' }
                            _id={ task._id }
                            myDay={ task.myDay }
                            isCompleted={ !!task.completedAt }
                        />
                    </div>
                    <div className={ s.wrapper }>
                        <ChangeEndAtDate
                            key={ task._id + 'ChangeEndAtDate' + typeof task.endAt }
                            _id={ task._id }
                            endAt={ task.endAt }
                        />
                    </div>
                    <div className={ s.wrapper + ' ' + s.category_wrapper }>
                        <Categories
                            _id={ task._id }
                            categories={ task.categories }
                        />
                    </div>
                    <div className={ s.wrapper }>
                        <Description
                            key={ task._id + 'Description' }
                            _id={ task._id }
                            description={ task.description }
                        />
                    </div>
                </div>
                <div className={ s.details_footer }>
                    <div>
                        <button className={ 'clear-btn-style ' + s.footer_btn }>
                            <i className={ s.closeIcon + ' ' + s.icon }/>
                        </button>
                    </div>
                    <span className={ s.createdAt }>
                        Created{ ' ' }
                        {
                            (
                                (task.createdAt[ 2 ] - time.date === -1 || task.createdAt[ 2 ] - time.date === 0) &&
                                time.month === task.createdAt[ 1 ] &&
                                time.year === task.createdAt[ 0 ] &&
                                (
                                    task.createdAt[ 2 ] - time.date === -1 ?
                                        'yesterday'
                                        :
                                        'today'
                                )
                            ) || (
                                getDayOfWeek(
                                    task.createdAt[ 2 ], task.createdAt[ 1 ], task.createdAt[ 0 ]
                                ).str.substr(0, 3)
                                + ', ' + task.createdAt[ 2 ]
                                + ' ' + monthNumberToName[ task.createdAt[ 1 ] - 1 ]
                                + (task.createdAt[ 0 ] !== time.year ? (' ' + task.createdAt[ 0 ]) : '')
                            )
                        }
                    </span>
                    <div>
                        <button className={ 'clear-btn-style ' + s.footer_btn }>
                            <i className={ s.deleteIcon + ' ' + s.icon }/>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TaskDetails