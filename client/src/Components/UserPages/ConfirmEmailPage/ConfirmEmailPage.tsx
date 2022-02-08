import * as React from 'react'
import s from './ConfirmEmailPage.module.css'
import { useEffect, useState } from "react";
import { useAction } from "../../../hooks/useAction";
import { useDispatch } from "react-redux";
import { IAuthAction, IUserData } from "../../../types/Auth";
import { Dispatch } from "redux";
import axios from "axios";

const ConfirmEmailPage: React.FC = () => {
    const { AuthLogoutActionCreator } = useAction()
    const dispatch = useDispatch<Dispatch<IAuthAction>>()
    const [isDisabled, setIsDisabled] = useState<boolean>(false)
    const [btnTimeout, setBtnTimeout] = useState<number>(0)
    const sendMsgHandler = async () => {
        setIsDisabled(true)
        try {
            const userData = localStorage.getItem('userData')
            if ( !userData ) throw new Error()
            const { jwt } = JSON.parse(userData) as IUserData
            await axios.post('/api/confirmEmail/send', null, {
                headers : {
                    Authorization : `Bearer ${ jwt }`
                }
            })
            setBtnTimeout(45)
        } catch {
            setBtnTimeout(15)
        }
    }
    useEffect(() => {
        setTimeout(() => setBtnTimeout(prev => {
            if ( prev > 0 ) {
                return --prev
            }
            else {
                setIsDisabled(false)
                return prev
            }
        }), 1000)
    }, [btnTimeout])
    const logoutHandler = () => {
        localStorage.removeItem('userData')
        dispatch(AuthLogoutActionCreator())
    }
    return (
        <div className={ s.wrapper }>
            <h2>Email confirmation is expected</h2>
            <span>
                A confirmation email has been sent to your email.<br/>
                Click on the confirmation link in the email to activate your account.<br/>
            </span>
            { !!btnTimeout && <h6 className={ s.waitTime }>Wait { btnTimeout }s</h6> }
            <div className={ s.buttons }>
                <button disabled={ isDisabled } onClick={ sendMsgHandler } className={ s.btn_send }>Send confirmation
                    again
                </button>
                <button onClick={ logoutHandler } className={ s.btn_logout }>Log out</button>
            </div>
        </div>
    )
}

export default ConfirmEmailPage