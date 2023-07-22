const express = require("express");

const { validateUser } = require("../../decorators/");

const {
  userAddSchema,
  updateSubscriptionSchema,
  userLoginSchema,
} = require("../../schemas/user-schema");

const { isValidToken, upload } = require("../../middlewares");

const authController = require("../../controllers/auth");

const router = express.Router();
const jsonParser = express.json();

router.post(
  "/register",
  jsonParser,
  validateUser(userAddSchema),
  authController.registration
);

router.post(
  "/login",
  jsonParser,
  validateUser(userLoginSchema),
  authController.login
);
router.post("/logout", isValidToken, authController.logout);
router.get("/current", isValidToken, authController.current);
router.patch(
  "/",
  isValidToken,
  jsonParser,
  validateUser(updateSubscriptionSchema),
  authController.subscriptionUpdate
);

router.patch(
  "/avatars",
  isValidToken,
  upload.single("avatar"),
  authController.updateAvatar
);

module.exports = router;
