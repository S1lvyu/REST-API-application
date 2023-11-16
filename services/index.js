const User = require("./schemas/contactSchema.js");

const getAllContacts = async () => {
  return User.find();
};
const getContactById = async (id) => {
  return User.findById(id);
};
const createContact = async (contact) => {
  return User.create({ ...contact });
};
const deleteContact = async (id) => {
  return User.findByIdAndDelete(id);
};
const updateContact = async (id, data) => {
  return User.findByIdAndUpdate(id, data, { new: true });
};
const updateContactStatus = async (id, data) => {
  return User.findByIdAndUpdate(id, data, { new: true });
};
module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
  updateContactStatus,
};
