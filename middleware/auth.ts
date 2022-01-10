import * as jwt from 'jsonwebtoken'
import * as config from 'config'
import express from 'express'
const jwtSecret: string = config.get('jwtSecret')
interface authReq extends express.Request{
    user: {
        userId: string
    } | string | jwt.JwtPayload
}

export default (req: authReq, res: express.Response, next: express.NextFunction) => {
    if( req.method === 'OPTIONS') return next()

    try{
        const token = req.headers.authorization?.split(' ')[1]
        if(!token) return res.status(401).json({message: 'You must be login to do this'})
        req.user = jwt.verify(
            token,
            jwtSecret
        )
        next()
    } catch(e){
        return res.status(401).json({message: 'jwt expired'})
    }
}