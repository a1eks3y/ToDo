import express, { Router } from 'express';
import { UserModel } from "../models/User";
import * as shortid from "shortid";
import * as nodemailer from "nodemailer";
import * as config from "config";
import { check } from "express-validator";
import * as bcrypt from 'bcryptjs'
import { ReqChangePasswordConfirmBody, ReqChangePasswordSendMsgBody } from "../types/changePassword.routes";

const router = Router()



const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : config.get('email'),
        pass : config.get('password'),
    },
    from : config.get('email')
})
router.post('/send',
    async ( req: express.Request<any, any, ReqChangePasswordSendMsgBody>, res ) => {
        try {
            const RecoveryCode = shortid.generate()
            const user = await UserModel.findOneAndUpdate(
                { email : req.body.email },
                { RecoveryCode : RecoveryCode }
            )
            if ( !user ) return res.json({ message : 'We sent message if there was any account with this email.' })
            await user.save()
            await transporter.sendMail({
                from : config.get('email'),
                to : user.email,
                subject : 'Organizer project - Recovery password',
                text : `This is your recovery password code: ${ RecoveryCode }`,
                html : `<div>This is your recovery password code: ${ RecoveryCode }</div>`
            })
            return res.json({ message : 'We sent message if there was any account with this email.' })
        } catch (e) {
            return res.status(500).json({ message : e.message })
        }
    })
router.post('/confirm',
    check('password', 'Password must be at least 6 characters')
        .isLength({ min : 6, max : 18 }),
    async ( req: express.Request<any, any, ReqChangePasswordConfirmBody>, res ) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.newPassword, 12)
            const user = await UserModel.findOneAndUpdate(
                { email : req.body.email, RecoveryCode : req.body.RecoveryCode },
                { password : hashedPassword, RecoveryCode : null }
            )
            if ( !user ) return res.status(400).json({ message : 'Incorrect recovery password code.' })
            await user.save()
            return res.status(201).json({ message : 'Password changed successfully.' })
        } catch (e) {
            return res.status(500).json({ message : e.message })
        }
    })
export default router