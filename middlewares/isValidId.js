const { isValidObjectId } = require(`mongoose`);

const isValidId = (req, res, next) => {
  const id = req.params.contactId;
  console.log(req.params);
  if (!isValidObjectId(id)) {
    next(res.status(400).send({ message: `${id} in not a valid id` }));
  }
  next();
};

module.exports = isValidId;
