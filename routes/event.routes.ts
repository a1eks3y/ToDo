import express, { Router } from 'express'
import auth from '../middleware/auth'
import { EventModel } from "../models/Event";
import { check } from "express-validator";
import { CreateReq, getReq } from "../types/event.routes";
import { AuthMwResLocals } from "../types/auth.mw";


const router = Router()

router.get('/create', auth,
    check('Date').exists().isDate({ format : 'DD.MM.YYYY' }),
    check('name').exists(),
    check('description').exists(),
    async ( req: express.Request<any, any, CreateReq>, res ) => {
        try {
            const event = new EventModel({
                Date : req.body.Date,
                name : req.body.name,
                description : req.body.description
            })

            await event.save()

            return res.status(201).json({ message : 'Event created' })
        } catch (e) {
            return res.status(500).json({ message : 'Something went wrong' })
        }
    }
)
router.get('/', auth,
    async ( req: express.Request<getReq>, res: express.Response<any, AuthMwResLocals> ) => {
        try {
            const event = await EventModel.find({ owner : res.locals.userId })

            if ( !event ) return res.status(204).json({ message : 'No Content' })

            event.filter(el => {
                let check1 = false,
                    check2 = false
                if ( req.body.minDate )
                    if ( el.Date > req.body.minDate ) check1 = true
                if ( req.body.maxDate )
                    if ( el.Date < req.body.maxDate ) check2 = true
                return check1 && check2
            })

            if ( !event ) return res.status(204).json({ message : 'No Content' })


            return res.status(200).json(event)
        } catch (e) {
            return res.status(500).json({ message : 'Something went wrong' })
        }
    }
)
router.get('/:id', auth,
    async ( req, res: express.Response<any, AuthMwResLocals> ) => {
        try {
            const event = await EventModel.findById(req.params.id).findOne({ owner : res.locals.userId })
            if ( !event ) return res.status(204).json({ message : 'No Content' })


            return res.status(200).json(event)
        } catch (e) {
            return res.status(500).json({ message : 'Something went wrong' })
        }
    }
)
router.delete('/:id', auth,
    async ( req, res: express.Response<any, AuthMwResLocals> ) => {
        try {
            const event = await EventModel.findById(req.params.id).findOneAndDelete({ owner : res.locals.userId })
            if ( !event ) return res.status(204).json({ message : 'No Content' })

            return res.status(200).json({ message : 'Event deleted' })
        } catch (e) {
            return res.status(500).json({ message : 'Something went wrong' })
        }
    }
)
export default router