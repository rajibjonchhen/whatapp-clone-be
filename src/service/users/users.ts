import express, { RequestHandler, Router } from "express"
import { validationResult } from "express-validator"
import createHttpError from "http-errors"
import passport from "passport"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage, Options } from "multer-storage-cloudinary"
import { JWTAuthMiddleware } from "../auth-middleware/JWTAuthMiddleware.js"
import { authenticateUser, verifyRefreshTokenAndGenerateNewTokens } from "../auth-middleware/tools.js"
import { checkUserSchema, checkValidationResult } from "../errors/validator.js"
import UsersModel from "./users-schema.js"
import { Request, Response, NextFunction } from "express";

export interface IRequestWithUser extends Request {
    user: ILogin
  }

const usersRouter = Router()

const cloudinaryAvatarUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "WhatsApp-Clone",
    },
  } as Options),
}).single("avatar")

// -----------------------------Get me access key------------------------
usersRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  console.log(req.user)
  try {
    const user = await UsersModel.findById(req.user?._id)
    if (user) {
      if (req.query.q) {
        console.log(req.query.q)
        const filteredUsers = await UsersModel.find({ $contains: { username: req.query.q } })
        filteredUsers.length > 0 ? res.send({ users: filteredUsers }) : { users: [] }
      } else {
        const allUsers = await UsersModel.find()
        res.send({ users: allUsers })
      }
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

// ----------------------------- Get me access key------------------------
usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.user?._id)
    if (user) {
      res.send({ user })
    } else {
      next(createHttpError(401, { message: "couldn't find the user" }))
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

// ----------------------------- PUT me access key------------------------
usersRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UsersModel.findByIdAndUpdate(req.user?._id, req.body, { new: true })
    if (user) {
      res.status(204).send({ user })
    } else {
      next(createHttpError(401, { message: "couldn't find the user" }))
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

// ----------------------------- Delete me access key------------------------
usersRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UsersModel.findByIdAndDelete(req.user?._id)
    if (user) {
      res.status(201).send()
    } else {
      next(createHttpError(401, { message: "couldn't find the user" }))
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

// ----------------------------- Get new access token from refresh token------------------------
usersRouter.post("/session/refreshTokens", async (req, res, next) => {
  try {
    const { currentRefreshToken } = req.body

    const { accessToken, refreshToken } = await verifyRefreshTokenAndGenerateNewTokens(currentRefreshToken)
    console.log("getting /me")

    res.send({ accessToken, refreshToken })
  } catch (error) {
    console.log(error)
  }
})

// ----------------------------- POST ROUTE------------------------

// ==> for user registration
usersRouter.post("/account", checkUserSchema, checkValidationResult, (async (req, res, next) => {
  try {
    const errorsList = validationResult(req)
    console.log("errorsList ---=", { errorsList })
    if (errorsList.isEmpty()) {
      const newUser = new UsersModel(req.body)
      const createdUser = await newUser.save()
      const { accessToken, refreshToken } = await authenticateUser(newUser)
      res.status(201).send({ createdUser, accessToken, refreshToken })
      // res.status(201).send({ message: "USER CREATED(REGISTERED)", ID: _id })
    } else {
      next(createHttpError(400, errorsList))
    }
  } catch (error) {
    next(error)
  }
}) as RequestHandler)
// ==> for user login
usersRouter.post("/session", async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await UsersModel.checkCredentials(email, password)
    if (user) {
      const { accessToken, refreshToken } = await authenticateUser(user)
      res.send({ accessToken, refreshToken })
    }
  } catch (error) {
    next(error)
  }
})

// ----------------------------- PUT image me access key------------------------
usersRouter.post("/me/avatar", JWTAuthMiddleware, cloudinaryAvatarUploader, async (req, res, next) => {
  try {
    const user = await UsersModel.findByIdAndUpdate(req.user?._id, { avatar: req.file?.path }, { new: true })
    res.send({ user })
  } catch (error) {
    console.log(error)
    next(error)
  }
})
// -----------------------------Google Authentication ROUTE------------------------
usersRouter.get("/googleLogin", passport.authenticate("google", { scope: ["email", "profile"] }))
// http://localhost:3001/users/googleLogin

// -----------------------------GET ROUTE------------------------
usersRouter.get("/googleRedirect", passport.authenticate("google"), (req, res, next) => {
  try {
    console.log("I am back from google")
    const { accessToken, refreshToken } = req.user?.token!
    console.log("I have token ---", refreshToken)
    res.redirect(`${process.env.FE_URL}/home?token=${refreshToken}`)
  } catch (error) {
    next(error)
  }
})

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

// -----------------------------DELETE/Logout ROUTE------------------------

usersRouter.delete("/session", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const reqUser = await UsersModel.findByIdAndUpdate(req.user?._id, { refreshToken: "" }, { new: true })
    if (reqUser) {
      res.send(reqUser)
    } else {
      next(createHttpError(401, "could not logout"))
    }
  } catch (error) {
    next(error)
  }
})

export default usersRouter
