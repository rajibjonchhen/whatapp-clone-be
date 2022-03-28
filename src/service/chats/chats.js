import express, {Router} from 'express'
import createHttpError from 'http-errors'
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

// ----------------------------- GET ALL MESSAGES ROUTE------------------------

chatsRouter.get("/:id", JWTAuthMiddleware, async(req, res, next) =>{

    try {
        const reqMsg = await new ChatsModel.find({_id: req.params.id})

        res.send({messages:reqMsg})
    } catch (error) {
        next(error)
    }
})

// ----------------------------- GET ALL MESSAGES ROUTE------------------------

chatsRouter.delete("/:id", JWTAuthMiddleware, async(req, res, next) =>{
    try {

    const reqMsg = await new ChatsModel.findOne({_id: req.params.id})
        if(reqMsg){

            const reqMsg = await new ChatsModel.findOne({sender: req.user._id})
        } else {
            next(createHttpError())
        }

        res.send({messages:reqMsg})
    } catch (error) {
        next(error)
    }
})
export default chatsRouter