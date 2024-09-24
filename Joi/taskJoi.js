import Joi from "joi";

const taskJoi = Joi.object({
  name: Joi.string(),

  date: Joi.date().default(Date.now),

  status: Joi.string()
    .valid("todo", "in progress", "completed")
    .default("todo"),

  priority: Joi.string().valid("high", "medium", "normal").default("normal"),

  description: Joi.string().optional(),

  
});

export default taskJoi;
