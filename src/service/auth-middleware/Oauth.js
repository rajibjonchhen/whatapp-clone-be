import passport from 'passport'
import GoogleStrategy from "passport-google-oauth20"
import UsersModel from "../users/users-schema.js"
import { authenticateUser} from './tools.js';

const googleStrategy = new GoogleStrategy({
    clientID : process.env.GOOGLE_ID,
    clientSecret : process.env.GOOGLE_SECRET,
    callbackURL:`${process.env.API_URL}/users/googleRedirect`
},
async(accessToken, refreshToken, profile, passportNext) => {
    try {
        const user = await UsersModel.findOne({email:profile.emails[0].value})
        
        if(user){
            const token = await authenticateUser(user)
            console.log("validated user and token is", token)
            passportNext(null,{token})
        } else{
            
            const newUser = new UsersModel({
                name : profile.name.given_name,
                surname : profile.name.familyName || "not set",
                email : profile.emails[0].value,
                name : profile.name.givenName,
                avatar : profile.photos[0].value,
                googleId : profile.id
            })
            const savedUser = await newUser.save()
            const token = await authenticateUser(savedUser)
            console.log("new user saved and token is", token)
            passportNext(null,{token})
        }
    } catch (error) {
        console.log(error)
        }   
    }
)

passport.serializeUser((data, passportNext)=> {
    passportNext(null,data)
})

export default googleStrategy