import mongoose from "mongoose"

const {Schema, model } = mongoose




interface Chat {
	members: User[]
	messages: Message[]
}

interface Message {
	sender: User
	content: {
		text?: string
		media?: string
	}
	timestamp: number
}

interface User {
	name: string
	email: string
	avatar?: string
}



const ChatsSchema = new Schema<Chat>({
    members : [{ type: Schema.Types.ObjectId, ref: "User", required: true}],
    messages:[{
        sender: { type: Schema.Types.ObjectId, ref: "User", required: true},
        content: {
            text: {type : String},
            media: {type : String}
        }
    }],

})
export default model("Chats", ChatsSchema)