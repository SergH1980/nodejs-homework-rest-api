const { Contact } = require("../models/contact");
const { clientHttpError } = require("../helpers");
const { ctrlWrapper } = require("../decorators");

// all contacts
const getAllContacts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  // removing keys "page" and "limit" from query

  const queryKeys = Object.keys(req.query).filter(
    (key) => key !== "page" && key !== "limit"
  );

  const queryList = {
    owner: req.user.id,
  };

  if (queryKeys.length !== 0) {
    queryKeys.forEach((key) => {
      queryList[key] = `${req.query[key]}`;
    });
  }

  const result = await Contact.find(
    queryList,

    "-createdAt -updatedAt",
    {
      skip,
      limit: Number(limit),
    }
  ).populate("owner", "email subscription");
  return res.json(result);
};

// get contact by Id

const getContactById = async (req, res) => {
  const contactId = req.params.contactId;
  const result = await Contact.findOne({ _id: contactId, owner: req.user.id });
  if (!result) {
    throw clientHttpError(404, "Not found");
  }
  res.status(200).json(result);
};

// add contact

const addContact = async (req, res) => {
  const isRepeat = await Contact.findOne({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  });
  if (isRepeat !== null) {
    return res.status(409).send({ message: "Contact already exists" });
  }
  const body = { ...req.body, owner: req.user.id };
  const result = await Contact.create(body);
  res.status(201).json(result);
};

const updateContact = async (req, res, next) => {
  const contactId = req.params.contactId;
  const body = req.body;
  const { name, email, phone, favorite } = body;
  if (!name && !email && !phone && !favorite) {
    throw clientHttpError(400, "Bad request");
  }

  const contact = await Contact.findOne({ _id: contactId });

  if (contact === null) {
    throw clientHttpError(404, "Not found");
  }

  if (contact.owner.valueOf() !== req.user.id) {
    throw clientHttpError(403, "No permission to update");
  }
  const result = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });
  if (!result) {
    throw clientHttpError(404, "Not found");
  }

  // const result = await Contact.findOneAndUpdate(
  //   { _id: contactId, owner: req.user.id },
  //   body,
  //   {
  //     new: true,
  //   }
  // );
  // if (!result) {
  //   throw clientHttpError(404, "Not found");
  // }
  res.status(200).json(result);
};

const updateContactStatus = async (req, res, next) => {
  const contactId = req.params.contactId;

  const body = req.body;
  const { favorite } = body;

  if (favorite === undefined) {
    throw clientHttpError(400, "Missing field favorite");
  }

  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner: req.user.id },
    body,
    {
      new: true,
    }
  );

  if (!result) {
    throw clientHttpError(404, "Not found");
  }
  res.status(200).json(result);
};

const removeContact = async (req, res, next) => {
  const contactId = req.params.contactId;
  const result = await Contact.findOneAndRemove(
    { _id: contactId, owner: req.user.id },
    {
      new: true,
    }
  );
  if (!result) {
    throw clientHttpError(404, "Not found");
  }

  if (result.owner.valueOf() !== req.user.id) {
    throw clientHttpError(403, "No permission to delete");
  }

  res.status(200).json({ message: "Contact deleted" });
};

module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  updateContact: ctrlWrapper(updateContact),
  updateContactStatus: ctrlWrapper(updateContactStatus),
  removeContact: ctrlWrapper(removeContact),
};
