import mongoose from "mongoose"
const { Schema, model } = mongoose;

const ChatMessageSchema = new Schema(
    {
        sender: { type: String, required: true },
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