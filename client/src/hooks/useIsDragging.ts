import { useRef } from 'react'
import * as React from 'react'

export const useIsDragging = (
    draggingFunc: ( e: React.MouseEvent ) => void,
    notDraggingFunc?: ( e: React.MouseEvent ) => void
) => {
    const isDragging = useRef<[boolean, number]>([false, +new Date()])
    const onMouseDown = ( e: React.MouseEvent ): NodeJS.Timeout | void => {
        if ( e.button === 2 )
            return
        let date = +new Date()
        isDragging.current = [true, date]
        return setTimeout(() => {
            if ( isDragging.current[ 0 ] && isDragging.current[ 1 ] === date ) {
                draggingFunc(e)
            } else {
                if ( notDraggingFunc )
                    notDraggingFunc(e)
            }
        }, 150)
    }
    const notDragging = () => {
        isDragging.current = [false, +new Date()]
    }
    return { notDragging, onMouseDown }
}