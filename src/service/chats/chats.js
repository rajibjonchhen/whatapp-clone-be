import express, {Router} from 'express'
import { JWTAuthMiddleware } from '../auth-middleware/JWTAuthMiddleware.js'

const chatsRouter = Router()

// ----------------------------- POST message ROUTE------------------------

chatsRouter.post("/", JWTAuthMiddleware, async(req, res, next) =>{

    try {
        const newMessage = {...req.body}
        const msgSaved = await newMessage.save()
        res.send({message:msgSaved})
    } catch (error) {
        next(error)
    }
})

// ----------------------------- GET ALL MESSAGES ROUTE------------------------

chatsRouter.get("/", JWTAuthMiddleware, async(req, res, next) =>{

    try {
        const reqMsg = await new ChatsModel.find({sender: req.user._id})

        res.send({messages:reqMsg})
    } catch (error) {
        next(error)
    }
})
export default chatsRouter