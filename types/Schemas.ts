import { Types } from 'mongoose'

export interface UserSchema {
    _id: Types.ObjectId,
    username: string,
    email: string,
    password: string,
    RecoveryCode: string | null,
    Timezone: number,
    ConfirmEmail: string | null
}

export interface ListSchema {
    _id: Types.ObjectId,
    name: string,
    forGroup?: Types.ObjectId,
    owner: Types.ObjectId,
    position: number
}

export enum TaskCategories {
    BLUE = 'Blue',
    RED = 'Red',
    ORANGE = 'Orange',
    GREEN = 'Green',
    YELLOW = 'Yellow',
    PURPLE = 'Purple'
}

export type Category = TaskCategories.BLUE | TaskCategories.GREEN | TaskCategories.RED |
    TaskCategories.YELLOW | TaskCategories.ORANGE | TaskCategories.PURPLE
export interface TaskSchema {
    _id: Types.ObjectId,
    name: string,
    createdAt: [number, number, number, number, number, number], // [year, month, day, hour, min, sec]
    endAt?: [number, number, number] | undefined, // [year, month, day]
    categories: Category[],
    myDay?: number | null,
    favourites?: number | null,
    description: string,
    completedAt: [number, number, number, number, number, number] | never[], // [year, month, day, hour, min, sec]
    forList?: Types.ObjectId,
    owner: Types.ObjectId,
    position: number | null
}

export interface StepSchema {
    _id: Types.ObjectId,
    name: string,
    isCompleted: boolean,
    forTask: Types.ObjectId,
    position: number,
    owner: Types.ObjectId,
}

export interface GroupSchema {
    _id: Types.ObjectId,
    owner: Types.ObjectId,
    name: string,
    position: number
}