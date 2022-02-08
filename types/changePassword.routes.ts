export interface ReqChangePasswordSendMsgBody {
    email: string
}

export interface ReqChangePasswordConfirmBody {
    email: string,
    newPassword: string,
    RecoveryCode: string
}