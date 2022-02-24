//routes for user
import auth from '../middleware/auth'
import express, { Router } from 'express'
import { AuthMwResLocals } from '../types/auth.mw'
import { GroupModel } from '../models/Group'
import { ListModel } from '../models/List'
import { StepModel } from '../models/Step'
import { TaskModel } from '../models/Task'
import {
    changePositionReqBody,
    createStepReqBodyI,
    createTaskReqBodyI, deleteItemsI, deleteReqBody,
    renameItemsI,
    renameReqBody
} from '../types/for_authorized_users.routes'
import { Types } from 'mongoose'
import axios from 'axios'

const router = Router()

const objModels = {
    0 : GroupModel,
    1 : ListModel,
    2 : StepModel,
    3 : TaskModel
}

router.post('/change_position', auth,
    async (
        req: express.Request<any, any, changePositionReqBody>,
        res: express.Response<any, AuthMwResLocals>
    ) => {
        try {
            for ( let i = 0 ; i < 4 ; i++ ) {
                if ( !req.body[ i ] )
                    continue
                const ThisModel = objModels[ i ]
                const items = await ThisModel.find({ owner : res.locals.userId })

                for ( let x = 0 ; x < req.body[ i ].length ; x++ ) {
                    const id = req.body[ i ][ x ].id
                    let item_for_move
                    for ( let y = 0 ; y < items.length ; y++ ) {
                        if ( items[ y ]._id.toString() === id ) {
                            item_for_move = items[ y ]
                        }
                    }
                    if ( !item_for_move )
                        return res.status(200).json({ message : 'Sth wrong' })
                    if ( item_for_move.position === req.body[ i ][ x ].toPos )
                        continue
                    const fromPos = item_for_move.position
                    for ( let item of items ) {
                        if ( item._id.toString() !== req.body[ i ][ x ].id ) {
                            if ( fromPos > req.body[ i ][ x ].toPos
                                && item.position >= req.body[ i ][ x ].toPos && item.position < fromPos ) {
                                item.set('position', ++item.position)
                            } else if ( fromPos < req.body[ i ][ x ].toPos
                                && item.position > fromPos && item.position <= req.body[ i ][ x ].toPos ) {
                                item.set('position', --item.position)
                            }
                        } else {
                            item.set('position', req.body[ i ][ x ].toPos)
                        }
                    }
                }
                for ( let item of items ) {
                    await item.save()
                }
            }

            return res.status(201).json({ message : 'Ok' })
        } catch (e) {
            return res.status(500).json({ message : 'Something went wrong. Reloading page...' })
        }
    }
)

router.post('/rename', auth,
    async (
        req: express.Request<any, any, renameReqBody>,
        res: express.Response<any, AuthMwResLocals>
    ) => {
        try {
            for ( let i = 0 ; i < 4 ; i++ ) {
                if ( !req.body[ i ] ) continue

                const ThisModel = objModels[ i ]
                const items: renameItemsI = req.body[ i ]
                for ( let item of items ) {

                    await ThisModel.findByIdAndUpdate(item.id, { name : item.newName })

                }

            }
            return res.status(201)
        } catch (e) {
            return res.status(500)
        }
    }
)

router.post('/delete', auth,
    async (
        req: express.Request<any, any, deleteReqBody>,
        res: express.Response<any, AuthMwResLocals>
    ) => {
        try {
            for ( let i = 0 ; i < 4 ; i++ ) {
                if ( !req.body[ i ] ) continue

                const ThisModel = objModels[ i ]
                const items: deleteItemsI = req.body[ i ]
                for ( let item of items ) {
                    await ThisModel.findByIdAndDelete(item.id)
                }

            }
            return res.status(201)
        } catch (e) {
            return res.status(500)
        }
    }
)

//create routes
router.post('/create_group', auth,
    async ( req: express.Request<any, any, string>, res: express.Response<any, AuthMwResLocals> ) => {
        try {
            const groups = await GroupModel.find({ owner : res.locals.userId })
            const newGroup = new GroupModel({
                name : req.body,
                owner : res.locals.userId,
                position : groups.length
            })
            await newGroup.save()
            return res.status(201).json()
        } catch (e) {
            return res.status(500).json({ message : 'Something went wrong. Try again later...' })
        }
    }
)

router.post('/create_step', auth,
    async ( req: express.Request<any, any, createStepReqBodyI>, res: express.Response<any, AuthMwResLocals> ) => {
        try {
            const steps = await StepModel.find({ Task : req.body.Task_id })
            const newStep = new StepModel({
                name : req.body.name,
                position : steps.length,
                Task : req.body.Task_id,
                isCompleted : false
            })
            await newStep.save()

            res.status(201)
        } catch (e) {
            res.status(501)
        }
    }
)

router.post('/create_task', auth,
    async ( req: express.Request<any, any, createTaskReqBodyI>, res: express.Response<any, AuthMwResLocals> ) => {
        try {
            interface filterObjI {
                owner: Types.ObjectId,
                forList?: string
            }

            const filterObj: filterObjI = {
                owner : res.locals.userId
            }
            if ( req.body.forList )
                filterObj.forList = req.body.forList
            const tasks = await TaskModel.find(filterObj)
            const { data } = await axios.get('https://worldtimeapi.org/api/timezone/Europe/London')
            const newTask = new TaskModel({
                name : req.body.name,
                owner : res.locals.userId,
                createdAt : new Date(data.utc_datetime).toUTCString(),
                position : tasks.length
            })
            await newTask.save()

            return res.status(201)
        } catch (e) {
            return res.status(500)
        }

    }
)

export default router