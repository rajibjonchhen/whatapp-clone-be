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
    const User = await UsersModel.find()
    res.send(User)
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
