import createError from "http-errors"
import {verifyJWTToken} from "./tools.js"
import { Request, Response, NextFunction, RequestHandler } from "express";
import createHttpError from "http-errors";


export const JWTAuthMiddleware:RequestHandler = async(req, res, next) => {
    if(!req.headers.authorization){
        next(createError(404, "Please provide bearer token in authorization header !!!"))
    } else {
        try {
            const token = req.headers.authorization.replace("Bearer ", "")
            const payload:any = await verifyJWTToken(token)

            req.user = {
                _id : payload._id,
                username : payload.username
            }
            next()
        } catch (error) {
            throw createHttpError(401, "Token not valid!")
        }
    }
}