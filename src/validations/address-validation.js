import Joi from 'joi';

const createAddressValidation = Joi.object({
  street: Joi.string().max(255).required(),
  city: Joi.string().max(100).required(),
  province: Joi.string().max(100).required(),
  country: Joi.string().max(100).required(),
  postal_code: Joi.string().max(100).required(),
});
