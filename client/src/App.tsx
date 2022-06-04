import * as React from 'react'
import { useCallback, useEffect } from 'react'
import './App.css'
import { useAction } from './hooks/useAction'
import { useTypedSelector } from './hooks/useTypedSelector'
import Messages from './Components/Messages/Messages'
import Loader from './Components/Loader/Loader'
import LoginPage from './Pages/AuthPages/LoginPage/LoginPage'
import { Navigate, Route, Routes } from 'react-router-dom'
import AuthPagesWrapper from './Pages/AuthPages/AuthPagesWrapper'
import RegisterPage from './Pages/AuthPages/RegisterPage/RegisterPage'
import ConfirmEmailPage from './Pages/UserPages/ConfirmEmailPage/ConfirmEmailPage'
import MainPage from './Pages/UserPages/MainPage/MainPage'
import ForgotPasswordPages from './Pages/AuthPages/ForgotPasswordPages/ForgotPasswordPages'
import SendMessage from './Pages/AuthPages/ForgotPasswordPages/SendMessage/SendMessage'
import UpdatePasswordPage from './Pages/AuthPages/ForgotPasswordPages/UpdatePassword/UpdatePasswordPage'
import MyDay from './Pages/UserPages/MainPage/parts/Main/MyDay/MyDay'
import Favourites from './Pages/UserPages/MainPage/parts/Main/Favourites/Favourites'
import Completed from './Pages/UserPages/MainPage/parts/Main/Completed/Completed'
import All from './Pages/UserPages/MainPage/parts/Main/All/All'
import Planned from './Pages/UserPages/MainPage/parts/Main/Planned/Planned'
import Tasks from './Pages/UserPages/MainPage/parts/Main/Tasks/Tasks'
import CustomList from './Pages/UserPages/MainPage/parts/Main/CustomList/CustomList'

const App: React.FC = () => {
    const { AuthLoginJWTAction } = useAction()
    const { isAuth, isLoading, userData } = useTypedSelector(state => state.auth)
    const { lists } = useTypedSelector(state => state.todoUserData)
    const LoginJWT = useCallback(() => {
        if ( localStorage.getItem('jwt') && !isAuth && !isLoading )
            try {
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
                { isLoading &&
                    <Route path="/login" element={ null }/> } {/*fix error - No routes matched location "/login"*/ }
                { !isLoading &&
                    (!isAuth && !userData
                            ?
                            <>
                                <Route path="/*" element={ <AuthPagesWrapper/> }>
                                    <Route path="login" element={ <LoginPage/> }/>
                                    <Route path="register" element={ <RegisterPage/> }/>
                                    <Route path="forgot_password" element={ <ForgotPasswordPages/> }>
                                        <Route path="send_msg" element={ <SendMessage/> }/>
                                        <Route path="update_password" element={ <UpdatePasswordPage/> }/>
                                        <Route path="*" element={ <Navigate to="send_msg"/> }/>
                                    </Route>
                                    <Route path="*" element={ <Navigate to="login"/> }/>
                                </Route>
                            </>
                            :
                            (
                                userData && !userData.emailConfirmed
                                    ?
                                    <>
                                        <Route path="/confirm-email" element={ <ConfirmEmailPage/> }/>
                                        <Route path="*" element={ <Navigate replace to="/confirm-email"/> }/>
                                    </>
                                    :
                                    <>
                                        <Route path="/*" element={ <MainPage/> }>
                                            <Route path="MyDay"
                                                   element={ <MyDay/> }/>
                                            <Route path="Favourites" element={ <Favourites/> }/>
                                            <Route path="All" element={ <All/> }/>
                                            <Route path="Completed" element={ <Completed/> }/>
                                            <Route path="Planned" element={ <Planned/> }/>
                                            <Route path="Tasks" element={ <Tasks/> }/>
                                            {
                                                lists.map(( { _id, name } ) => (
                                                    <Route key={ _id }
                                                           path={ _id }
                                                           element={ <CustomList name={ name } _id={ _id }/> }/>
                                                ))
                                            }
                                            <Route path="*" element={ <Navigate to="MyDay"/> }/>
                                        </Route>
                                    </>
                            )
                    )
                }
            </Routes>
        </>
    )
}

export default App