const contactInfo = require("../models/contacts");

const { ctrlWrapper } = require("../decorators");

const getAllContacts = async (req, res) => {
  const result = await contactInfo.listContacts();
  console.log(result);
  res.status(200).json(result);
};

const getContactById = async (req, res) => {
  const contactId = req.params.contactId;
  const result = await contactInfo.getContactById(contactId);
  if (!result) {
    return res.status(404).send({ message: "Not found" });
  }
  res.status(200).json(result);
};

const addContact = async (req, res) => {
  const body = req.body;
  const result = await contactInfo.addContact(body);
  res.status(201).json(result);
};

const updateContact = async (req, res, next) => {
  const contactId = req.params.contactId;
  const body = req.body;
  const { name, email, phone } = body;
  console.log(body);
  if (!name && !email && !phone) {
    return res.status(400).send({ message: "Bad request" });
  }
  const result = await contactInfo.updateContact(contactId, body);
  if (!result) {
    return res.status(404).send({ message: "Not found" });
  }
  res.status(200).json(result);
};

const removeContact = async (req, res, next) => {
  const contactId = req.params.contactId;
  const result = await contactInfo.removeContact(contactId);
  if (!result) {
    return res.status(404).send({ message: "Not found" });
  }
  res.status(200).json({ message: "Contact deleted" });
};

module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  updateContact: ctrlWrapper(updateContact),
  removeContact: ctrlWrapper(removeContact),
};
