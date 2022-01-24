export interface registerReq {
    email: string,
    password: string,
    username: string,
    Timezone: number
}

export interface loginReq {
    email: string,
    password: string
}

export interface deleteReqBody {
    password: string
}