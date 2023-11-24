const moongose = require("mongoose");
const moongosePaginate = require("mongoose-paginate-v2");
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
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});
contact.plugin(moongosePaginate);
const Contact = moongose.model("contacts", contact);
module.exports = Contact;
