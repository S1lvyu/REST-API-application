const express = require("express");

const router = express.Router();
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts.js");

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json({
      status: "success",
      code: 200,
      data: { ...contacts },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: "listing contacts error",
    });
  }
});

router.get("/:contactId", async (req, res, next) => {
  const id = req.params.contactId;

  try {
    const contact = await getContactById(id);
    res.status(200).json({
      status: "success",
      code: 200,
      data: { ...contact },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: "Not Found",
    });
  }
});

router.post("/", async (req, res, next) => {
  const contact = req.body;

  try {
    const data = await addContact(contact);
    res.status(201).json({
      status: "success",
      code: 201,
      data: { ...data },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "missing required name field",
    });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const id = req.params.contactId;

  try {
    await removeContact(id);
    res.status(200).json({
      status: "success",
      code: 200,
      data: { message: "contact deleted" },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: "Not Found",
    });
  }
});

router.put("/:contactId", async (req, res, next) => {
  const id = req.params.contactId;
  const updateData = req.body;
  try {
    const data = await updateContact(id, updateData);
    res.status(201).json({
      status: "success",
      code: 201,
      data: { ...data },
    });
  } catch (error) {
    if (error.message === "Contact not found") {
      res.status(404).json({
        status: "error",
        code: 404,
        message: "Contact not found",
      });
    } else {
      res.status(400).json({
        status: "error",
        code: 400,
        message: "Missing fields",
      });
    }
    console.log(error.message);
  }
});

module.exports = router;
