import Joi from "joi";

export const nameSchema = Joi.string().min(20).max(60).required();
export const addressSchema = Joi.string().max(400).allow("", null);
export const passwordSchema = Joi.string()
  .min(8)
  .max(16)
  .pattern(new RegExp("(?=.*[A-Z])")) 
  .pattern(new RegExp("(?=.*[!@#$%^&*(),.?\":{}|<>])"))
  .required();
export const emailSchema = Joi.string().email().required();
export const roleSchema = Joi.string().valid("ADMIN", "USER", "OWNER");

export function validateRegistration(req, res, next) {
  const schema = Joi.object({
    name: nameSchema,
    email: emailSchema,
    address: addressSchema,
    password: passwordSchema,
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
}
