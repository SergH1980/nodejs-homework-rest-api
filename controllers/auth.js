const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

const { ctrlWrapper } = require("../decorators");
const { clientHttpError } = require("../helpers");

const dotenv = require("dotenv");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const { User } = require("../models/user");

const avatarDir = path.join(__dirname, `../`, `public`, `avatars`);

// registration
async function registration(req, res, next) {
  try {
    const { email, password, subscription } = req.body;

    const user = await User.findOne({ email });

    if (user !== null) {
      return res.status(409).json({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const avatarUrl = gravatar.url(email);

    const result = await User.create({
      ...req.body,
      password: passwordHash,
      subscription,
      avatarUrl,
    });

    res.status(201).send({
      user: {
        email: result.email,
        subscription: result.subscription,
        avatarUrl: result.avatarUrl,
      },
    });
  } catch (err) {
    return next(err);
  }
}

// login
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

// logout

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

// current

async function current(req, res, next) {
  const user = await User.findOne({ _id: req.user.id });

  if (user === null) {
    throw clientHttpError(401, "Not authorized");
  }

  return res
    .status(200)
    .send({ email: user.email, subscription: user.subscription });
}

// update subscription

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

// update avatar

async function updateAvatar(req, res, next) {
  if (!req.file) {
    throw clientHttpError(401, "Not authorized");
  }
  const { id } = req.user;

  const { path: tempUpload, originalname } = req.file;

  await Jimp.read(tempUpload)
    .then((avatar) => {
      return avatar.resize(250, 250).quality(60).write(tempUpload);
    })
    .catch((err) => {
      throw err;
    });

  const fileName = `${id}_${originalname}`;

  const publicUpload = path.join(avatarDir, fileName);

  await fs.rename(tempUpload, publicUpload);

  const avatarUrl = path.join(`avatars`, fileName);

  await User.findByIdAndUpdate(id, { avatarUrl });

  res.status(200).json({ avatarUrl });
}

module.exports = {
  registration: ctrlWrapper(registration),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  current: ctrlWrapper(current),
  subscriptionUpdate: ctrlWrapper(subscriptionUpdate),
  updateAvatar: ctrlWrapper(updateAvatar),
};
