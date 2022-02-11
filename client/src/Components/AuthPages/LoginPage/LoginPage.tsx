import * as React from 'react'
import s from './LoginPage.module.css'
import { NavLink } from 'react-router-dom'
import { SyntheticEvent, useState } from "react";
import { useAction } from "../../../hooks/useAction";

const LoginPage: React.FC = () => {
    const {AuthLoginFormAction} = useAction()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const loginHandler = (e: SyntheticEvent) => {
        e.preventDefault()
        AuthLoginFormAction({ email, password })
    }
    return (
        <div className={ s.loginPage }>
            <h4>Hello!</h4>
            <h6>Sign in with your credentials or<br/>create a new account</h6>
            <form onSubmit={ loginHandler } autoComplete='login-form'>
                <input
                    value={ email }
                    onChange={ e => setEmail(e.target.value) }
                    className={ s.email_input }
                    required
                    autoComplete='current-email'
                    type="email" placeholder='Email address'/>
                <input
                    value={ password }
                    onChange={ e => setPassword(e.target.value) }
                    required
                    autoComplete='current-password'
                    type="password" placeholder='Password'/>
                <div className={ s.links }>
                    <div className={ s.login_and_forgot }>
                        <button className={ s.custom_btn } type="submit">Login</button>
                        <NavLink className={ s.forgot_navlink } to='/forgot_password'>
                            Forgot password?
                        </NavLink>
                    </div>
                    <div className={ s.register }>
                        Still without account?&nbsp;
                        <NavLink to='/register'>Create one</NavLink>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default LoginPage
