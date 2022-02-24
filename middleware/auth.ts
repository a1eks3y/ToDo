import * as jwt from 'jsonwebtoken'
import * as config from 'config'
import express from 'express'
import { AuthMwResLocals } from '../types/auth.mw'

const jwtSecret: string = config.get('jwtSecret')

export default ( req: express.Request, res: express.Response<any, AuthMwResLocals>, next: express.NextFunction ) => {
    if ( req.method === 'OPTIONS' ) return next()

    try {
        const token = req.headers.authorization?.split(' ')[ 1 ]
        if ( !token ) return res.status(401).json({ message : 'You must be login to do this' })
        let { userId } = jwt.verify(
            token,
            jwtSecret
        )
        res.locals.userId = userId
        next()
    } catch (e) {
        return res.status(401).json({ message : 'jwt expired' })
    }
}