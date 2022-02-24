import { Schema, model, Types } from 'mongoose'
import { GroupSchema } from '../types/Schemas'

const schema = new Schema<GroupSchema>({
    name : { type : String, required : true },
    position : { type : Number, required : true },
    owner : { type : Types.ObjectId, ref : 'User', required : true }
})

export const GroupModel = model<GroupSchema>('Group', schema)