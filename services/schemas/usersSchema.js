const moongose = require("mongoose");
const bCrypt = require("bcryptjs");
const Schema = moongose.Schema;
const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
});

userSchema.methods.setPassword = function (password) {
  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6));
};

userSchema.methods.validPassword = function (password) {
  return bCrypt.compareSync(password, this.password);
};
userSchema.methods.setToken = function (token) {
  this.token = token;
};
const User = moongose.model("users", userSchema);
module.exports = User;
