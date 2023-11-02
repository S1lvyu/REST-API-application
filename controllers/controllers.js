const {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
  updateContactStatus,
} = require("../services/index.js");
const get = async (req, res, next) => {
  try {
    const results = await getAllContacts();

    res.status(200).json({
      status: "Success",
      code: 200,
      data: results,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
    });
  }
};

const getById = async (req, res, next) => {
  const id = req.params.contactId;
  try {
    const result = await getContactById(id);

    res.status(200).json({
      status: "Success",
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: "Contact not found",
    });
  }
};
const add = async (req, res, next) => {
  const contact = req.body;
  console.log(contact);
  try {
    const result = await createContact(contact);
    console.log("Contact added");
    res.status(201).json({
      status: "Success",
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "Missing required fields",
    });
  }
};
const remove = async (req, res, next) => {
  const id = req.params.contactId;

  try {
    const result = await deleteContact(id);
    console.log("Contact removed");
    res.status(200).json({
      status: "Success",
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: "Contact not found",
    });
  }
};
const update = async (req, res, next) => {
  const id = req.params.contactId;
  const data = req.body;

  try {
    const result = await updateContact(id, data);
    console.log("Contact updated");
    res.status(201).json({
      status: "Success",
      code: 201,
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: "Contact not found",
    });
  }
};
const updateStatus = async (req, res, next) => {
  const id = req.params.contactId;
  const status = req.body;
  if (Object.keys(status).length === 0) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "missing field favorite",
    });
  }
  try {
    const result = await updateContactStatus(id, status);
    console.log("Contact status updated");
    res.status(200).json({
      status: "Success",
      code: 200,
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: "Contact not found",
    });
  }
};
module.exports = {
  get,
  getById,
  add,
  remove,
  update,
  updateStatus,
};
