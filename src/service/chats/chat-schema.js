import mongoose from "mongoose"

const {Schema, model } = mongoose

const chatSchema = new Schema(
    {
    sender: {type : String, required: true},
    content: {
        text: {type : String},
        media: {type : String}
    }
})