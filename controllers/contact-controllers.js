const { Contact } = require("../models/contact");
const { clientHttpError } = require("../helpers");
const { ctrlWrapper } = require("../decorators");

const getAllContacts = async (req, res) => {
  const result = await Contact.find({}, "-createdAt -updatedAt");

  res.json(result);
};

const getContactById = async (req, res) => {
  const contactId = req.params.contactId;
  const result = await Contact.findById(contactId);
  if (!result) {
    throw clientHttpError(404, "Not found");
    // return res.status(404).send({ message: "Not found" });
  }
  res.status(200).json(result);
};

const addContact = async (req, res) => {
  const body = req.body;
  const result = await Contact.create(body);
  res.status(201).json(result);
};

const updateContact = async (req, res, next) => {
  const contactId = req.params.contactId;
  const body = req.body;
  const { name, email, phone, favorite } = body;
  if (!name && !email && !phone && !favorite) {
    throw clientHttpError(400, "Bad request");
    // return res.status(400).send({ message: "Bad request" });
  }
  const result = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });
  if (!result) {
    throw clientHttpError(404, "Not found");
    // return res.status(404).send({ message: "Not found" });
  }
  res.status(200).json(result);
};

const updateContactStatus = async (req, res, next) => {
  const contactId = req.params.contactId;

  const body = req.body;
  const { favorite } = body;

  if (favorite === undefined) {
    throw clientHttpError(400, "Missing field favorite");
  }

  const result = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });

  if (!result) {
    throw clientHttpError(404, "Not found");

    // return res.status(404).send({ message: "Not found" });
  }
  res.status(200).json(result);
};

const removeContact = async (req, res, next) => {
  const contactId = req.params.contactId;
  const result = await Contact.findByIdAndRemove(contactId, {
    new: true,
  });
  if (!result) {
    throw clientHttpError(404, "Not found");

    // return res.status(404).send({ message: "Not found" });
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
