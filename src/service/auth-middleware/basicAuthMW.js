import atob from "atob"
import createError from "http-errors"
import UserModel from "../users/users-schema.js"

export const basicAuthMW = async (req, res, next) => {
    if(!req.headers.authorization) {
        next(createError(401, "Please provide credentials in Authorization header"))
    } else {
        try {
            const base64Credentials = req.headers.authorization.split(" ")[1]
            console.log(base64Credentials)
            const [email, password] = atob(base64Credentials).split(":")
            console.log("EMAITL", email, "PASSWORD", password);
            const user = await UserModel.checkCredentials(email, password)
            if(user){
                req.user = user
                next()
            }else {
                next(createError(401, "Credentials are not right"))
            }
        } catch (error) {
            console.log(error)
            next(createError(401, "Token not valid!"))
        }
    }
}