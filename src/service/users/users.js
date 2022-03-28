import express, { Router } from "express"
import UsersModel from "./users-schema.js"

const usersRouter = Router()

// -----------------------------POST ROUTE------------------------

usersRouter.post("/registration", async (req, res, next) => {
  try {
    const newUser = new UsersModel(req.body)
    const { _id } = await newUser.save()
    res.status(201).send({ message: "USER CREATED(REGISTERED)", ID: _id })
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
      const filterdUserName = Users.filter((user) => user.username === req.query.username)
      res.send(filterdUserName)
    } else if (req.query && req.query.email) {
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

usersRouter.get("/", async (req, res, next) => {
  try {
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
