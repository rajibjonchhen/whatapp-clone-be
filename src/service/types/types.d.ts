export interface IUser extends Doucment {
    _id?:string,
	username: string
	email: string
	avatar?: string,
   password?:  string,
   refreshToken?: string
}

export interface ILogin{
    _id:string,
    username:string
};