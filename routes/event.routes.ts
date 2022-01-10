import express, {Router} from 'express'
import auth from '../middleware/auth'
import {EventModel} from "../models/Event";
import {check} from "express-validator";


const router = Router()

interface Req extends express.Request {
    user: {
        userId: string
    }
}

interface getReq extends Req {
    body: {
        minDate?: number,
        maxDate?: number
    }
}

interface CreateReq extends Req {
    body: {
        Date: Date,
        name: String,
        description: String
    }
}

router.get('/create', auth,
    check('Date').exists().isDate({format: 'DD.MM.YYYY'}),
    check('name').exists(),
    check('description').exists(),
    async (req: CreateReq, res) => {
        try {
            const event = new EventModel({
                Date: req.body.Date,
                name: req.body.name,
                description: req.body.description
            })

            await event.save()

            return res.status(201).json({message: 'Event created'})
        } catch (e) {
            return res.status(500).json({message: 'Something went wrong'})
        }
    }
)
router.get('/', auth,
    async (req: getReq, res) => {
        try {
            const event = await EventModel.find({owner: req.user.userId})

            if (!event) return res.status(204).json({message: 'No Content'})

            event.filter(el => {
                let check1 = false,
                    check2 = false
                // @ts-ignore
                if (req.body.minDate)
                    if (el.Date > req.body.minDate) check1 = true
                if (req.body.maxDate)
                    if (el.Date < req.body.maxDate) check2 = true
                return check1 && check2
            })

            if (!event) return res.status(204).json({message: 'No Content'})


            return res.status(200).json(event)
        } catch (e) {
            return res.status(500).json({message: 'Something went wrong'})
        }
    }
)
router.get('/:id', auth,
    async (req: Req, res) => {
        try {
            const event = await EventModel.findById(req.params.id).findOne({owner: req.user.userId})
            if (!event) return res.status(204).json({message: 'No Content'})


            return res.status(200).json(event)
        } catch (e) {
            return res.status(500).json({message: 'Something went wrong'})
        }
    }
)
router.delete('/:id', auth,
    async (req: Req, res) => {
        try {
            const event = await EventModel.findById(req.params.id).findOneAndDelete({owner: req.user.userId})
            if (!event) return res.status(204).json({message: 'No Content'})


            return res.status(200).json({message: 'Event deleted'})
        } catch (e) {
            return res.status(500).json({message: 'Something went wrong'})
        }
    }
)


export default router