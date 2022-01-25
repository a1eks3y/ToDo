import * as React from 'react'
import { useAction } from "./hooks/useAction";
import { useEffect } from "react";
import { useTypedSelector } from "./hooks/useTypedSelector";

const App: React.FC = () => {
    const { AuthLoginJWTAction } = useAction()
    const isAuth = useTypedSelector(state => state.auth.auth)
    useEffect(() => {
        if ( localStorage.getItem('userData') && !isAuth )
            AuthLoginJWTAction()
    }, [])
    return (
        <div>
            Hello!
        </div>
    )
}

export default App