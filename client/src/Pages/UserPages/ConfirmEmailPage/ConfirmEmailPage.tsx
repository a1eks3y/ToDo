import * as React from 'react'
import s from './ConfirmEmailPage.module.css'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { IAuthAction } from '../../../types/Auth'
import { Dispatch } from 'redux'
import axios from 'axios'
import { emailConfirmedActionCreator, logoutActionCreator } from '../../../store/actionsCreator/authActionCreator'

const ConfirmEmailPage: React.FC = () => {
    const dispatch = useDispatch<Dispatch<IAuthAction>>()
    const [isDisabled, setIsDisabled] = useState<boolean>(false)
    const [btnTimeout, setBtnTimeout] = useState<number>(0)
    const confirmEmail = async () => {
        setIsDisabled(true)
        try {
            const jwt = localStorage.getItem('jwt')
            if ( !jwt ) throw new Error()
            await axios.get('/api/confirmEmail/confirm_root', {
                headers : {
                    Authorization : `Bearer ${ jwt }`
                }
            })
            setIsDisabled(false)
            dispatch(emailConfirmedActionCreator())
        } catch (e) {
            console.log(e)
            setIsDisabled(false)
        }
    }
    const sendMsgHandler = async () => {
        setIsDisabled(true)
        try {
            const jwt = localStorage.getItem('jwt')
            if ( !jwt ) throw new Error()

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
            } else {
                setIsDisabled(false)
                return prev
            }
        }), 1000)
    }, [btnTimeout])
    const logoutHandler = () => {
        localStorage.removeItem('userData')
        dispatch(logoutActionCreator())
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
                <button className={ s.orange_btn } onClick={ confirmEmail }>I don't want to confirm</button>
                <button disabled={ isDisabled } onClick={ sendMsgHandler } className={ s.btn_send }>Send confirmation
                    again
                </button>
                <button onClick={ logoutHandler } className={ s.orange_btn }>Log out</button>
            </div>
        </div>
    )
}

export default ConfirmEmailPage