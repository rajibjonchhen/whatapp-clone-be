import express, {Router} from 'express'
import { JWTAuthMiddleware } from '../auth-middleware/JWTAuthMiddleware.js'

const chatsRouter = Router()

chatsRouter.get("/", JWTAuthMiddleware, async(req, res, next) =>{

    
})
export default chatsRouter