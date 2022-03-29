namespace Express {
    interface User {
        _id: string
        username: string
        token?: {
            accessToken: string
            refreshToken: string
        }
    }
}
