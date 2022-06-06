//routes for user
import auth from '../middleware/auth'
import express, { Router } from 'express'
import { AuthMwResLocals } from '../types/auth.mw'
import { GroupModel } from '../models/Group'
import { ListModel } from '../models/List'
import { StepModel } from '../models/Step'
import { TaskModel } from '../models/Task'
import {
    changeDataReqBody,
    changePositionReqBody,
    completeReqBody,
    createReqBody,
    deleteReqBody,
    TaskMoveType
} from '../types/for_authorized_users.routes'
import { Types } from 'mongoose'

const router = Router()

router.get('/get_all', auth,
    async (
        _req,
        res: express.Response<any, AuthMwResLocals>
    ) => {
        try {
            let groups = (await (GroupModel.find({ owner : res.locals.userId }))).map(
                ( { _id, name, position } ) => ({
                    _id,
                    name,
                    position
                })
            )
            const lists = (await ListModel.find({ owner : res.locals.userId })).map(
                ( { name, position, _id, forGroup } ) => ({
                    _id,
                    name,
                    position,
                    forGroup
                })
            )
            const steps = (await StepModel.find({ owner : res.locals.userId })).map(
                ( { _id, name, position, forTask, isCompleted } ) => ({
                    _id,
                    name,
                    position,
                    forTask,
                    isCompleted
                })
            )
            const tasks = (await TaskModel.find({ owner : res.locals.userId }))
                .map(
                    ( {
                        _id, name, position, completedAt, createdAt, endAt, description, favourites,
                        forList, myDay,
                        categories
                    } ) => {
                        return {
                            _id, name, position, createdAt,
                            ...(endAt && endAt.length ? { endAt } : {}),
                            ...(completedAt && completedAt.length ? { completedAt } : {}),
                            categories,
                            description, favourites, forList, myDay
                        }
                    }
                )
            return res.status(200).json({ groups, lists, steps, tasks })
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message : 'Something went wrong. Try again later...' })
        }
    }
)

router.post('/change_position', auth,
    async (
        req: express.Request<any, any, changePositionReqBody>,
        res: express.Response<any, AuthMwResLocals>
    ) => {
        try {
            for ( const moveEl of req.body.data ) {
                switch ( moveEl.type ) {
                    case 0: { //step
                        const steps = await StepModel.find(
                            { owner : res.locals.userId }
                        )
                        const step_for_move = steps.find(el => el._id.toString() === moveEl._id)
                        if ( !step_for_move )
                            return res.status(200).json({ message : 'Sth wrong' })

                        const toPos = moveEl.toPos
                        const fromPos = step_for_move.position

                        for ( const step of steps ) {
                            if ( step._id.toString() !== moveEl._id ) {
                                if ( step.forTask.toString() === step_for_move.forTask.toString() )
                                    if ( fromPos > toPos
                                        && step.position >= toPos && step.position < fromPos ) {
                                        step.set('position', ++step.position)
                                        await step.save()
                                    } else if ( fromPos < toPos
                                        && step.position > fromPos && step.position <= toPos ) {
                                        step.set('position', --step.position)
                                        await step.save()
                                    }
                            } else {
                                step.set('position', toPos)
                                await step.save()
                            }
                        }
                        break
                    }
                    case 1: { //task
                        switch ( moveEl.move.type ) {
                            case TaskMoveType.MOVE_INSIDE_LIST: {
                                const task_for_move = await TaskModel.findById(moveEl._id)
                                if ( !task_for_move )
                                    break
                                const tasks = await TaskModel.find({
                                    owner : res.locals.userId,
                                    forList : task_for_move.forList
                                })
                                if ( !tasks )
                                    break
                                const fromPos = task_for_move.position
                                const toPos = moveEl.move.toPos
                                for ( const task of tasks ) {
                                    if ( task._id !== task_for_move._id ) {
                                        if ( fromPos !== null && task.position !== null && fromPos > toPos
                                            && task.position >= toPos && task.position < fromPos ) {
                                            task.set('position', ++task.position)
                                            await task.save()
                                        } else if ( fromPos !== null && task.position !== null && fromPos < toPos
                                            && task.position > fromPos && task.position <= toPos ) {
                                            task.set('position', --task.position)
                                            await task.save()
                                        }
                                    } else {
                                        task.set('position', toPos)
                                        await task.save()
                                    }
                                }
                                break
                            }
                            case TaskMoveType.MOVE_BETWEEN_LISTS: {
                                const task_for_move = await TaskModel.findById(moveEl._id)
                                if ( !task_for_move )
                                    break
                                const prevList_tasks = await TaskModel.find({
                                    owner : res.locals.userId,
                                    forList : task_for_move.forList,
                                    position : { $type : 'number' }
                                })
                                const curList_tasks = await TaskModel.find({
                                    owner : res.locals.userId,
                                    forList : moveEl.move.forList,
                                    position : { $type : 'number' }
                                })
                                const fromPos = task_for_move.position
                                for ( const task of prevList_tasks ) {
                                    if ( task._id !== task_for_move._id && task.position !== null &&
                                        fromPos !== null && task.position > fromPos ) {
                                        task.set('position', --task.position)
                                        await task.save()
                                    }
                                }
                                task_for_move.set('position', curList_tasks.length)
                                task_for_move.set('forList', moveEl.move.forList)
                                await task_for_move.save()
                                break
                            }
                            case TaskMoveType.FAVOURITES_ADD: {
                                const tasks = await TaskModel.find({
                                    owner : res.locals.userId,
                                    favourites : { $type : 'number' }
                                })
                                await TaskModel.findOneAndUpdate({ _id : moveEl._id }, {
                                    favourites : tasks.length
                                })
                                break
                            }
                            case TaskMoveType.MY_DAY_ADD:
                                const tasks = await TaskModel.find({
                                    owner : res.locals.userId,
                                    myDay : { $type : 'number' }
                                })
                                await TaskModel.findOneAndUpdate({ _id : moveEl._id }, {
                                    myDay : tasks.length
                                })
                                break
                            case TaskMoveType.FAVOURITES_MOVE: {
                                const task_for_move = await TaskModel.findById(moveEl._id)
                                if ( !task_for_move )
                                    break
                                const toPos = moveEl.move.favourites
                                const fromPos = task_for_move.favourites
                                if ( typeof fromPos === 'number' ) {
                                    const tasks = await TaskModel.find({
                                        owner : res.locals.userId,
                                        favourites : { $type : 'number' }
                                    })
                                    for ( const task of tasks ) {
                                        if ( task.favourites !== undefined )
                                            if ( task._id !== task_for_move._id && task.favourites !== null ) {
                                                if ( fromPos > toPos
                                                    && task.favourites >= toPos && task.favourites < fromPos ) {
                                                    task.set('favourites', ++task.favourites)
                                                    await task.save()
                                                } else if ( fromPos < toPos
                                                    && task.favourites > fromPos && task.favourites <= toPos ) {
                                                    task.set('favourites', --task.favourites)
                                                    await task.save()
                                                }
                                            } else {
                                                task.set('favourites', toPos)
                                                await task.save()
                                            }
                                    }
                                }
                                break
                            }
                            case TaskMoveType.MY_DAY_MOVE: {
                                const task_for_move = await TaskModel.findById(moveEl._id)
                                if ( !task_for_move )
                                    break
                                const toPos = moveEl.move.myDay
                                const fromPos = task_for_move.myDay
                                if ( typeof fromPos === 'number' ) {
                                    const tasks = await TaskModel.find({
                                        owner : res.locals.userId,
                                        myDay : { $type : 'number' }
                                    })
                                    for ( const task of tasks ) {
                                        if ( task.myDay !== undefined )
                                            if ( task._id !== task_for_move._id && task.myDay !== null ) {
                                                if ( fromPos > toPos
                                                    && task.myDay >= toPos && task.myDay < fromPos ) {
                                                    task.set('favourites', ++task.myDay)
                                                    await task.save()
                                                } else if ( fromPos < toPos
                                                    && task.myDay > fromPos && task.myDay <= toPos ) {
                                                    task.set('favourites', --task.myDay)
                                                    await task.save()
                                                }
                                            } else {
                                                task.set('favourites', toPos)
                                                await task.save()
                                            }
                                    }
                                }
                                break
                            }
                            case TaskMoveType.FAVOURITES_REMOVE: {
                                const task_for_remove = await TaskModel.findById(moveEl._id)
                                if ( !task_for_remove || task_for_remove.favourites === undefined )
                                    return
                                const pos = task_for_remove.favourites
                                if ( pos !== null ) {
                                    const tasks = await TaskModel.find({
                                        owner : res.locals.userId,
                                        favourites : { $type : 'number' }
                                    })
                                    for ( const task of tasks ) {
                                        if ( task._id !== moveEl._id && typeof task.favourites === 'number'
                                            && task.favourites > pos ) {
                                            task.set('favourites', --task.favourites)
                                            await task.save()
                                        }
                                    }
                                }
                                task_for_remove.set('favourites', undefined)
                                await task_for_remove.save()
                                break
                            }
                            case TaskMoveType.MY_DAY_REMOVE: {
                                const task_for_remove = await TaskModel.findById(moveEl._id)
                                if ( !task_for_remove || task_for_remove.myDay === undefined )
                                    return res.status(200).json({ message : 'Sth wrong' })
                                const pos = task_for_remove.myDay
                                if ( pos !== null ) {
                                    const tasks = await TaskModel.find({
                                        owner : res.locals.userId,
                                        myDay : { $type : 'number' }
                                    })
                                    for ( const task of tasks ) {
                                        if ( task._id !== moveEl._id && typeof task.myDay === 'number' &&
                                            task.myDay > pos ) {
                                            task.set('myDay', --task.myDay)
                                            await task.save()
                                        }
                                    }
                                }
                                task_for_remove.set('myDay', undefined)
                                await task_for_remove.save()
                            }
                        }
                        break
                    }
                    case 2: { //group
                        const groups = await GroupModel.find(
                            { owner : res.locals.userId }
                        )
                        const group_for_move = groups.find(el => el._id.toString() === moveEl._id)
                        if ( !group_for_move )
                            return res.status(200).json({ message : 'Sth wrong' })

                        const toPos = moveEl.toPos
                        const fromPos = group_for_move.position
                        if ( fromPos === toPos )
                            break
                        const lists = await ListModel.find({ owner : res.locals.userId, forGroup : undefined })

                        for ( let group of groups ) {
                            if ( group._id.toString() !== moveEl._id ) {
                                if ( fromPos > toPos
                                    && group.position >= toPos && group.position < fromPos ) {
                                    group.set('position', ++group.position)
                                    await group.save()
                                } else if ( fromPos < toPos
                                    && group.position > fromPos && group.position <= toPos ) {
                                    group.set('position', --group.position)
                                    await group.save()
                                }
                            } else {
                                group.set('position', toPos)
                                await group.save()
                            }
                        }
                        for ( const list of lists ) {
                            if ( fromPos > toPos
                                && list.position >= toPos && list.position < fromPos ) {
                                list.set('position', ++list.position)
                                await list.save()
                            } else if ( fromPos < toPos
                                && list.position > fromPos && list.position <= toPos ) {
                                list.set('position', --list.position)
                                await list.save()
                            }
                        }
                        break
                    }
                    case 3: { //list
                        const lists = await ListModel.find(
                            { owner : res.locals.userId }
                        )
                        const list_for_move = lists.find(el => el._id.toString() === moveEl._id)
                        if ( !list_for_move )
                            return res.status(200).json({ message : 'Sth wrong' })

                        const toPos = moveEl.toPos
                        const fromPos = list_for_move.position

                        if ( moveEl.forGroup || moveEl.forGroup === null ) {
                            const prevGroup = list_for_move.forGroup?.toString()
                            const forGroup = moveEl.forGroup
                            if ( forGroup === null ) { // forGroup === null && (!prevGroup || prevGroup)
                                const groups = await GroupModel.find({ owner : res.locals.userId })
                                if ( !prevGroup ) {
                                    for ( let list of lists ) {
                                        if ( !list.forGroup )
                                            if ( list._id.toString() !== moveEl._id ) {
                                                if ( fromPos > toPos
                                                    && list.position >= toPos && list.position < fromPos ) {
                                                    list.set('position', ++list.position)
                                                    await list.save()
                                                } else if ( fromPos < toPos
                                                    && list.position > fromPos && list.position <= toPos ) {
                                                    list.set('position', --list.position)
                                                    await list.save()
                                                }
                                            } else {
                                                list.set('position', toPos)
                                                await list.save()
                                            }
                                    }
                                    for ( let group of groups ) {
                                        if ( fromPos > toPos
                                            && group.position >= toPos && group.position < fromPos ) {
                                            group.set('position', ++group.position)
                                            await group.save()
                                        } else if ( fromPos < toPos
                                            && group.position > fromPos && group.position <= toPos ) {
                                            group.set('position', --group.position)
                                            await group.save()
                                        }
                                    }
                                } else {
                                    for ( let list of lists ) {
                                        if ( list._id.toString() !== moveEl._id ) {
                                            if ( list.forGroup?.toString() === prevGroup && list.position > fromPos ) {
                                                list.set('position', --list.position)
                                                await list.save()
                                            }
                                            if ( !list.forGroup && list.position >= toPos ) {
                                                list.set('position', ++list.position)
                                                await list.save()
                                            }
                                        } else {
                                            list.set('position', toPos)
                                            list.set('forGroup', undefined)
                                            await list.save()
                                        }
                                    }
                                    for ( let group of groups ) {
                                        if ( group.position >= toPos ) {
                                            group.set('position', ++group.position)
                                            await group.save()
                                        }
                                    }
                                }
                            } else if ( forGroup ) {
                                if ( !prevGroup ) { // forGroup && !prevGroup
                                    const groups = await GroupModel.find({ owner : res.locals.userId })
                                    for ( let list of lists ) {
                                        if ( list._id.toString() !== moveEl._id ) {
                                            if ( !list.forGroup?.toString() ) {
                                                if ( list.position > fromPos ) {
                                                    list.set('position', --list.position)
                                                    await list.save()
                                                }
                                            } else if ( list.forGroup?.toString() === forGroup ) {
                                                if ( list.position >= toPos ) {
                                                    list.set('position', ++list.position)
                                                    await list.save()
                                                }
                                            }
                                        } else {
                                            list.set('forGroup', forGroup)
                                            list.set('position', toPos)
                                            await list.save()
                                        }
                                    }
                                    for ( let group of groups ) {
                                        if ( group.position > fromPos ) {
                                            group.set('position', --group.position)
                                            await group.save()
                                        }
                                    }
                                } else { // forGroup && prevGroup
                                    for ( let list of lists ) {
                                        if ( list._id.toString() !== moveEl._id ) {
                                            if ( forGroup === prevGroup && list.forGroup?.toString() === forGroup ) {
                                                if ( fromPos > toPos && list.position >= toPos
                                                    && list.position < fromPos ) {
                                                    list.set('position', ++list.position)
                                                    await list.save()
                                                }
                                                if ( fromPos < toPos && list.position > fromPos
                                                    && list.position <= toPos ) {
                                                    list.set('position', --list.position)
                                                    await list.save()
                                                }
                                                continue
                                            }
                                            if ( list.forGroup?.toString() === prevGroup && list.position > toPos ) {
                                                list.set('position', --list.position)
                                                await list.save()
                                            }
                                            if ( list.forGroup?.toString() === forGroup && list.position >= toPos ) {
                                                list.set('position', ++list.position)
                                                await list.save()
                                            }
                                        } else {
                                            list.set('position', toPos)
                                            await list.save()
                                        }
                                    }
                                }
                            }
                        }
                        break
                    }
                }
            }
            return res.status(201).json({ message : 'Ok' })
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message : 'Something went wrong. Reloading page...' })
        }
    }
)

router.post('/complete', auth,
    async (
        req: express.Request<any, any, completeReqBody>,
        res: express.Response<any, AuthMwResLocals>
    ) => {
        try {
            for ( const el of req.body.data ) {
                switch ( el.type ) {
                    case 0: {
                        const step = await StepModel.findById(el._id)
                        if ( step ) {
                            step.set('isCompleted', !step.isCompleted)
                            await step.save()
                        }
                        break
                    }
                    case 1: {
                        const task = await TaskModel.findById(el._id)
                        if ( task ) {
                            if ( task.completedAt.length !== 0) {
                                task.set('completedAt', undefined)
                                const tasks = await TaskModel.find({
                                    owner : res.locals.userId,
                                    forList : task.forList,
                                    position : { $type : 'number' }
                                })
                                task.set('position', tasks.length)
                                if ( task.myDay === null ) {
                                    const tasks = await TaskModel.find({
                                        owner : res.locals.userId,
                                        myDay : { $type : 'number' }
                                    })
                                    task.set('myDay', tasks.length)
                                }
                                if ( task.favourites === null ) {
                                    const tasks = await TaskModel.find({
                                        owner : res.locals.userId,
                                        favourites : { $type : 'number' }
                                    })
                                    task.set('favourites', tasks.length)
                                }
                            } else {
                                if ( el.completedAt?.length ) {
                                    if ( typeof task.myDay === 'number' ) {
                                        task.set('myDay', null)
                                        const tasksMyDay = await TaskModel.find({
                                            owner : res.locals.userId,
                                            myDay : { $type : 'number' }
                                        })
                                        for ( const taskMyDay of tasksMyDay ) {
                                            if ( typeof taskMyDay.myDay === 'number'
                                                && taskMyDay.myDay > task.myDay ) {
                                                taskMyDay.set('myDay', --taskMyDay.myDay)
                                                await task.save()
                                            }
                                        }
                                    }
                                    if ( typeof task.favourites === 'number' ) {
                                        task.set('favourites', null)
                                        const tasksFavourites = await TaskModel.find({
                                            owner : res.locals.userId,
                                            favourites : { $type : 'number' }
                                        })
                                        for ( const taskFavourite of tasksFavourites ) {
                                            if ( typeof taskFavourite.favourites === 'number' &&
                                                taskFavourite.favourites > task.favourites ) {
                                                taskFavourite.set('favourites', --taskFavourite.favourites)
                                                await task.save()
                                            }
                                        }
                                    }
                                    const tasksForList = await TaskModel.find({
                                        owner : res.locals.userId,
                                        forList : task.forList,
                                        position : { $type : 'number' }
                                    })
                                    for ( const taskForList of tasksForList ) {
                                        if ( taskForList.position &&
                                            taskForList.position > task.position! ) {
                                            taskForList.set('favourites', --taskForList.position)
                                            await taskForList.save()
                                        }
                                    }
                                    task.set('completedAt', el.completedAt)
                                    task.set('position', null)
                                }
                            }
                            await task.save()
                        }
                        break
                    }
                }
            }

            return res.status(202).json({ message : 'Ok' })
        } catch (e) {
            return res.status(500).json({ message : 'Something went wrong. Reloading page...' })
        }
    }
)

router.post('/change_data', auth,
    async (
        req: express.Request<any, any, changeDataReqBody>,
        res: express.Response<any, AuthMwResLocals>
    ) => {
        try {
            for ( const { type, _id, ...el } of req.body.data ) {

                switch ( type ) {
                    case 0:
                        await StepModel.findByIdAndUpdate(
                            _id, { ...el }
                        )
                        break
                    case 1:
                        await TaskModel.findByIdAndUpdate(
                            _id, { ...el }
                        )
                        break
                    case 2:
                        await GroupModel.findByIdAndUpdate(
                            _id, { ...el }
                        )
                        break
                    case 3:
                        await ListModel.findByIdAndUpdate(
                            _id, { ...el }
                        )
                        break
                }

            }
            return res.status(201).json({ message : 'Ok' })
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message : 'Something went wrong. Try again later...' })
        }
    }
)

router.post('/delete', auth,
    async (
        req: express.Request<any, any, deleteReqBody>,
        res: express.Response<any, AuthMwResLocals>
    ) => {
        try {
            for ( const el of req.body.data ) {
                switch ( el.type ) {
                    case 0: {
                        const step = await StepModel.findById(el._id)
                        if ( !step )
                            continue
                        const steps = await StepModel.find({ owner : res.locals.userId, forTask : step.forTask })
                        for ( let item of [...steps] ) {
                            if ( item._id.toString() !== step._id.toString() && item.position && step.position &&
                                item.position > step.position ) {
                                item.set('position', item.position - 1)
                                await item.save()
                            }
                        }
                        await step.delete()
                        break
                    }
                    case 1: {
                        const task = await TaskModel.findById(el._id)
                        if ( !task )
                            continue
                        const tasks = await TaskModel.find({ owner : res.locals.userId })
                        for ( let item of tasks ) {
                            if ( item._id.toString() !== task._id.toString() ) {
                                if ( item.position && task.position &&
                                    item.position > task.position && item.forList === task.forList ) {
                                    item.set('position', item.position - 1)
                                    await item.save()
                                }
                                if ( item.myDay && task.myDay && item.myDay > task.myDay ) {
                                    item.set('myDay', --item.myDay)
                                    await item.save()
                                }
                                if ( item.favourites && task.favourites && item.favourites > task.favourites ) {
                                    item.set('favourites', --item.favourites)
                                    await item.save()
                                }
                            }
                        }
                        const steps = await StepModel.find({ forTask : task._id, owner : res.locals.userId })
                        for ( let step of steps ) {
                            await step.delete()
                        }
                        await task.delete()
                        break
                    }
                    case 2: {
                        const group = await GroupModel.findById(el._id)
                        if ( !group )
                            continue
                        const groups = await GroupModel.find({ owner : res.locals.userId })
                        const lists = await ListModel.find({ owner : res.locals.userId, forGroup : undefined })
                        const listsForGroup = await ListModel.find({ owner : res.locals.userId, forGroup : group._id })

                        for ( let item of [...groups, ...lists] ) {
                            if ( item._id.toString() === group._id.toString() ) {
                                await item.delete()
                            } else if ( item.position > group.position ) {
                                item.set('position', item.position - 1 + listsForGroup.length)
                                await item.save()
                            }
                        }
                        for ( let list of listsForGroup ) {
                            list.set('position', group.position + list.position)
                            list.set('forGroup', undefined)
                            await list.save()
                        }
                        break
                    }
                    case 3: {
                        const list = await ListModel.findByIdAndDelete(el._id)
                        if ( !list )
                            continue
                        const lists = await ListModel.find({ owner : res.locals.userId, forGroup : list.forGroup })
                        if ( list.forGroup ) {
                            for ( let item of [...lists] ) {
                                if ( item._id.toString() !== list._id.toString() && item.position > list.position ) {
                                    item.set('position', item.position - 1)
                                    await item.save()
                                }
                            }
                        } else {
                            const groups = await GroupModel.find({ owner : res.locals.userId })
                            for ( let item of [...groups, ...lists] ) {
                                if ( item._id.toString() !== list._id.toString() && item.position > list.position ) {
                                    item.set('position', item.position - 1)
                                    await item.save()
                                }
                            }
                        }
                        const tasks = await TaskModel.find({ forList : list._id, owner : res.locals.userId })
                        for ( let task of tasks ) {
                            const steps = await StepModel.find({ forTask : task._id, owner : res.locals.userId })
                            for ( let step of steps ) {
                                await step.delete()
                            }
                            await task.delete()
                        }
                        break
                    }
                }
            }

            return res.status(201).json({ message : 'Ok' })
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message : 'Something went wrong. Try again later...' })
        }
    }
)

//create routes
router.post('/create', auth,
    async (
        req: express.Request<any, any, createReqBody>,
        res: express.Response<any, AuthMwResLocals>
    ) => {
        try {
            for ( const el of req.body.data ) {
                switch ( el.type ) {
                    case 0: {
                        const steps = await StepModel.find({ forTask : el.forTask })
                        const newStep = new StepModel({
                            _id : new Types.ObjectId(el._id),
                            name : el.name,
                            position : steps.length,
                            forTask : el.forTask,
                            isCompleted : false,
                            owner : res.locals.userId
                        })
                        await newStep.save()
                        break
                    }
                    case 1: {
                        const tasks = await TaskModel.find({ owner : res.locals.userId })
                        const newTask = new TaskModel({
                            _id : new Types.ObjectId(el._id),
                            name : el.name,
                            createdAt : el.createdAt,
                            completedAt : [],
                            description : '',
                            categories : [],
                            endAt : el.endAt,
                            favourites : el.isFavourite ?
                                tasks.filter(task => typeof task.favourites === 'number').length
                                :
                                undefined,
                            myDay : el.isMyDay ?
                                tasks.filter(task => typeof task.myDay === 'number').length
                                :
                                undefined,
                            owner : res.locals.userId,
                            forList : el.forList,
                            position : tasks.filter(task => el.forList === task.forList).length
                        })
                        await newTask.save()
                        break
                    }
                    case 2: {
                        const groups = await GroupModel.find({ owner : res.locals.userId })
                        const lists = await ListModel.find({ owner : res.locals.userId, forGroup : undefined })
                        const newGroup = new GroupModel({
                            _id : new Types.ObjectId(el._id),
                            name : el.name,
                            owner : res.locals.userId,
                            position : groups.length + lists.length
                        })
                        await newGroup.save()
                        break
                    }
                    case 3: {
                        const groups = await GroupModel.find({ owner : res.locals.userId })
                        const lists = await ListModel.find({ owner : res.locals.userId, forGroup : undefined })
                        const newList = new ListModel({
                            _id : new Types.ObjectId(el._id),
                            name : el.name,
                            owner : res.locals.userId,
                            position : groups.length + lists.length
                        })

                        await newList.save()
                        break
                    }
                }
            }

            return res.status(201).json({ message : 'Ok' })
        } catch (e) {
            console.log(e)
            return res.status(500).json({ message : 'Something went wrong. Try again later...' })
        }
    }
)

export default router
