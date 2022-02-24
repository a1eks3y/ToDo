import { Schema, model, Types } from 'mongoose'
import { TaskSchema } from '../types/Schemas'

const schema = new Schema<TaskSchema>({
    name : { type : String, required : true },
    createdAt : { type : Date, required : true },
    endAt : { type : Date },
    categories : [{ type : String }],
    isFavourites : { type : Boolean, required : true },
    description : { type : String },
    isCompleted : { type : Boolean, required : true },
    owner : { type : Types.ObjectId, ref : 'User', required : true },
    forList : { type : Types.ObjectId, ref : 'List', required : true },
    position : { type : Number, required : true }
})

export const TaskModel = model<TaskSchema>('Task', schema)