import { Schema, model, Types } from 'mongoose'
import { GroupSchema } from '../types/Schemas'

const schema = new Schema<GroupSchema>({
    _id : { type : Types.ObjectId, required : true },
    name : { type : String, required : true },
    position : { type : Number, required : true },
    owner : { type : Types.ObjectId, ref : 'User', required : true }
}, { _id: false })

export const GroupModel = model<GroupSchema>('Group', schema)