import { Schema, model } from 'mongoose'
import { UserSchema } from '../types/Schemas'

const schema = new Schema<UserSchema>({
    email : { type : String, required : true, unique : true },
    password : { type : String, required : true },
    username : { type : String, required : true },
    RecoveryCode : { type : String || null },
    ConfirmEmail : { type : String || null },
    Timezone : { type : Number, required : true }
})

export const UserModel = model<UserSchema>('User', schema)