import mongoose from "mongoose"
const { Schema, model } = mongoose;


interface Message 
    {
    sender: string,
    timestamp: number,
    content: {
        text: string,
        media: string
    }
}
const ChatMessageSchema = new Schema<Message>(
    {
        sender: { type: String, required: true },
        timestamp: { type: Number, default: (new Date()).getTime() },
        content: {
            text: { type: String },
            media: { type: String },
        }
    },
    {
        timestamps: true,
    }
)

const ChatMessageModel = model("ChatMessage", ChatMessageSchema)

export default ChatMessageModel;