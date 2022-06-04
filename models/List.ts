import { Schema, model, Types } from 'mongoose'
import { ListSchema } from '../types/Schemas'

const schema = new Schema<ListSchema>({
    _id : { type : Types.ObjectId, required : true },
    name : { type : String, required : true },
    position : { type : Number, required : true },
    owner : { type : Types.ObjectId, ref : 'User', required : true },
    forGroup : { type : Types.ObjectId, ref : 'Group' }
}, { _id : false })

export const ListModel = model<ListSchema>('List', schema)