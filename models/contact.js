const { Schema, model } = require("mongoose");

const { handleMongooseError } = require("../helpers");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      max: 40,
      validate: {
        validator: function (v) {
          return /^[a-zA-Zа-яА-Я0-9]+(([' -][a-zA-Zа-яА-Я0-9])?[a-zA-Zа-яА-Я0-9]*)*$/.test(
            v
          );
        },
        message: (props) => `${props.value} is not a valid name!`,
      },
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);

const Contact = model("contact", contactSchema);

module.exports = { Contact, contactSchema };
