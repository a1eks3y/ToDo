import { Schema, model, Types } from 'mongoose'
import { StepSchema } from '../types/Schemas'

const schema = new Schema<StepSchema>({
    name : { type : String, required : true },
    isCompleted : { type : Boolean, required : true },
    Task : { type : Types.ObjectId, ref : 'Task', required : true }
})

export const StepModel = model<StepSchema>('Step', schema)