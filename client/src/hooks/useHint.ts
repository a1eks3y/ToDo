import { useState, MouseEvent } from 'react'

export enum positionRelativeToParentVariants {
    TOP = 'TOP',
    BOTTOM = 'BOTTOM'
}

type positionI = {
    bottom: string,
    left: string
}

//this hook only for <Hint/>
export const useHint = (
    hintText: string
) => {
    const [pos, setPos] = useState<positionI | null>(null)
    const onParentMouseEnter = ( e: MouseEvent<any> ) => {
        // @ts-ignore
        const el: DOMRect = e.target?.getBoundingClientRect() || e.currentTarget?.getBoundingClientRect()
        const left = el.left
        const topOrBottom = el.top
        setPos(() => {
            return {
                bottom : window.innerHeight - (topOrBottom + el.height) + 31 + 'px',
                left : left + 'px'
            }
        })
    }
    const onParentMouseLeave = () => {
        setPos(null)
    }
    return { pos, hintText, onParentMouseEnter, onParentMouseLeave }
}