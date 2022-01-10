import {Schema, model, Types} from 'mongoose'

interface User {
    username: string,
    email: string,
    password: string,
    RecoveryCode: string | null,
    Timezone: number,
    ConfirmEmail: boolean | string,
    Events: Types.ObjectId[]
}

const schema = new Schema<User>({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    username: {type: String, required: true},
    RecoveryCode: {type: String || null},
    ConfirmEmail: {type: String || Boolean, required: true},
    Timezone: {type: Number, required: true},
    Events: [{type: Types.ObjectId, ref: 'Event'}]
})

export const UserModel = model<User>('User', schema)