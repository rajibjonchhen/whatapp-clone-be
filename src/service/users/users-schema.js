import mongoose from "mongoose"

const { Schema, model } = mongoose

const UsersSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String, required: true, default: "https://ui-avatars.com/api/?name=John+Doe" },
    password: { type: String },
    refreshToken :{ type : String}
  },

  {
    timestamps: true,
  }
)
export default model("User", UsersSchema)
