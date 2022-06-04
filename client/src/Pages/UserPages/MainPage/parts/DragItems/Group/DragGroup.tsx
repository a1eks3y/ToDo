import * as React from 'react'
import s from './DragGroup.module.css'
import { useMoveItems } from '../../../../../../hooks/useMoveItems'

const DragGroup: React.FC<{ name: string, x: number, y: number }> = ( { name, x, y } ) => {
    const { mouseX, mouseY } = useMoveItems(x, y)
    const width = window.innerWidth >= 1010 ? 290 : 210
    return (
        <div className={ s.inner } style={ {
            top : (mouseY + 36 > window.innerHeight ? window.innerHeight - 36 : mouseY) + 'px',
            left : (mouseX + width > window.innerWidth ? window.innerWidth - width : mouseX) + 'px'
        } }>
            <i>
                <svg className={ s.icon_group }
                     focusable="false" aria-hidden="true" width="24" height="24"
                     viewBox="0 0 24 24">
                    <g fillRule="evenodd" stroke="none" strokeWidth="1">
                        <path
                            d="M19,16.5 L19,6.5 C19,5.673 18.327,5 17.5,5 L6.5,5 C5.673,5 5,5.673 5,6.5 L5,16.5
                                C5,17.327 5.673,18 6.5,18 L17.5,18 C18.327,18 19,17.327 19,16.5 Z M6.5,4 L17.5,4 C18.878
                                ,4 20,5.121 20,6.5 L20,16.5 C20,17.879 18.878,19 17.5,19 L6.5,19 C5.122,19 4,17.879 4,
                                16.5 L4,6.5 C4,5.121 5.122,4 6.5,4 Z M8,15 L8,8 L9,8 L9,15 L8,15 Z"/>
                    </g>
                </svg>
            </i>

            <span className={ s.name + ' noselect' }>
                { name }
            </span>
            <span className={ s.icon_arrow_wrapper }>
                    <i
                        className={
                            s.icon_arrow + (' ' + s.Closed)
                        }
                    />
                </span>
        </div>
    )
}

export default DragGroup