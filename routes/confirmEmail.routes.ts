import {Router} from "express";
import {UserModel} from "../models/User";

const router = Router()

router.get('/:id',
    async (req, res) => {
        try{
            const user = await UserModel.findOneAndUpdate({ConfirmEmail: req.params.id}, {ConfirmEmail: true})
            if(!user) return res.status(404).json({message: 'Page not found'})

            await user.save()
            return res.status(202).json({message: 'Email confirmed'})
        } catch(e){
            return res.status(500).json({message: 'Something went wrong. Try again later...'})
        }
    }
)

export default router