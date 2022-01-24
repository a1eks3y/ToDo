import auth from "../middleware/auth"
import { EventModel } from "../models/Event"
import express, { Router } from "express"
import { check } from "express-validator"
import * as bcrypt from "bcryptjs";
import * as config from 'config'
import { deleteReq } from "../types/cleardb.routes";

const router = Router()



router.delete('/cleardb/coe', //Clear old events
    auth,
    check('maxDate').exists(),
    async ( req: express.Request<any, any, deleteReq>, res ) => {

        try {
            const isMatch = bcrypt.compare(req.body.adminPassword, config.get('adminHashedPassword'))
            if ( !isMatch ) return res.status(501).json({ message : 'wrong admin password' })

            const event = await EventModel.find({})
            if ( !event ) return res.status(501)

            const sortedEvent = event.filter(el => el.Date < req.body.maxDate)

            for ( const el of sortedEvent ) {
                await el.delete()
            }

            return res.status(200)
        } catch (e) {
            return res.status(501)
        }
    }
)
export default router