import Joi from "joi";

export default Joi.object().keys({
    name: Joi.string().required()
})
