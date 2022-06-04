import * as React from 'react'
import s from './CustomListsAndGroups.module.css'
import { useTypedSelector } from '../../../../../../hooks/useTypedSelector'
import CustomGroup from './CustomGroup/CustomGroup'
import CustomList from './CustomList/CustomList'
import Line from '../../../../../../Components/Line/Line'
import { useMemo } from 'react'

const CustomListsAndGroups: React.FC = () => {
    const lists = useTypedSelector(state => state.todoUserData.lists)
        .filter(el => !el.forGroup)
    const groups = useTypedSelector(state => state.todoUserData.groups)
    const lists_and_groups = useMemo(() => [...lists, ...groups].sort(
        ( a, b ) => a.position - b.position), [lists, groups])

    return (
        <div className={ s.ListsAndGroups + ' noselect' }>
            <Line key={ 0 + 'out' } position={ 0 }/>
            {
                lists_and_groups.map(( el, inx ) =>
                    <React.Fragment key={ 'out' + el._id + 'fragment' }>
                        {
                            Object.keys(el).includes('isClosed') ?
                                <CustomGroup key={ el._id } name={ el.name }
                                             _id={ el._id }
                                             position={ el.position }/>
                                :
                                <CustomList key={ el._id } name={ el.name } _id={ el._id }
                                            position={ el.position }
                                />
                        }
                        <Line position={ inx + 1 } key={ (inx + 1) + 'out' }/>
                    </React.Fragment>
                )
            }
        </div>
    )
}

export default CustomListsAndGroups