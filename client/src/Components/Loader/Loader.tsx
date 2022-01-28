import * as React from 'react'
import style from './Loader.module.css'

interface ILoader {
    width: string,
    height: string
}

const Loader: React.FC<ILoader> = ( { width, height } ) => {
    return (
        <div className={ style.wrapLoader } style={ {width, height} }>
            <div className={style.ldsSpinner}>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
            </div>
        </div>
    )
}

export default Loader