import Joi from "joi";

const signupValidation = data => {
  const schema = {
    firstName: Joi.string()
      .min(4)
      .max(150)
      .required(),
    lastName: Joi.string()
      .min(4)
      .max(150)
      .required(),
    email: Joi.string()
      .email()
      .min(3)
      .max(150)
      .required(),
    password: Joi.string()
      .trim()
      .max(150)
      .required()
      .regex(/^[0-9]{7,10}$/),
    address: Joi.string()
      .trim()
      .max(350),
    bio: Joi.string()
      .max(25)
      .lowercase(),
    occupation: Joi.string()
      .min(6)
      .max(30)
      .required(),
    expertise: Joi.string()
      .min(6)
      .max(30)
      .required(),
    isAdmin: Joi.number()
      .integer()
      .max(1),
    role: Joi.string()
  };
  return Joi.validate(data, schema);
};

export default signupValidation;
