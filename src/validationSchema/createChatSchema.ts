import Joi from 'joi';

export default Joi.object().keys({
    name: Joi.string(),
    creator: Joi.number().required(),
    users: Joi.array<number>().required().min(2).max(10),
});
