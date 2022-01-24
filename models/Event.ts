import { Schema, model, Types } from 'mongoose'
import { EventSchema } from "../types/Schemas";

const schema = new Schema<EventSchema>({
    Date : { type : Number, required : true },
    name : { type : String, required : true },
    description : { type : String },
    owner : { type : Types.ObjectId, ref : 'User' }
})

export const EventModel = model<EventSchema>('Event', schema)