const fs = require("fs").promises;
const { error } = require("console");
const path = require("path");
const contactsPath = path.join(__dirname, "contacts.json");
const { addSchema, schemaUpdate } = require("./joiSchemas");
const nanoid = require("nanoid");
const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    console.error(`Reading file error : ${error}`);
    throw error;
  }
};

const getContactById = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    if (!contacts.some((contact) => contact.id === contactId)) {
      throw error;
    }
    const contact = contacts.filter((item) => item.id === contactId);

    return contact;
  } catch (error) {
    console.error(`Getting contact by Id error : ${error}`);
    throw error;
  }
};

const removeContact = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    if (contacts.some((contact) => contact.id === contactId) === false) {
      throw error;
    }
    const newContacts = contacts.filter((item) => item.id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
    return newContacts;
  } catch (error) {
    console.error(`Deleting contact error : ${error}`);
    throw error;
  }
};

const addContact = async (body) => {
  try {
    await addSchema.validateAsync(body, { abortEarly: false });

    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const newContact = { id: nanoid(), ...body };

    contacts.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return newContact;
  } catch (error) {
    console.error(`Adding contact error: ${error.message}`);
    throw error;
  }
};

const updateContact = async (contactId, body) => {
  try {
    await schemaUpdate.validateAsync(body, { abortEarly: false });
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);

    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
      throw new Error("Contact not found");
    }

    const updatedContact = { ...contacts[index], ...body };
    contacts[index] = updatedContact;

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return updatedContact;
  } catch (error) {
    console.error(`Editing contact error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
