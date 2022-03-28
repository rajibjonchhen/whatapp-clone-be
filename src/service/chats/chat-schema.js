import mongoose from "mongoose"

const {Schema, model } = mongoose

const ChatsSchema = new Schema(
    {
    sender: {type : String, required: true},
    content: {
        text: {type : String},
        media: {type : String}
    }
})

export default model("Chats", ChatsSchema)