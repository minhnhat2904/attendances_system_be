import Joi from "joi";
import { validateRequest } from "../utils";
/* auth */
const loginAdminRequest = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().alphanum().min(0).max(50).empty("").required(),
  });
  validateRequest(req, next, schema);
};

const createUserRequest = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().alphanum().required().min(6).max(50),
    role: Joi.required(),
    department: Joi.required(),
    name: Joi.string(),
    birthday: Joi.string(),
    phone: Joi.string(),
    address: Joi.string(),
  });

  validateRequest(req, next, schema);
}

export const validateRequestBody = {
  loginAdminRequest,
  createUserRequest
};
