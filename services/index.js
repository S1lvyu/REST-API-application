const Contact = require("./schemas/contactSchema.js");
const User = require("./schemas/usersSchema.js");

const getAllContacts = async (page, limit, favorite) => {
  const options = {
    page: page || 1,
    limit: limit || 20,
  };
  const query = favorite ? { favorite: true } : {};

  const result = await Contact.paginate(query, options);

  return result;
};
const getContactById = async (id) => {
  return Contact.findById(id);
};
const createContact = async (contact) => {
  return Contact.create({ ...contact });
};
const deleteContact = async (id) => {
  return Contact.findByIdAndDelete(id);
};
const updateContact = async (id, data) => {
  return Contact.findByIdAndUpdate(id, data, { new: true });
};
const updateContactStatus = async (id, data) => {
  return Contact.findByIdAndUpdate(id, data, { new: true });
};
const createUser = async ({ email, password }) => {
  try {
    const newUser = new User({ email, password });
    newUser.setPassword(password);

    return await newUser.save();
  } catch (error) {
    throw error;
  }
};
const loginUser = async ({ email, password, token }) => {
  try {
    const user = await User.findOne({ email });

    if (!user || !user.validPassword(password)) {
      throw new Error("Wrong email or password");
    }

    user.setToken(token);
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

const findAccount = async (user) => {
  const result = await User.findOne({ email: user.email });
  return result;
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
  updateContactStatus,
  createUser,
  loginUser,
  findAccount,
};
