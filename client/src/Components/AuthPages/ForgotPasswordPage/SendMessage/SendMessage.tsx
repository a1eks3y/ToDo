import * as React from 'react'
import { NavLink, useOutletContext } from "react-router-dom";
import s from './SendMessage.module.css'
import { FormEvent } from "react";
import Loader from "../../../Loader/Loader";

interface IUseOutletContext {
    email: string,
    setEmail: React.Dispatch<React.SetStateAction<string>>,
    sendRecoveryCode: () => void,
    isLoading: boolean
}

const SendMessage: React.FC = () => {
    const { email, setEmail, isLoading, sendRecoveryCode } = useOutletContext() as IUseOutletContext
    const onSubmitHandler = ( e: FormEvent<HTMLFormElement> ) => {
        e.preventDefault()
        sendRecoveryCode()
    }
    return (
        <div>
            { isLoading && <Loader width={ '100%' } height={ '40%' }/> }
            <div className={ s.top_text }>
                <h4>Reset your password</h4>
                <h6>Click on button below to do this</h6>
            </div>
            <form autoComplete={'on'} className={ s.form } onSubmit={ onSubmitHandler }>
                <input
                    value={ email }
                    onChange={ e => setEmail(e.target.value) }
                    disabled={ isLoading }
                    required
                    minLength={ 1 }
                    autoComplete='current-email'
                    type="email" placeholder='Email address'/>
                <button
                    className={ s.custom_btn }
                    disabled={ isLoading }
                >
                    Send code
                </button>
                <div className={s.navigate_to_login}>
                    Remembered the password?&nbsp;
                    <NavLink className={s.navLink} to={'/../login'} replace>Login</NavLink>
                </div>
            </form>
        </div>
    )
}

export default SendMessage