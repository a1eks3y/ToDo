import * as React from 'react'
import s from './Hint.module.css'
import { useLayoutEffect, useRef, useState } from 'react'

type Props = {
    hintText: string,
    pos: {
        bottom: string,
        left: string,
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
            if ( pos.bottom )
                setStyle({
                    bottom : window.innerHeight - icon.top + 'px'
                })
            switch ( true ){
                case target.left + target.width > window.innerWidth - 8:
                    setStyle(( { left, ...prev } ) => ({
                        ...prev,
                        right : 8 + 'px'
                    }))
                    break
                case +pos.left.split('px')[ 0 ] < 8:
                    setStyle(( { right, ...prev } ) => ({
                        ...prev,
                        left : 8 + 'px'
                    }))
                    break
                default:
                    setStyle(({right, ...prev}) => ({
                        ...prev,
                        left: icon.left + icon.width / 2 - target.width / 2 + 'px'
                    }))
            }
        }
    }, [pos])
    return (
        <div className={ s.hint_wrapper }>
            <div className={ s.hint + ' ' + (pos.bottom ? s.hint_top : s.hint_bottom) +
                (style.left || style.right ? ' ' + s.custom_style : '') } style={ style } ref={ ref }>
                <span className={ s.text }>
                    { hintText }
                </span>
            </div>
            <i className={ s.triangle + ' ' + s.triangle_bottom } style={ {
                bottom : pos.bottom ? `calc(100% - 10px)` : undefined
            } } ref={ iconRef }/>
        </div>
    )
}

export default Hint