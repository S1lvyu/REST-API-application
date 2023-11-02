const moongose = require("mongoose");
const Schema = moongose.Schema;
const contact = new Schema({
  name: {
    type: String,
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
});
const Contact = moongose.model("contacts", contact);
module.exports = Contact;
