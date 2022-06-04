import * as React from 'react'
import s from './NativeList.module.css'
import { TaskStateI } from '../../../../../../types/todoUserData'
import { useTypedSelector } from '../../../../../../hooks/useTypedSelector'
import { useDispatch } from 'react-redux'
import { Dispatch, useEffect, useMemo, useState } from 'react'
import { ExtensibilityActionI } from '../../../../../../types/Extensibility'
import { toggleNavbarActionCreator } from '../../../../../../store/actionsCreator/extensibilityActionCreator'
import Task from './Task/Task'
import Line from '../../../../../../Components/Line/Line'
import AddTask from './AddTask/AddTask'
import { useHint } from '../../../../../../hooks/useHint'
import Hint from '../../../../../../Components/Hint/Hint'

interface Props {
    name: string,
    list?: string,
    tasks: TaskStateI[],
    time?: {
        date: number,
        dayOfWeek: string,
        month: string
    },
    color: listColor.RED | listColor.BLUE | listColor.BLACK
}

export enum listColor {
    BLACK = 'rgb(50, 49, 48)',
    BLUE = 'rgb(37, 100, 207)',
    RED = 'rgb(210, 83, 78)'
}

const NativeList: React.FC<Props> = (
    { name, tasks, time, list, color }
) => {
    const { openedNavbar } = useTypedSelector(state => state.extensibilityState)
    const lists = useTypedSelector(state => state.todoUserData.lists)
    const sorting = useHint(`Sorting`)
    const dispatch = useDispatch<Dispatch<ExtensibilityActionI>>()
    const [chosenTaskId, setChosenTaskId] = useState<string>('')
    const isMyDay = name === 'My day' && !list
    const listsIdToName = useMemo(() => {
        const obj: { [ i: string ]: string } = {
            '' : 'Tasks'
        }
        for ( const list of lists ) {
            obj[ list._id ] = list.name
        }
        return obj
    }, [lists])
    useEffect(() => {
        document.title = name + ' - To Do'
    }, [name])
    if ( !time && isMyDay )
        return null
    const openNavBar = () => {
        dispatch(toggleNavbarActionCreator())
    }
    // const tasksHeight = window.innerHeight - (isMyDay ? 134 : 111)
    return (
        <article className={ s.list }>
            <div className={ isMyDay ? s.myDayTaskToolbar : s.taskToolbar }>
                { !openedNavbar &&
                    <div className={ s.openNavbar } onClick={ openNavBar }>
                        <i className={ s.navBar_icon }/>
                    </div>
                }
                <div className={ s.taskToolbar_left }>
                    <div className={ s.name } style={ { color } }>
                        { name }
                    </div>
                    { isMyDay && time &&
                        <div className={ s.date }>
                            {
                                time.dayOfWeek + ', ' + time.date + ' ' + time.month
                            }
                        </div>
                    }
                </div>
                <div className={ s.taskToolbar_right }
                     onMouseEnter={ sorting.onParentMouseEnter }
                     onMouseLeave={ sorting.onParentMouseLeave }>
                    { sorting.pos && <Hint hintText={ sorting.hintText } pos={ sorting.pos }/> }
                    <button
                        className={ s.sortBy }
                    >
                        <i className={ s.icon_sortBy }/>
                    </button>
                </div>
            </div>
            <div className={ (isMyDay ? s.myday_tasks_wrapper : s.tasks_wrapper) }>
                <div className={ s.tasks }>
                    { !(name === 'Completed' && !list) &&
                        <AddTask forList={ list }
                                 isFavourite={ name === 'Favourites' && !list ? true : undefined }
                                 isMyDay={ isMyDay ? true : undefined }
                                 isPlanned={ name === 'Planned' && !list ? true : undefined }
                                 color={ color }
                        /> }
                    { !!tasks.length &&
                        <Line position={ 0 } key={ 0 + tasks[ 0 ]._id } forList={ list } forListName={ name }/> }
                    {
                        tasks.map(( task, inx ) =>
                            <React.Fragment key={ task._id + 'fragment' }>
                                <Task
                                    key={ task._id }
                                    _id={ task._id }
                                    name={ task.name }
                                    isCompleted={ !!task.completedAt }
                                    favourites={ task.favourites }
                                    myDay={ task.myDay }
                                    position={ task.position }
                                    forList={ task.forList }
                                    forListName={ listsIdToName[ task.forList ?? '' ] }
                                    list={ list ?? '' }
                                    chosenTaskId={ chosenTaskId }
                                    setChosenTaskId={ setChosenTaskId }
                                    color={ color }
                                    curListName={ name }
                                    endAt={ task.endAt }
                                    categories={ task.categories }
                                />
                                <Line key={ task._id + 'line' } position={ inx + 1 }
                                      forList={ list } forListName={ name } locked={ !!task.completedAt }/>
                            </React.Fragment>
                        )
                    }
                </div>
            </div>
            <div className={ s.backgroundLines }/>
        </article>
    )
}

export default NativeList