import mongoose from "mongoose"

const {Schema, model } = mongoose

const ChatMessageSchema = new Schema(
    {
        sender: { type: Schema.Types.ObjectId,  ref: "User" },
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
    members : [{ type: Schema.Types.ObjectId, ref: "User"}],
    messages:[ {
        sender: { type: Schema.Types.ObjectId,  ref: "User" },
        content: {
            text: { type: String },
            media: { type: String },
        }
    }],
},
{
    timestamps: true,
}
)
export default model("Chats", ChatsSchema)