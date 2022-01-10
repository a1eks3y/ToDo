import {Schema, model, Types} from 'mongoose'

interface Event {
    Date: number,
    name: string,
    description: string,
    owner: Types.ObjectId
}

const schema = new Schema<Event>({
    Date: {type: Number, required: true},
    name: {type: String, required: true},
    description: {type: String},
    owner: {type: Types.ObjectId, ref: 'User'}
})

export const EventModel = model<Event>('Event', schema)