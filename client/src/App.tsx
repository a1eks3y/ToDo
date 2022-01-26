import * as React from 'react'
import { useAction } from "./hooks/useAction";
import { useEffect } from "react";
import { useTypedSelector } from "./hooks/useTypedSelector";

const App: React.FC = () => {
    const { AuthLoginJWTAction, AuthRegisterAction } = useAction()
    const isAuth = useTypedSelector(state => state.auth.auth)
    useEffect(() => {
        if ( localStorage.getItem('userData') && !isAuth )
            AuthLoginJWTAction()
    })
    return (
        <div onClick={() => {
            AuthRegisterAction({
                email: 'alesha1shvets@yandex.ru',
                Timezone: 3,
                password: '123456',
                username: 'alesha'
            })
        }}>
            Hello!
        </div>
    )
}

export default App