import { Types } from "mongoose";

export interface EventSchema {
    Date: number,
    name: string,
    description: string,
    owner: Types.ObjectId
}
export interface UserSchema {
    username: string,
    email: string,
    password: string,
    RecoveryCode: string | null,
    Timezone: number,
    ConfirmEmail: boolean | string,
    Events: Types.ObjectId[]
}