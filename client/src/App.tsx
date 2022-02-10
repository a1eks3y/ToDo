import * as React from 'react'
import { useAction } from "./hooks/useAction";
import { useCallback, useEffect } from "react";
import { useTypedSelector } from "./hooks/useTypedSelector";
import Messages from "./Components/Messages/Messages";
import Loader from "./Components/Loader/Loader";
import LoginPage from "./Components/AuthPage/LoginPage/LoginPage";
import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from "./Components/AuthPage/AuthPage";
import RegisterPage from "./Components/AuthPage/RegisterPage/RegisterPage";
import ConfirmEmailPage from "./Components/UserPages/ConfirmEmailPage/ConfirmEmailPage";
import Content from "./Components/UserPages/Content/Content";
import ForgotPasswordPage from "./Components/AuthPage/ForgotPasswordPage/ForgotPasswordPage";
import SendMessage from "./Components/AuthPage/ForgotPasswordPage/SendMessage/SendMessage";
import UpdatePassword from "./Components/AuthPage/ForgotPasswordPage/UpdatePassword/UpdatePassword";

const App: React.FC = () => {
    const { AuthLoginJWTAction } = useAction()
    const { isAuth, isLoading, userData } = useTypedSelector(state => state.auth)
    const LoginJWT = useCallback(() => {
        if ( localStorage.getItem('jwt') && !isAuth && !isLoading ) try {
            AuthLoginJWTAction()
        } catch (e) {
            localStorage.removeItem('jwt')
        }
    }, [AuthLoginJWTAction, isAuth, isLoading])
    useEffect(() => {
        LoginJWT()
    }, [LoginJWT])
    return (
        <>
            <Messages/>
            { isLoading && <Loader width={ '100vw' } height={ '100vh' }/> }
            <Routes>
                { !isLoading &&
                    (!isAuth && !userData
                            ?
                            <>
                                <Route path='/*' element={ <AuthPage/> }>
                                    <Route path='login' element={ <LoginPage/> }/>
                                    <Route path='register' element={ <RegisterPage/> }/>
                                    <Route path='forgot_password' element={ <ForgotPasswordPage/> }>
                                        <Route path='send_msg' element={ <SendMessage/> }/>
                                        <Route path='update_password' element={ <UpdatePassword/> }/>
                                        <Route path='*' element={ <Navigate to='send_msg'/> }/>
                                    </Route>
                                    <Route path='*' element={ <Navigate to='/login'/> }/>
                                </Route>
                            </>

                            :
                            (
                                userData && !userData.emailConfirmed
                                    ?
                                    <>
                                        <Route path='/confirm-email' element={ <ConfirmEmailPage/> }/>
                                        <Route path='*' element={ <Navigate to='/confirm-email'/> }/>
                                    </>
                                    :

                                    <>
                                        <Route path='/' element={ <Content/> }>
                                            {/*  Some routes  */ }
                                            <Route path='*' element={ <Navigate to='/'/> }/>
                                        </Route>
                                        <Route path='*' element={ <Navigate to='/'/> }/>
                                    </>

                            )
                    )
                }

            </Routes>

            {/*<button className='btn' onClick={ () => AuthRegisterAction({*/ }
            {/*    email : 'alesha1shvets@yandex.ru',*/ }
            {/*    Timezone : 3,*/ }
            {/*    password : '123456',*/ }
            {/*    username : 'alesha'*/ }
            {/*}) }>*/ }
            {/*    Create acc*/ }
            {/*</button>*/ }
        </>
    )
}

export default App