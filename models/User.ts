import { Schema, model, Types } from 'mongoose'
import { UserSchema } from "../types/Schemas";

const schema = new Schema<UserSchema>({
    email : { type : String, required : true, unique : true },
    password : { type : String, required : true },
    username : { type : String, required : true },
    RecoveryCode : { type : String || null },
    ConfirmEmail : { type : String || Boolean },
    Timezone : { type : Number, required : true },
    Events : [{ type : Types.ObjectId, ref : 'Event' }]
})

export const UserModel = model<UserSchema>('User', schema)