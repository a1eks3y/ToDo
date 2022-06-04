import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import s from './Categories.module.css'
import { Category, TaskActionI, TaskCategories } from '../../../../../../../../types/todoUserData'
import { changeTaskDataActionCreator } from '../../../../../../../../store/actionsCreator/todoUserDataActionCreator'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'

interface Props {
    _id: string,
    categories: Category[] | never[]
}

const categoriesArray: Category[] = [
    TaskCategories.BLUE, TaskCategories.YELLOW, TaskCategories.GREEN,
    TaskCategories.ORANGE, TaskCategories.RED, TaskCategories.PURPLE]

const Categories: React.FC<Props> = ( { _id, categories } ) => {
    const dispatch = useDispatch<Dispatch<TaskActionI>>()
    const removeCategory = ( category: Category ) => {
        dispatch(changeTaskDataActionCreator({
            _id,
            categories : categories.filter(el => el !== category)
        }))
    }
    const [search, setSearch] = useState<string>('')
    const [menuPos, setMenuPos] = useState<({ top: '100%' } | { bottom: '100%' }) & { maxHeight: string } | false>(false)
    const [lastMenuTarget, setLastMenuTarget] = useState<Category>(TaskCategories.BLUE)
    const filteredCategory = useMemo(() =>
            categoriesArray.filter(el => (el + ' category').includes(search)),
        [search])
    const addCategory = ( category: Category ) => {
        dispatch(changeTaskDataActionCreator({
            _id,
            categories : [...categories.filter(el => el !== category), category]
        }))
    }
    useEffect(() => {
        const closeMenu = () => {
            setMenuPos(false)
        }
        menuPos && window.addEventListener('mousedown', closeMenu)
        return () => window.removeEventListener('mousedown', closeMenu)
    })
    return (
        <div className={ s.categories_wrapper + (menuPos ? ' ' + s.menu_opened : '') }
             onMouseDown={ e => {
                 if(menuPos) {
                     e.stopPropagation()
                     e.preventDefault()
                 }
             } }
        >
            <i className={ s.categoryIcon }>
                <svg width="15" height="15" viewBox="0 0 15 15">
                    <path d="M11.5 4.5C11.3594 4.5 11.2292 4.47396 11.1094 4.42188C10.9896 4.36979 10.8828 4.29948
                    10.7891 4.21094C10.7005 4.11719 10.6302 4.01042 10.5781 3.89062C10.526 3.77083 10.5 3.64062
                    10.5 3.5C10.5 3.35938 10.526 3.22917 10.5781 3.10938C10.6302 2.98958 10.7005 2.88542 10.7891
                    2.79688C10.8828 2.70312 10.9896 2.63021 11.1094 2.57812C11.2292 2.52604 11.3594 2.5 11.5 2.5C11.6406
                    2.5 11.7708 2.52604 11.8906 2.57812C12.0104 2.63021 12.1146 2.70312 12.2031 2.79688C12.2969 2.88542
                    12.3698 2.98958 12.4219 3.10938C12.474 3.22917 12.5 3.35938 12.5 3.5C12.5 3.64062 12.474 3.77083
                    12.4219 3.89062C12.3698 4.01042 12.2969 4.11719 12.2031 4.21094C12.1146 4.29948 12.0104 4.36979
                    11.8906 4.42188C11.7708 4.47396 11.6406 4.5 11.5 4.5ZM8 0H15V7L7 15L0 8L8 0ZM14
                    6.58594V1H8.41406L1.41406 8L7 13.5859L14 6.58594Z" fill="#666666"/>
                </svg>
            </i>
            <div className={ s.categories }
                 onMouseDown={ e => {
                     if ( !menuPos ) {
                         const DOMRect = e.currentTarget.getBoundingClientRect()
                         setLastMenuTarget(TaskCategories.BLUE)
                         if ( DOMRect.bottom + 168 < window.innerHeight ) {
                             setMenuPos({
                                 top : '100%',
                                 maxHeight : window.innerHeight - DOMRect.bottom - 38 - 8 + 'px'
                             })
                         } else {
                             setMenuPos({
                                 bottom : '100%',
                                 maxHeight : DOMRect.top - 8 + 'px'
                             })
                         }
                     }
                 } }>
                {
                    categories.map(el =>
                        <div
                            key={ el }
                            className={ s.category + ' ' + ((el === TaskCategories.YELLOW && s.yellow_category) ||
                                (el === TaskCategories.RED && s.red_category) ||
                                (el === TaskCategories.PURPLE && s.purple_category) ||
                                (el === TaskCategories.ORANGE && s.orange_category) ||
                                (el === TaskCategories.GREEN && s.green_category) ||
                                (el === TaskCategories.BLUE && s.blue_category)
                            ) }
                        >
                            <div className={ s.text }>
                                { el } category
                            </div>
                            <i className={ s.deleteIcon } onClick={ () => removeCategory(el) }>
                                <svg height="8" width="8">
                                    <path d="M4.46607 4L8 7.53905L7.53905 8L4 4.46607L0.460948 8L0 7.53905L3.53393 4L0
                                0.460948L0.460948 0L4 3.53393L7.53905 0L8 0.460948L4.46607 4Z"/>
                                </svg>
                            </i>
                        </div>
                    )
                }
                <input
                    type="text"
                    autoCapitalize={ 'none' }
                    placeholder={ 'Choose category' }
                    maxLength={ 15 }
                    className={ s.search_category }
                    value={ search }
                    onKeyDown={ e => {
                        if ( (e.key === 'Backspace' || e.key === 'Delete') && categories.length && !search.length ) {
                            removeCategory(categories[ categories.length - 1 ])
                        }
                        if ( e.key === 'Alt' ) {
                            setMenuPos(false)
                            e.currentTarget.blur()
                        }
                        if ( (e.key === ' ' || e.key === 'Enter') && menuPos ) {
                            e.preventDefault()
                            if ( !categories.find(el => el === lastMenuTarget) ) {
                                addCategory(lastMenuTarget)
                            } else {
                                removeCategory(lastMenuTarget)
                            }
                        }

                    } }
                    onChange={ e => {
                        console.log(2)
                        setSearch(e.target.value)
                    } }
                    onFocus={ e => {
                        const DOMRect = e.target.parentElement!.getBoundingClientRect()
                        if ( DOMRect.bottom + 168 < window.innerHeight ) {
                            setMenuPos({
                                top : '100%',
                                maxHeight : window.innerHeight - DOMRect.bottom - 38 - 8 + 'px'
                            })
                        } else {
                            setMenuPos({
                                bottom : '100%',
                                maxHeight : DOMRect.top - 8 + 'px'
                            })
                        }
                    } }
                />
                {
                    !!menuPos && <div className={ s.menu } style={ menuPos }>
                        { !filteredCategory.length && <div>Your search did not match any category</div> }
                        {
                            filteredCategory.map(el => {
                                const isActive: boolean = !!categories.find(item => item === el)
                                return (
                                    <div
                                        key={ 'filteredCategory' + el }
                                        className={
                                            s.menu_item + ' ' + (isActive ? s.active_menu_item : '')
                                            + ' ' + (lastMenuTarget === el ? s.target_menu_item : '')
                                        }
                                        onMouseEnter={ () => setLastMenuTarget(el) }
                                        onMouseDown={ () => {
                                            if ( isActive ) {
                                                removeCategory(el)
                                            } else {
                                                addCategory(el)
                                            }
                                        } }
                                        onKeyDown={ e => e.key }
                                    >
                                        <div
                                            className={ s.menu_icon + ' ' + (
                                                (el === TaskCategories.YELLOW && s.yellow_circle) ||
                                                (el === TaskCategories.RED && s.red_circle) ||
                                                (el === TaskCategories.PURPLE && s.purple_circle) ||
                                                (el === TaskCategories.ORANGE && s.orange_circle) ||
                                                (el === TaskCategories.GREEN && s.green_circle) ||
                                                (el === TaskCategories.BLUE && s.blue_circle)
                                            ) }
                                        />
                                        <span className={ s.menu_name }>
                                            { el + ' category' }
                                        </span>
                                        {
                                            isActive && <i className={ s.active_icon }>
                                                <svg width="16" height="16" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd"
                                                          d="M12.1323429 4.17380929l-5.64699995 5.647-2.646-2.647-.707
                                                          .707 3.353 3.35400001 6.35399995-6.35400001z"/>
                                                </svg>
                                            </i>
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default Categories