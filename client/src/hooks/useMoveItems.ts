import { useEffect, useRef, useState } from 'react'

export const useMoveItems = ( x: number, y: number ) => {
    const [mouseX, setMouseX] = useState<number>(x)
    const [mouseY, setMouseY] = useState<number>(y)
    const time = useRef<number>(new Date().getTime())
    useEffect(() => {
        const mouseMoveHandler = ( e: MouseEvent ) => {
            if ( +new Date() - time.current > 25 ) {
                setMouseX(e.clientX + 2)
                setMouseY(e.clientY + 2)
                time.current = new Date().getTime()
            }
        }
        document.addEventListener('mousemove', mouseMoveHandler)
        return () => document.removeEventListener('mousemove', mouseMoveHandler)
    })
    return { mouseX, mouseY }
}