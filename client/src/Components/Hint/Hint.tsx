import * as React from 'react'
import s from './Hint.module.css'
import { useLayoutEffect, useRef, useState } from 'react'

type Props = {
    hintText: string,
    pos: {
        top: string,
        left: string,
        bottom?: undefined
    } | {
        bottom: string,
        left: string,
        top?: undefined
    }
}
// parent must be positioned other than static
// component must be used with useHint hook
const Hint: React.FC<Props> = ( { pos, hintText } ) => {
    const ref = useRef<HTMLDivElement | null>(null)
    const iconRef = useRef<HTMLElement | null>(null)
    const [style, setStyle] = useState<{ top?: string, left?: string, bottom?: string, right?: string }>({})
    useLayoutEffect(() => {
        if ( ref.current && iconRef.current ) {
            const target = ref.current.getBoundingClientRect()
            const icon = iconRef.current.getBoundingClientRect()
            const targetPosition = {
                left : target.left,
                height : target.height,
                width : target.width
            }
            if ( pos.bottom )
                setStyle({
                    bottom : window.innerHeight - icon.top + 'px'
                })
            if ( pos.top )
                setStyle({
                    top : icon.bottom + 'px'
                })
            if ( targetPosition.left + targetPosition.width > window.innerWidth - 8 )
                setStyle(( { left, ...prev } ) => ({
                    ...prev,
                    right : 8 + 'px'
                }))
            if ( +pos.left.split('px')[ 0 ] < 8 ) {
                setStyle(( { right, ...prev } ) => ({
                    ...prev,
                    left : 8 + 'px'
                }))
            }
        }
    }, [pos])
    return (
        <div className={ s.hint_wrapper }>
            <div className={ s.hint + ' ' + (pos.bottom ? s.hint_top : s.hint_bottom) +
                (style.left || style.right ? ' ' + s.custom_style : '') } style={ {
                top : style.bottom ? undefined : style.top ?? pos.top,
                left : style.right ? undefined : style.left ?? pos.left,
                bottom : style.top ? undefined : style.bottom ?? pos.bottom,
                right : style.left ? undefined : style.right
            } } ref={ ref }>
                <span className={ s.text }>
                    { hintText }
                </span>
            </div>
            <i className={ s.triangle + ' ' + (pos.top ? s.triangle_top : s.triangle_bottom) } style={ {
                top : pos.top ? `calc(100% - 10px)` : undefined,
                bottom : pos.bottom ? `calc(100% - 10px)` : undefined
            } } ref={ iconRef }/>
        </div>
    )
}

export default Hint