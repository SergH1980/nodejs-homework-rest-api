const express = require("express");

const { validateContact } = require("../../decorators/");

const { isValidId, isValidToken } = require("../../middlewares");

const {
  contactAddSchema,
  updateFavoriteSchema,
} = require("../../schemas/contact-schema");

const contactController = require("../../controllers/contact-controllers");

const router = express.Router();

router.get("/", isValidToken, contactController.getAllContacts);

router.get(
  "/:contactId",
  isValidToken,
  isValidId,
  contactController.getContactById
);

router.post(
  "/",
  isValidToken,
  validateContact(contactAddSchema),
  contactController.addContact
);

router.put(
  "/:contactId",
  isValidToken,
  isValidId,
  contactController.updateContact
);

router.patch(
  "/:contactId/favorite",
  isValidToken,
  isValidId,
  validateContact(updateFavoriteSchema),
  contactController.updateContactStatus
);

router.delete(
  "/:contactId",
  isValidToken,
  isValidId,
  contactController.removeContact
);

module.exports = router;
