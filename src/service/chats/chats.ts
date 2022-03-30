import express, {Router} from 'express'
import createHttpError from 'http-errors'
import { JWTAuthMiddleware } from '../auth-middleware/JWTAuthMiddleware.js'
import ChatsModel from './chat-schema.js'
import { Request, Response, NextFunction } from "express";

const chatsRouter = Router()

// ----------------------------- POST message ROUTE------------------------

chatsRouter.post("/", JWTAuthMiddleware, async(req, res, next) =>{

    try {
        const recipient = req.body.recipient
        const sender = req.user?._id
        if(sender){
            if(!recipient){
                next(createHttpError(400, "Recipient id is missing"))
            } 
            let chat = await ChatsModel.findOne({
                'members':{
                    $all:[ sender, recipient]
                }
            })
            if(chat){
                res.send(chat)
            } else{
                const newChat = new ChatsModel({members : [sender, recipient]})
                const savedChat = await newChat.save()
                if(savedChat){
                    res.status(201).send(newChat)
                }else{
                    res.status(400).send({message: "Something went wrong"})
                }
            }
        } else{
            next(createHttpError(401, {message:"sender's id is missing"}))
        }
       
    } catch (error) {
        next(error)
    }
})

// ----------------------------- GET ALL MESSAGES ROUTE------------------------

chatsRouter.get("/", JWTAuthMiddleware, async(req, res, next) =>{

    try {
        const reqMsg = await ChatsModel.find({members: req.user?._id})

        // have this user socket listen to ALL of this chat rooms........
        
        res.send({messages:reqMsg})
    } catch (error) {
        next(error)
    }
})

// ----------------------------- GET ALL MESSAGES ROUTE------------------------

chatsRouter.get("/:chatId", JWTAuthMiddleware, async(req, res, next) =>{

    try {
        const reqMsg = await ChatsModel.findOne({_id:req.params.chatId, "members": req.user?._id})

        if(reqMsg){
            res.send({messages:reqMsg})
        } else{
            next(createHttpError(404,{message:`chat with ${req.params.chatId} not found`}))
        }
    } catch (error) {
        next(error)
    }
})

// ----------------------------- GET ALL MESSAGES ROUTE------------------------

// chatsRouter.delete("/:id", JWTAuthMiddleware, async(req, res, next) =>{
//     try {

//     const reqMsg = await new ChatsModel.findOne({_id: req.params.id})
//         if(reqMsg){

//             const reqMsg = await new ChatsModel.findOne({sender: req.user._id})
//         } else {
//             next(createHttpError())
//         }

//         res.send({messages:reqMsg})
//     } catch (error) {
//         next(error)
//     }
// })
export default chatsRouter