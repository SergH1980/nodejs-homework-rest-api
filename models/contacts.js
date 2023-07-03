const fs = require("fs/promises");

const path = require("node:path");
const crypto = require("node:crypto");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, { encoding: "utf8" });
  return JSON.parse(data);
};

const updateContacts = async (contacts) => {
  return await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  return contact;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();

  const savedContact = contacts.filter((contact) => contact.id !== contactId);
  if (contacts.length === savedContact.length) {
    return null;
  }
  await fs.writeFile(contactsPath, JSON.stringify(savedContact, null, 2));
  return "Success";
};

const addContact = async (body) => {
  const contacts = await listContacts();
  const newContact = { id: crypto.randomUUID(), ...body };

  contacts.push(newContact);

  await updateContacts(contacts);

  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  let { name, email, phone } = body;
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }

  if (!name) {
    name = contacts[index].name;
  }
  if (!email) {
    email = contacts[index].email;
  }
  if (!phone) {
    phone = contacts[index].phone;
  }

  contacts[index] = {
    id: contactId,
    name,
    email,
    phone,
  };

  await updateContacts(contacts);
  return contacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
