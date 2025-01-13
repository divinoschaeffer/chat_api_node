import Joi from 'joi';

export default Joi.object().keys({
    name: Joi.string().min(5).max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).alphanum().required(),
})