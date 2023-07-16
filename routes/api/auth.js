const express = require("express");

const { validateUser } = require("../../decorators/");

const {
  userAddSchema,
  updateSubscriptionSchema,
  userLoginSchema,
} = require("../../schemas/user-schema");

const { isValidToken } = require("../../middlewares");

const AuthController = require("../../controllers/auth");

const router = express.Router();
const jsonParser = express.json();

router.post(
  "/register",
  jsonParser,
  validateUser(userAddSchema),
  AuthController.registration
);

router.post(
  "/login",
  jsonParser,
  validateUser(userLoginSchema),
  AuthController.login
);
router.post("/logout", isValidToken, AuthController.logout);
router.get("/current", isValidToken, AuthController.current);
router.patch(
  "/",
  isValidToken,
  jsonParser,
  validateUser(updateSubscriptionSchema),
  AuthController.subscriptionUpdate
);

module.exports = router;
