import { Schema, model, Types } from 'mongoose'
import { StepSchema } from '../types/Schemas'

const schema = new Schema<StepSchema>({
    _id : { type : Types.ObjectId, required : true },
    name : { type : String, required : true },
    isCompleted : { type : Boolean, required : true },
    forTask : { type : Types.ObjectId, ref : 'Task', required : true },
    position : { type : Number },
    owner : { type : Types.ObjectId, ref : 'User', required : true }
}, { _id: false })

export const StepModel = model<StepSchema>('DragStep', schema)