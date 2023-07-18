const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ctrlWrapper } = require("../decorators");
const { clientHttpError } = require("../helpers");

const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const { User } = require("../models/user");

async function registration(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user !== null) {
      return res.status(409).json({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await User.create({ email, password: passwordHash });

    res.status(201).send({
      user: { email: result.email, subscription: result.subscription },
    });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user === null) {
      throw clientHttpError(401, "Email or password is wrong");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      throw clientHttpError(401, "Email or password is wrong");
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    await User.updateOne({ _id: user._id }, { $set: { token } });

    return res.status(200).json({
      token: token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (err) {
    return next(err);
  }
}

async function logout(req, res, next) {
  const user = await User.findOneAndUpdate(
    { _id: req.user.id },
    { $set: { token: null } }
  );

  if (user === null) {
    throw clientHttpError(401, "Not authorized");
  }

  return res.status(204);
}

async function current(req, res, next) {
  const user = await User.findOne({ _id: req.user.id });

  if (user === null) {
    throw clientHttpError(401, "Not authorized");
  }

  return res
    .status(200)
    .send({ email: user.email, subscription: user.subscription });
}

async function subscriptionUpdate(req, res, next) {
  const user = await User.findOne({ _id: req.user.id });
  if (user === null) {
    throw clientHttpError(404, "Not found");
  }
  const result = await User.findOneAndUpdate({ _id: req.user.id }, req.body, {
    new: true,
  });
  res.status(200).json(result);
}

module.exports = {
  registration: ctrlWrapper(registration),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  current: ctrlWrapper(current),
  subscriptionUpdate: ctrlWrapper(subscriptionUpdate),
};
