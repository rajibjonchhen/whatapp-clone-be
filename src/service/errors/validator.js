
import { checkSchema, validationResult } from "express-validator";

const schema = {
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

export const checkValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("User validation is failed");
      error.status = 400;
      error.errors = errors.array();
      next(error);
    }
    next();
  };