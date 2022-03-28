import createError from "http-errors"
import jwt from 'jsonwebtoken'
import UsersModel from "../users/users-schema.js"

export const authenticateUser = async user => {
    const accessToken = await generateJWTToken({_id:user._id})
    const refreshToken = await generateRefreshToken({_id: user._id})
    user.refreshToken = refreshToken
    await user.save()
    return {accessToken, refreshToken}
}

export const generateJWTToken = payload => 
    new Promise ((resolve, reject) => 
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn : "1 week"}, (err, token) => {
            if(err) reject(err)
            else resolve(token)
        })
    )

export const verifyJWT = token =>
    new Promise ((resolve, reject) =>
        jwt.verify(
            token,
            process.env.JWT_SECRET,
            (err, payload) => {
                if(err) reject (err)
                else resolve(payload)
            }
        )
    )    

    const generateRefreshToken = payload => 
    new Promise ((resolve, reject) => 
        jwt.sign(payload, process.env.REFRESH_SECRET, {expiresIn : "1 week"}, (err, token) => {
            if(err) reject(err)
            else resolve(token)
        })
    )
    const verifyRefreshToken = token => 
            new Promise((resolve, reject ) =>
            jwt.verify(token, process.env.REFRESH_SECRET,(err, payload) => {
                if (err) reject(err)
                else resolve(payload)
            })
            )

    const verifyRefreshTokenAndgenerateNewsToken = async currentRefreshToken =>{
        try {
            const payload = await verifyRefreshToken(currentRefreshToken)
            const user = await  UsersModel.findById(payload._id)

            if(!user) throw new createError(404, `User with id ${payload._id}`)
            console.log(currentRefreshToken)
            console.log(user.refreshToken)

            if(user.refreshToken && user.refreshToken === currentRefreshToken) {
                const {accessToken, refreshToken} = await authenticateUser(user)
                return {accessToken, refreshToken}
            } else {
                throw new createError(401, "Refresh token not valid")
            }
        } catch (error) {
            console.log(error)
            throw new createError(401, "Refresh token not valid!")
        }
    }