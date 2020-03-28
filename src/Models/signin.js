import Joi from "joi";

const signinValidation = data => {
  const schema = {
    email: Joi.string()
      .email()
      .min(3)
      .max(150)
      .trim()
      .required(),
    password: Joi.string()
      .trim()
      .max(150)
      .required()
      .regex(/^[0-9]{7,10}$/)
  };
  return Joi.validate(data, schema);
};

export default signinValidation;
