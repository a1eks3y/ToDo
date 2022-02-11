import * as React from 'react'
import s from "./RegisterPage.module.css";
import { NavLink } from "react-router-dom";
import { FormEventHandler, useState } from "react";
import { useAction } from "../../../hooks/useAction";


const RegisterPage: React.FC = () => {
    const { AuthRegisterAction } = useAction()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [timezone, setTimezone] = useState<string>(() => {
            const timezoneOffset = (-(new Date().getTimezoneOffset()) / 60).toString().split('.')
            let firstPart = (+timezoneOffset[ 0 ] > 0 ?
                    '+' + timezoneOffset[ 0 ]
                    :
                    '-' + (-1) * +timezoneOffset[ 0 ]).toString(),
                secondPart = timezoneOffset[ 2 ] ? +timezoneOffset[ 2 ] * 60 : '00'
            firstPart = firstPart.length > 2 ?
                firstPart
                :
                firstPart.split('')[ 0 ] + '0' + firstPart.split('')[ 1 ]
            return firstPart + ':' + secondPart // get default timezone from PC timezone
        }
    )
    const registerHandler: FormEventHandler = ( e ) => {
        e.preventDefault()
        const Timezone: number = timezone[ 0 ] === '-' ? //parse Timezone
            +timezone.split(':')[ 0 ] - +timezone.split(':')[ 1 ] / 60
            : +timezone.split(':')[ 0 ] + +timezone.split(':')[ 1 ] / 60
        AuthRegisterAction({
            email,
            password,
            username,
            Timezone
        })
    }
    return (
        <div className={ s.registerPage }>
            <h4>Sign up</h4>
            <h6>Create an account to use Organizer<br/>
                <span className={ s.text_span }>without limits</span>. For free.</h6>
            <form onSubmit={ registerHandler } autoComplete='register-form'>
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
                    className={ s.password_input }
                    required
                    autoComplete='current-password'
                    type="password" placeholder='Password'/>
                <input
                    value={ username }
                    onChange={ e => setUsername(e.target.value) }
                    required
                    autoComplete='current-username'
                    type="text" placeholder='Username'/>
                <label htmlFor='timezone' className={s.timezone_label}>Choose timezone:</label>
                <select id='timezone' name='timezone' value={ timezone }
                        onChange={ e => setTimezone(e.target.value) } className={ s.timezone }>
                    <option value='-12:00'>UTC-12:00</option>
                    <option value='-11:00'>UTC-11:00</option>
                    <option value='-10:00'>UTC-10:00</option>
                    <option value='-09:30'>UTC-09:30</option>
                    <option value='-09:00'>UTC-09:00</option>
                    <option value='-08:00'>UTC-08:00</option>
                    <option value='-07:00'>UTC-07:00</option>
                    <option value='-06:00'>UTC-06:00</option>
                    <option value='-05:00'>UTC-05:00</option>
                    <option value='-04:00'>UTC-04:00</option>
                    <option value='-03:30'>UTC-03:30</option>
                    <option value='-03:00'>UTC-03:00</option>
                    <option value='-02:00'>UTC-02:00</option>
                    <option value='-01:00'>UTC-01:00</option>
                    <option value='00:00'>UTC&#177;00:00</option>
                    <option value='+01:00'>UTC+01:00</option>
                    <option value='+02:00'>UTC+02:00</option>
                    <option value='+03:00'>UTC+03:00</option>
                    <option value='+03:30'>UTC+03:30</option>
                    <option value='+04:00'>UTC+04:00</option>
                    <option value='+04:30'>UTC+04:30</option>
                    <option value='+05:00'>UTC+05:00</option>
                    <option value='+05:30'>UTC+05:30</option>
                    <option value='+05:45'>UTC+05:45</option>
                    <option value='+06:00'>UTC+06:00</option>
                    <option value='+06:30'>UTC+06:30</option>
                    <option value='+07:00'>UTC+07:00</option>
                    <option value='+08:00'>UTC+08:00</option>
                    <option value='+08:45'>UTC+08:45</option>
                    <option value='+09:00'>UTC+09:00</option>
                    <option value='+09:30'>UTC+09:30</option>
                    <option value='+10:00'>UTC+10:00</option>
                    <option value='+10:30'>UTC+10:30</option>
                    <option value='+11:00'>UTC+11:00</option>
                    <option value='+12:00'>UTC+12:00</option>
                    <option value='+12:45'>UTC+12:45</option>
                    <option value='+13:00'>UTC+13:00</option>
                    <option value='+14:00'>UTC+14:00</option>
                </select>
                <div className={ s.links }>
                    <div className={ s.register_btn_wrapper }>
                        <button className={ s.custom_btn } onSubmit={ registerHandler } type="submit">Register</button>
                    </div>
                    <div className={ s.toLoginPage }>
                        I already have an account.&nbsp;
                        <NavLink to='/login'>Login</NavLink>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default RegisterPage