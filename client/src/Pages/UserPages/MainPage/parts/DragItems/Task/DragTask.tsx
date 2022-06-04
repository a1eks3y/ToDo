import * as React from 'react'
import s from './DragTask.module.css'
import { useMoveItems } from '../../../../../../hooks/useMoveItems'

interface Props {
    name: string,
    x: number,
    y: number,
    isCompleted: boolean,
    favourites?: number | null
}

const DragTask: React.FC<Props> = (
    { name, x, y, isCompleted, favourites }
) => {
    const { mouseX, mouseY } = useMoveItems(x, y)
    return (
        <div className={ s.wrapper } style={ {
            top : (mouseY + 52 > window.innerHeight ? window.innerHeight - 52 : mouseY) + 'px',
            left : (mouseX + 244 > window.innerWidth ? window.innerWidth - 244 : mouseX) + 'px'
        } }>
            <div>
                <svg className={ s.isCompleted } viewBox="0 0 24 24">
                    { isCompleted ?
                        <path fillRule="evenodd"
                              d="M10.9854 15.0752l-3.546-3.58 1.066-1.056 2.486 2.509 4.509-4.509 1.06 1.061-5.575
                                  5.575zm1.015-12.075c-4.963 0-9 4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9z"/>
                        :
                        <g fillRule="evenodd">
                            <path d="M12 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8m0-17c-4.963 0-9
                            4.037-9 9s4.037 9 9 9 9-4.037 9-9-4.037-9-9-9"/>
                        </g>
                    }
                </svg>
            </div>
            <div className={ s.name_wrapper }>
                <span className={ s.name + (isCompleted ? ' ' + s.completed : '') }>
                    { name }
                </span>
            </div>
            <div>
                <i
                    className={
                        favourites === undefined ? s.starIcon : s.ActiveStarIcon
                    }
                />
            </div>
        </div>
    )
}

export default DragTask