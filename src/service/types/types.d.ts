interface IUser extends Doucment {
    _id?:string,
	username: string
	email: string
	avatar?: string,
   password?:  string,
   refreshToken?: string
}

interface ILogin{
    _id:string,
    username:string
};