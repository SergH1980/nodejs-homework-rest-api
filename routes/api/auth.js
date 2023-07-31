const express = require("express");

const { validateUser } = require("../../decorators/");

const {
  userAddSchema,
  updateSubscriptionSchema,
  userLoginSchema,
  resendVerificationSchema,
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

router.get("/verify/:verificationToken", authController.verify);

router.post(
  "/verify",
  validateUser(resendVerificationSchema),
  authController.resendVerificationEmail
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
