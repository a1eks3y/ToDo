import { Dispatch, SetStateAction, useRef } from 'react'

export const useHideWhenMouseOnAnotherElement = (
    state: false | any, setState: Dispatch<SetStateAction<false | any>>
) => {
    const mouseOnElement = useRef<false | string>(false)
    const onMouseLeave = () => {
        if ( state !== false )
            mouseOnElement.current = false
    }
    const onMouseEnter = () => {
        if ( state !== false ) {
            const id = (+new Date()).toString()
            mouseOnElement.current = id
            setTimeout(() => {
                if ( mouseOnElement.current === id ) {
                    mouseOnElement.current = id
                    setState(false)
                }
            }, 300)
        }
    }
    return { onMouseLeave, onMouseEnter }
}