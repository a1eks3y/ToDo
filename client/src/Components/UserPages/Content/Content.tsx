import * as React from 'react'
import NavBar from './NavBar/NavBar'
import { Outlet } from 'react-router-dom'
import Article from './Article/Article'
import s from './Content.module.css'

const Content: React.FC = () => {
    return (
        <div className={ s.content }>
            <NavBar/>
            <Article>
                <Outlet/>
            </Article>
        </div>
    )
}

export default Content