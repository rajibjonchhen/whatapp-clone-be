import express, { Router } from "express"
import createError from "http-errors"
import passport from "passport"
import { JWTAuthMiddleware } from "../auth-middleware/JWTAuthMiddleware.js"
import { authenticateUser, verifyRefreshTokenAndGenerateNewTokens } from "../auth-middleware/tools.js"
import UsersModel from "./users-schema.js"

const usersRouter = Router()


// -----------------------------Get me access key------------------------
usersRouter.get("/", JWTAuthMiddleware,  async(req, res, next) => {
    console.log(req.user)
    try {
        const user =  await UsersModel.findById(req.user._id)
        if(user){
            if(req.query.q){
                console.log(req.query.q)
                const filteredUsers = await UsersModel.find({$contains:{username:req.query.q}})
                filteredUsers.length> 0? res.send({users : filteredUsers}) : ({users : []})
            } else{
                const allUsers = await UsersModel.find()
                res.send({users : allUsers})
            }
        }
        
    } catch (error) {
        console.log(error)
        next(error)
    }
})


// ----------------------------- Get me access key------------------------
usersRouter.get("/me", JWTAuthMiddleware,  async(req, res, next) => {
    
    try {
        const user =  await UsersModel.findById(req.user._id)
        res.send({user})
        
    } catch (error) {
        console.log(error)
        next(error)
    }
})



// ----------------------------- PUT me access key------------------------
usersRouter.put("/me", JWTAuthMiddleware,  async(req, res, next) => {
    

    try {
        const user =  await UsersModel.findByIdAndUpdate(req.user._id, req.body, {new:true})
        res.send({user})
        
    } catch (error) {
        console.log(error)
        next(error)
    }
})

// ----------------------------- Delete me access key------------------------
usersRouter.delete("/me", JWTAuthMiddleware,  async(req, res, next) => {
    

    try {
        const user =  await UsersModel.findByIdAndDelete(req.user._id)
        res.status(201).send()
        
    } catch (error) {
        console.log(error)
        next(error)
    }
})

// ----------------------------- Get new access token from refresh token------------------------
usersRouter.post("/refreshTokens",  async(req, res, next) => {
    
    try {
        const {currentRefreshToken} = req.body
        
        const {accessToken, refreshToken} = await verifyRefreshTokenAndGenerateNewTokens(currentRefreshToken)
        console.log("getting /me")
        
        res.send({accessToken, refreshToken})
        
    } catch (error) {
        console.log(error)
    }
})

// ----------------------------- POST ROUTE------------------------

// ==> for user registration
usersRouter.post("/account", async (req, res, next) => {
    try {
    const newUser = new UsersModel(req.body)
    const createdUser = await newUser.save()
    const {accessToken, refreshToken} =  await authenticateUser(newUser)
    res.status(201).send({createdUser,accessToken, refreshToken})
    // res.status(201).send({ message: "USER CREATED(REGISTERED)", ID: _id })
    } catch (error) {
    next(error)
    }
})
// ==> for user login
usersRouter.post("/session", async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await UsersModel.checkCredentials(email, password)
    if(user){
        const { accessToken, refreshToken } =  await authenticateUser(user)
        res.send({accessToken, refreshToken})
    }
  } catch (error) {
    next(error)
  }
})

// ----------------------------- PUT image me access key------------------------
usersRouter.post("/me/avatar", JWTAuthMiddleware,   async(req, res, next) => {
    

    try {
        const user =  await UsersModel.findByIdAndUpdate(req.user._id, {avatar:req.file.path}, {new:true})
        res.send({user})
        
    } catch (error) {
        console.log(error)
        next(error)
    }
})
// -----------------------------Google Authentication ROUTE------------------------
usersRouter.get("/googleLogin", passport.authenticate("google",{scope : ["email","profile"]}) )
// http://localhost:3001/users/googleLogin

// -----------------------------GET ROUTE------------------------
usersRouter.get("/googleRedirect", passport.authenticate("google"), (req, res, next) => {
    try {
        console.log("I am back from google")
        const token = req.user.token
        console.log("I have token ---" , token)
        res.redirect(`${process.env.FE_URL}/home?token=${token}`)
    } catch (error) {
        next(error)
    }
})


// -----------------------------GET ROUTE------------------------
// usersRouter.get("/", async (req, res, next) => {
//   try {
//     const Users = await UsersModel.find()
//     console.log("listof users", Users)
//     console.log("QUERY PARAMETERS: ", req.query)

//     if (req.query && req.query.username) {
//       // for serching user by username , ?username=rajib
//       const filterdUserName = Users.filter((user) => user.username === req.query.username)
//       res.send(filterdUserName)
//     } else if (req.query && req.query.email) {
//       // for searching user by email , ?email=rajib@gmail.com
//       const filterdUserEmail = Users.filter((user) => user.email === req.query.email)
//       res.send(filterdUserEmail)
//     } else {
//       res.send(Users)
//     }
//   } catch (error) {
//     next(error)
//   }
// })

// -----------------------------GET WITH ID ROUTE------------------------

usersRouter.get("/:userId", async (req, res, next) => {
  try {
    const User = await UsersModel.findById(req.params.userId)
    if (User) {
      res.send(User)
    } else {
      next(createHttpError(404, `User with id${req.params.userId} Not found!`))
    }
  } catch (error) {
    next(error)
  }
})

// -----------------------------PUT ROUTE------------------------

usersRouter.put("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

// -----------------------------DELETE ROUTE------------------------

usersRouter.delete("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})




export default usersRouter
