import express, { Router } from 'express'
import { check, validationResult } from 'express-validator'
import { UserModel } from "../models/User";
import * as bcrypt from "bcryptjs"
import * as jwt from 'jsonwebtoken'
import * as config from 'config'
import * as shortid from 'shortid';
import auth from "../middleware/auth";
import * as nodemailer from 'nodemailer'
import { EventModel } from "../models/Event";
import { deleteReqBody, loginReq, registerReq } from "../types/auth.routes";
import { AuthMwResLocals } from "../types/auth.mw";

const router = Router()
const jwtToken: string = config.get('jwtSecret')

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : config.get('email'),
        pass : config.get('password'),
    },
    from : config.get('email')
})

router.post('/register',
    check('email', 'Incorrect email').isEmail().normalizeEmail(),
    check('password', 'Password must be at least 6 characters')
        .isLength({ min : 6, max : 18 }),
    check('username', 'Username must be at least 5 characters')
        .isLength({ min : 5, max : 18 }),
    check('Timezone').exists(),
    async ( req: express.Request<any, any, registerReq>, res ) => {
        try {
            const errors = validationResult(req)
            if ( !errors.isEmpty() ) {
                return res.status(400).json(
                    { errors : errors.array(), message : 'Invalid data at registration.' }
                )
            }

            const { email, password, username, Timezone } = req.body
            const candidate = await UserModel.findOne({ email : email })
            if ( candidate ) {
                return res.status(400).json({ message : "User already exist." })
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const ConfirmEmail = shortid.generate()
            const user = new UserModel({
                email,
                password : hashedPassword,
                RecoveryCode : null,
                username,
                Timezone,
                ConfirmEmail
            })
            const confirmEmailUrl = `${ config.get('baseUrl') }/api/confirmEmail/${ ConfirmEmail }`
            await transporter.sendMail({
                from : config.get('email'),
                to : email,
                subject : 'Organizer project - Confirm email',
                text : `Click on this link to confirm email ${ confirmEmailUrl }`,
                html : `<div>Click on this 
                            <b><a href="${ confirmEmailUrl }">link</a></b>
                            to confirm email
                        </div>`
            })
            const token = jwt.sign(
                { userId : user?.id },
                jwtToken,
                { expiresIn : '5h' }
            )

            await user.save()


            return res.status(201).json(
                {
                    token,
                    username,
                    Timezone,
                    message : 'User created.',
                    emailConfirmed : user.ConfirmEmail === null,
                    email
                }
            )
        } catch (e) {
            return res.status(500).json({ message : e.message })
        }
    }
)
router.post('/login/form',
    check('email').normalizeEmail(),
    check('password').exists(),
    async ( req: express.Request<any, any, loginReq>, res ) => {
        try {
            const user = await UserModel.findOne({ email : req.body.email })
            if ( !user ) {
                return res.status(400).json({ message : "User not found." })
            }
            const isMatch = await bcrypt.compare(req.body.password, user.password)
            if ( !isMatch ) return res.status(400).json({ message : 'User not found.' })

            if ( typeof user.ConfirmEmail === 'string' ) {
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
                res.status(409).json(
                    {
                        message : 'You must confirm email. If you can\'t found letter then check the Spam folder...'
                    }
                )
            }
            const token = jwt.sign(
                { userId : user?.id },
                jwtToken,
                { expiresIn : '5h' }
            )

            return res.status(200).json(
                {
                    token,
                    Timezone : user.Timezone,
                    username : user.username,
                    emailConfirmed : user.ConfirmEmail === null,
                    email : user.email
                }
            )
        } catch (e) {
            return res.status(500).json({ message : 'Try again later...' })
        }
    }
)
router.post('/login/jwt', auth,
    async ( _req,
            res: express.Response<any, AuthMwResLocals> ) => {
        try {
            const user = await UserModel.findById(res.locals.userId)
            if ( !user ) return res.status(400).json({ message : 'User not found.' })

            if ( typeof user.ConfirmEmail == 'string' ) {
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

                return res.status(409).json(
                    {
                        message : 'You must confirm email. If you can\'t found letter then check the Spam folder...'
                    }
                )
            }
            const token = jwt.sign(
                { userId : res.locals.userId },
                jwtToken,
                { expiresIn : '5h' }
            )

            return res.status(200).json({
                jwt: token,
                username : user.username,
                Timezone : user.Timezone,
                emailConfirmed : user.ConfirmEmail === null,
                email : user.email
            })
        } catch (e) {
            return res.status(500).json({ message : 'Try again later...' })
        }
    })
router.delete('/user',
    auth,
    check('password').exists(),
    async ( req: express.Request<any, any, deleteReqBody>,
            res: express.Response<any, AuthMwResLocals> ) => {
        try {

            const user = await UserModel.findById(res.locals.userId)
            if ( !user ) return res.status(400).json({ message : 'User not found.' })

            const isMatch = await bcrypt.compare(req.body.password, user.password)
            if ( !isMatch ) return res.status(400).json({ message : 'Wrong password.' })

            const event = await EventModel.find({ owner : res.locals.userId })

            if ( event )
                for ( const el of event ) {
                    await el.delete().catch(err => console.log(err))
                }


            await user.delete()

            return res.status(201).json({ message : 'User deleted.' })
        } catch (e) {
            return res.status(500).json({ message : 'Try again later...' })
        }
    }
)

export default router