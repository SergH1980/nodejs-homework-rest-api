const express = require("express");

const { validateContact } = require("../../decorators/");

const contactSchema = require("../../schemas/contact-schema");

const contactController = require("../../controllers/contact-controllers");

const router = express.Router();

router.get("/", contactController.getAllContacts);

router.get("/:contactId", contactController.getContactById);

router.post("/", validateContact(contactSchema), contactController.addContact);

router.put("/:contactId", contactController.updateContact);

router.delete("/:contactId", contactController.removeContact);

module.exports = router;
