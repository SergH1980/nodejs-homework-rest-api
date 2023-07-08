const express = require("express");

const { validateContact } = require("../../decorators/");

const isValidId = require("../../middlewares/isValidId");

const {
  contactAddSchema,
  updateFavoriteSchema,
} = require("../../schemas/contact-schema");

const contactController = require("../../controllers/contact-controllers");

const router = express.Router();

router.get("/", contactController.getAllContacts);

router.get("/:contactId", isValidId, contactController.getContactById);

router.post(
  "/",
  validateContact(contactAddSchema),
  contactController.addContact
);

router.put("/:contactId", isValidId, contactController.updateContact);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateContact(updateFavoriteSchema),
  contactController.updateContactStatus
);

router.delete("/:contactId", isValidId, contactController.removeContact);

module.exports = router;
