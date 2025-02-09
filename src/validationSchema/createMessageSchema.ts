import Joi from "joi";

export default Joi.object().keys({
    content: Joi.string().required(),
    sender: Joi.number().required(),
});
