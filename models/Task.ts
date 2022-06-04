import { Schema, model, Types } from 'mongoose'
import { TaskSchema } from '../types/Schemas'

const schema = new Schema<TaskSchema>({
    _id : { type : Types.ObjectId, required : true },
    name : { type : String, required : true },
    createdAt : { type : [Number, Number, Number, Number, Number, Number], required : true },
    endAt : {
        type : [Number, Number, Number] || undefined
    },
    categories : { type : [String], required : true },
    favourites : { type : Number || null },
    myDay : { type : Number || null },
    description : { type : String },
    completedAt : { type : [Number, Number, Number, Number, Number, Number] },
    owner : { type : Types.ObjectId, ref : 'User', required : true },
    forList : { type : Types.ObjectId, ref : 'List' },
    position : { type : Number || null }
}, { _id : false })

export const TaskModel = model<TaskSchema>('Task', schema)