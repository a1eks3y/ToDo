import { Types } from 'mongoose'

export interface UserSchema {
    _id: Types.ObjectId,
    username: string,
    email: string,
    password: string,
    RecoveryCode: string | null,
    Timezone: number,
    ConfirmEmail: boolean | null
}

export interface ListSchema {
    _id: Types.ObjectId,
    name: string,
    forGroup?: Types.ObjectId,
    owner: Types.ObjectId,
    position: number
}

export interface TaskSchema {
    _id: Types.ObjectId,
    name: string,
    createdAt: Date,
    endAt?: Date,
    categories?: string[],
    isFavourites: boolean,
    description?: string,
    isCompleted: boolean,
    forList: Types.ObjectId,
    owner: Types.ObjectId,
    position: number
}

export interface StepSchema {
    _id: Types.ObjectId,
    name: string,
    isCompleted: boolean,
    Task: Types.ObjectId,
    position: number
}

export interface GroupSchema {
    _id: Types.ObjectId,
    owner: Types.ObjectId,
    name: string,
    position: number
}