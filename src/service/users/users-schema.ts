import mongoose, { Model }  from "mongoose"
import bcrypt from "bcrypt"
import { IUser } from "../types/types"

const { Schema, model } = mongoose
export interface IUserDocument extends IUser, Document {}

export interface IUserModel extends Model<IUser> {
  checkCredentials: (email: string, plainPw: string) => Promise<IUser | null>;
}

const UsersSchema = new Schema(
  {
    username: { type: String, required: true, unique:true},
    email: { type: String, required: true, unique:true},
    avatar: { type: String, required: true, default: "https://ui-avatars.com/api/?name=John+Doe" },
    password: { type: String },
    refreshToken :{ type : String}
  },

  {
    timestamps: true,
  }
)

UsersSchema.pre("save", async function (next) {
   
    const newUser = this 
    const plainPw = newUser.password
  
    if (newUser.isModified("password")) {
      const hash = await bcrypt.hash(plainPw, 11)
      newUser.password = hash
    }
    next()
  })

UsersSchema.methods.toJSON = function() {
    const userDocument = this
    const userObject = userDocument.toObject()
    delete userObject.password
    // delete userObject.refreshToken
    return userObject
}

UsersSchema.statics.checkCredentials = async function(email, plainPW) {

    const user = await this.findOne({email})
    if(user) {
        const isMatch  = await bcrypt.compare(plainPW, user.password)
        
        const result = isMatch? user : null

        return result
    }else return null
}
export default model("User", UsersSchema)
