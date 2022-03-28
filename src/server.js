import express from "express" 
import listEndpoints from "express-list-endpoints"
import cors from 'cors'


const server =  express()
const PORT  = process.env.PORT || 30001