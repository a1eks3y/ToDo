import * as React from 'react'
import s from "./ForgotPasswordPage.module.css";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import {
    addMessageActionCreator,
    willBeDeletedMessageActionCreator
} from "../../../store/actionsCreator/messageActionCreator";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { MessageAction } from "../../../types/Message";

const ForgotPasswordPage: React.FC = () => {
    const dispatch = useDispatch<Dispatch<MessageAction>>()
    const navigate = useNavigate()
    const [email, setEmail] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const sendRecoveryCode = async () => {
        const id = new Date().getTime()
        try {
            setIsLoading(true)
            const res = await axios.post('/api/recover_password/send', { email })
            dispatch(addMessageActionCreator(id,
                res.data.message,
                false)
            )
            setTimeout(() => {
                dispatch(willBeDeletedMessageActionCreator(id))
            }, 6000)
            navigate('update_password')
        } catch (e: any) {
            console.log(e)
            dispatch(addMessageActionCreator(id,
                (e && (e.message || e.data.message))
                || 'Something went wrong. Try again later...',
                true)
            )
            setTimeout(() => {
                dispatch(willBeDeletedMessageActionCreator(id))
            }, 6000)
        } finally {
            if ( !isLoading ) setIsLoading(false)
        }
    }
    const UpdatePassword = async ( password: string, RecoveryCode: string ) => {
        const id = new Date().getTime()
        try {
            debugger
            setIsLoading(true)
            const res = await axios.post('/api/recover_password/confirm',
                { email, newPassword : password, RecoveryCode })
            debugger
            dispatch(addMessageActionCreator(id,
                res.data.message,
                false)
            )
            setTimeout(() => {
                dispatch(willBeDeletedMessageActionCreator(id))
            }, 6000)
            navigate('/login', { replace : true })
        } catch (e: any) {
            console.log(e)
            dispatch(addMessageActionCreator(id,
                (e && e.response && e.response.data.message)
                || 'Something went wrong. Try again later...',
                true)
            )
            setTimeout(() => {
                dispatch(willBeDeletedMessageActionCreator(id))
            }, 6000)
            setIsLoading(false)
        }
    }
    return (
        <div className={ s.loginPage }>
            <Outlet context={ { email, setEmail, sendRecoveryCode, isLoading, UpdatePassword } }/>

        </div>
    )
}

export default ForgotPasswordPage