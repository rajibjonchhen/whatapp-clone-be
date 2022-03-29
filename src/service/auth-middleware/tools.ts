import createHttpError from "http-errors"
import createError from "http-errors"
import jwt from 'jsonwebtoken'
import { IUser } from "../types/types.js"
import UsersModel from "../users/users-schema.js"

interface ITokenId {
    _id:string
}
export const authenticateUser = async (user:IUser) => {
    const accessToken = await generateJWTToken({_id:user._id})
    const refreshToken = await generateRefreshToken({_id: user._id})
    await UsersModel.findByIdAndUpdate(user._id,{refreshToken:refreshToken})
    return {accessToken, refreshToken}
}

export const generateJWTToken = (payload:any) => 
    new Promise ((resolve, reject) => 
        jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn : "15m"}, (err, token) => {
            if(err) reject(err)
            else resolve(token)
        })
    )

export const verifyJWTToken = (token:any) =>
    new Promise ((resolve, reject) =>
        jwt.verify(
            token,
            process.env.JWT_SECRET!,
            (err:any, payload:any) => {
                if(err) reject (err)
                else resolve(payload)
            }
        )
    )    

    export const generateRefreshToken = (payload:any) => 
    new Promise ((resolve, reject) => 
        jwt.sign(payload, process.env.REFRESH_SECRET!, {expiresIn : "1 week"}, (err, token) => {
            if(err) reject(err)
            else resolve(token)
        })
    )
    export const verifyRefreshToken = (token:any) => 
            new Promise((resolve, reject ) =>
            jwt.verify(token, process.env.REFRESH_SECRET!,(err:any, payload:any) => {
                if (err) reject(err)
                else resolve(payload)
            })
            )

    export const verifyRefreshTokenAndGenerateNewTokens = async (currentRefreshToken:string) =>{
        try {
            const payload:any = await verifyRefreshToken(currentRefreshToken)
            const user = await  UsersModel.findById(payload._id)

            if(!user) throw  createHttpError(404, `User with id ${payload._id}`)
            console.log(currentRefreshToken)
            console.log(user.refreshToken)

            if(user.refreshToken && user.refreshToken === currentRefreshToken) {
                const {accessToken, refreshToken} = await authenticateUser(user)
                return {accessToken, refreshToken}
            } else {
                throw  createHttpError(401, "Refresh token not valid")
            }
        } catch (error) {
            console.log(error)
            throw createHttpError(401, "Refresh token not valid!")
        }
    }