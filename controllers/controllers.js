const {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
  updateContactStatus,
  createUser,
  loginUser,
  findAccount,
} = require("../services/index.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;
const get = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const favorite = req.query.favorite === "true";
    const results = await getAllContacts(page, limit, favorite);

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

const createAccount = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log(email);

    const payload = { email: email };

    const result = await createUser({
      email,
      password,
    });

    res.status(201).json({
      status: "succes",
      code: 201,
      data: {
        user: {
          email: result.email,
          subscription: result.subscription,
        },
      },
    });
  } catch (error) {
    if (error.message === "Illegal arguments: undefined, string") {
      res.status(400).json({
        status: 400,
        error: "Missing email or password",
      });
    } else if (
      error.message ===
      'E11000 duplicate key error collection: db-contacts.users index: email_1 dup key: { email: "example@example.com" }'
    ) {
      res.status(409).json({
        status: 409,
        error: "email in use",
      });
    }
  }
};
const loginAccount = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const payload = { email: email };

    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    const result = await loginUser({
      email,
      password,
      token,
    });
    result.setToken(token);
    res.status(201).json({
      status: "succes",
      code: 201,
      data: {
        token: token,
        user: {
          email: result.email,
          subscription: result.subscription,
        },
      },
    });
  } catch (error) {
    if (error.message === "Wrong email or password") {
      res.status(401).json({
        status: 401,
        message: "Email or password is wrong",
      });
    }
    res.status(400).json({
      status: 400,
      error: error.message,
    });
  }
};

const logoutAccount = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ status: 401, message: "Not authorized" });
    }
    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, secret);

    const user = await findAccount(decodedToken);
    user.setToken(null);
    await user.save();
    if (user) {
      res.status(204).json({
        status: "success",
        code: 204,
      });
    } else {
      res.status(404).json({ status: "404", message: "User not found" });
    }
  } catch (error) {
    if (error.message === "invalid token") {
      res.status(401).json({ status: 401, message: "Not authorized" });
    }

    res.status(500).json({ status: "error", message: "Server error" });
  }
};
const getAccount = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ status: 401, message: "Not authorized" });
    }
    const token = authHeader.split(" ")[1];

    const user = jwt.verify(token, secret);

    const result = await findAccount({ email: user.email });

    if (result) {
      res.status(200).json({
        status: "success",
        code: 200,
        data: {
          email: result.email,
          subscription: result.subscription,
        },
      });
    } else {
      res.status(404).json({ status: "404", message: "User not found" });
    }
  } catch (error) {
    if (error.message === "invalid token") {
      res.status(401).json({ status: 401, message: "Not authorized" });
    }

    res.status(500).json({ status: "error", message: "Server error" });
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const { subscription } = req.body;
    const allowedSubscriptions = ["starter", "pro", "business"];

    if (!allowedSubscriptions.includes(subscription)) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message:
          "Invalid subscription value. Allowed values: starter, pro, business",
      });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ status: 401, message: "Not authorized" });
    }
    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, secret);
    console.log(decodedToken.email);
    const user = await findAccount(decodedToken);

    if (!user) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "User not found",
      });
    }

    user.subscription = subscription;
    await user.save();

    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (error) {
    console.log(error.message);
    console.error(error);
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal Server Error",
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
  createAccount,
  loginAccount,
  logoutAccount,
  getAccount,
  updateSubscription,
};
