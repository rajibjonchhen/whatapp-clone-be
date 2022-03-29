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
               
                name : profile.name.givenName,
                surname : profile.name.familyName || "not set",
                email : profile.emails[0].value,
                avatar : profile.photos[0].value,
                username : profile.emails[0].value.split("@")[0],
                googleId : profile.id
            })
            const savedUser = await newUser.save()
            const {accessToken, refreshToken} = await authenticateUser(savedUser)
            console.log("new user saved and token is", token)
            passportNext(null,{accessToken, refreshToken})
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