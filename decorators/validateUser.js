const validateUser = (schema) => {
  const func = (req, res, next) => {
    const validationCheck = schema.validate(req.body);
    if (validationCheck.error !== undefined) {
      return res.status(400).send("Validation error");
    }
    next();
  };
  return func;
};

module.exports = validateUser;
