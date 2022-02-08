import express, { Router } from "express";
import { UserModel } from "../models/User";
import auth from "../middleware/auth";
import * as nodemailer from "nodemailer";
import * as config from "config";
import { AuthMwResLocals } from "../types/auth.mw";

const router = Router()

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : config.get('email'),
        pass : config.get('password'),
    },
    from : config.get('email')
})

router.post('/send', auth,
    async ( _req,
            res: express.Response<any, AuthMwResLocals> ) => {
        try {
            const user = await UserModel.findById(res.locals.userId)
            if(!user) return res.status(404).json({message: 'User not found.'})
            const confirmEmailUrl = `${ config.get('baseUrl') }/api/confirmEmail/${ user.ConfirmEmail }`
            await transporter.sendMail({
                from : config.get('email'),
                to : user.email,
                subject : 'Organizer project - Confirm email',
                text : `Click on this link to confirm email ${ confirmEmailUrl }`,
                html : `<div>Click on this 
                            <b><a href="${ confirmEmailUrl }">link</a></b>
                            to confirm email
                        </div>`
            })
            return res.status(200).json({message: 'The message has been sent.'})
        } catch (e) {
            return res.status(501).json({message: 'Something went wrong. Try again later...'})
        }
    })
router.get('/:id',
    async ( req, res ) => {
        try {
            const user = await UserModel.findOneAndUpdate(
                { ConfirmEmail : req.params.id },
                { ConfirmEmail : null }
            )
            if ( !user ) return res.status(404).json({ message : 'Page not found' })

            await user.save()
            return res.redirect('http://localhost:3000/') //TODO change url when prod
        } catch (e) {
            return res.status(404).json({ message : 'Page not found' })
        }
    }
)

export default router