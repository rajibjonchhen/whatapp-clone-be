import mongoose from "mongoose"

const {Schema, model } = mongoose

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

const ChatsSchema = new Schema({
    members : [{ type: Schema.Types.ObjectId, ref: "User", required: true}],
    messages:[{type : ChatMessageSchema}],

})
export default model("Chats", ChatsSchema)