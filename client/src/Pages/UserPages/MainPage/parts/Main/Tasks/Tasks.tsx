import * as React from 'react'
import { useTypedSelector } from '../../../../../../hooks/useTypedSelector'
import NativeList, { listColor } from '../NativeList/NativeList'

const Tasks: React.FC = () => {
    const tasks = useTypedSelector(state => state.todoUserData.tasks)
        .filter(el => !el.forList)
    return <NativeList name={ 'Tasks' } tasks={ tasks } list={ undefined } color={ listColor.BLUE }/>
}

export default Tasks