
import { checkSchema, validationResult } from "express-validator";
import { RequestHandler } from "express";
import createHttpError from "http-errors";

interface ValidatorInterface {
username :{
  in: string[],
  isString:{
    errorMessage:string
  }
},
email :{
  in: string[],
  isString:{
    errorMessage:string
  }
}
}

const schema : any = {
    username: {
      in: ["body"],
      isString: {
        errorMessage: "username validation failed , type must be string  ",
      },
    },
    email: {
      in: ["body"],
      isString: {
        errorMessage: "email validation failed , type must be  string ",
      },
    }
}

export const checkUserSchema = checkSchema(schema)

export const checkValidationResult: RequestHandler = (req, res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // const error = new Error("User validation is failed");
    
      next(createHttpError(400,errors));
    }
    next();
  };