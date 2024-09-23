import Joi from "joi";

const signUpJoi = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().min(5).max(30).required(),
  password: Joi.string().min(8).required(),
});

export default signUpJoi;
