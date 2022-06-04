import * as React from 'react'
import s from './DragStep.module.css'
import { useMoveItems } from '../../../../../../hooks/useMoveItems'
import { interfaceColor } from '../../../../../../types/drag&drop'

interface Props {
    name: string,
    x: number,
    y: number,
    isCompleted: boolean,
    interfaceRGB: interfaceColor.RED | interfaceColor.BLUE
}

const DragStep: React.FC<Props> = ( {
    name, isCompleted, y, x, interfaceRGB
} ) => {
    const { mouseX, mouseY } = useMoveItems(x, y)
    return (
        <div className={ s.wrapper } style={ {
            top : (mouseY + 42 > window.innerHeight ? window.innerHeight - 42 : mouseY) + 'px',
            left : (mouseX + 280 > window.innerWidth ? window.innerWidth - 280 : mouseX) + 'px'
        } }>
            <div className={ s.toggleComplete }>
                <svg width="24" height="24" viewBox="0 0 24 24" fill={ interfaceRGB }>
                    { isCompleted ?
                        <path fillRule="evenodd" d="M11.2354 14.5615l-2.796-2.815 1.065-1.057 1.737 1.749
                            3.261-3.249 1.058 1.062-4.325 4.31zm.765-9.562c-3.86 0-7 3.141-7 7 0 3.86 3.14 7 7 7 3.859
                            0 7-3.14 7-7 0-3.859-3.141-7-7-7z"/>
                        :
                        <g fillRule="evenodd">
                            <path d="M6 12c0-3.309 2.691-6 6-6s6 2.691 6 6-2.691 6-6 6-6-2.691-6-6zm-1 0c0 3.859
                                3.141 7 7 7s7-3.141 7-7-3.141-7-7-7-7 3.141-7 7z"/>
                            <path d="M11.2402 12.792l-1.738-1.749-.709.705 2.443 2.46 3.971-3.957-.706-.708z"/>
                        </g>
                    }
                </svg>
            </div>
            <div className={ s.name }>
                { name }
            </div>
        </div>
    )
}

export default DragStep