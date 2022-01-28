import * as React from 'react'
import { useAction } from "./hooks/useAction";
import { useEffect } from "react";
import { useTypedSelector } from "./hooks/useTypedSelector";
import Messages from "./Components/Messages/Messages";
import Loader from "./Components/Loader/Loader";

const App: React.FC = () => {
    const { AuthLoginJWTAction, AuthRegisterAction } = useAction()
    const { isAuth, isLoading } = useTypedSelector(state => state.auth)
    useEffect(() => {
        if ( localStorage.getItem('userData') && !isAuth ) try {
            AuthLoginJWTAction()
        } catch (e) {
            localStorage.removeItem('userData')
        }
    }, [isAuth])
    return (
        <>
            <Messages/>
            { isLoading && <Loader width={ '100vw' } height={ '100vh' }/> }
            <div>
                Hello!
            </div>
            <button className='btn' onClick={ () => AuthRegisterAction({
                email : 'alesha1shvets@yandex.ru',
                Timezone : 3,
                password : '123456',
                username : 'alesha'
            }) }>
                Create acc
            </button>
        </>
    )
}

export default App