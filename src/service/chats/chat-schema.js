import mongoose from "mongoose"

const {Schema, model } = mongoose




// interface Chat {
// 	members: User[]
// 	messages: Message[]
// }

// interface Message {
// 	sender: User
// 	content: {
// 		text?: string
// 		media?: string
// 	}
// 	timestamp: number
// }

const MessagesSchema = new Schema(
    {
    sender: {type : String, required: true},
    content: {
        text: {type : String},
        media: {type : String}
    }
})

const ChatSchema = new Schema({
    member : [{
    
    }],
    messages:[{
        type : MessagesSchema
    }],

})
export default model("Chats", ChatsSchema)