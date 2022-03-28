import express, { Router } from "express"
import createError from "http-errors"
import UsersModel from "./users-schema.js"

const usersRouter = Router()

// -----------------------------POST ROUTE------------------------

// ==> for user registration
usersRouter.post("/account", async (req, res, next) => {
  try {
    const newUser = new UsersModel(req.body)
    const createdUser = await newUser.save()
    res.status(201).send(createdUser)
    // res.status(201).send({ message: "USER CREATED(REGISTERED)", ID: _id })
  } catch (error) {
    next(error)
  }
})
// ==> for user login
usersRouter.post("/session", async (req, res, next) => {
  try {
    const { email, password } = req.body
  } catch (error) {
    next(error)
  }
})

// -----------------------------GET ROUTE------------------------

usersRouter.get("/", async (req, res, next) => {
  try {
    const Users = await UsersModel.find()
    console.log("listof users", Users)
    console.log("QUERY PARAMETERS: ", req.query)

    if (req.query && req.query.username) {
      // for serching user by username , ?username=rajib
      const filterdUserName = Users.filter((user) => user.username === req.query.username)
      res.send(filterdUserName)
    } else if (req.query && req.query.email) {
      // for searching user by email , ?email=rajib@gmail.com
      const filterdUserEmail = Users.filter((user) => user.email === req.query.email)
      res.send(filterdUserEmail)
    } else {
      res.send(Users)
    }
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
