const Contact = require("./schemas/contactSchema.js");
const User = require("./schemas/usersSchema.js");
const nodeMailer = require("nodemailer");
const nanoid = require("nanoid");
require("dotenv").config();
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
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("Email already in use");
    }

    const verificationToken = nanoid();

    const transporter = nodeMailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.OUTLOOK_EMAIL,
        pass: process.env.OUTLOOK_PASS,
      },
    });

    const mailOptions = {
      from: process.env.OUTLOOK_EMAIL,
      to: email,
      subject: "Email Verification",
      html: `<p>For account verification click on the following link<b><a  href="http://localhost:3000/api/contacts/users/verify/${verificationToken}">
              Click Here!
            </a>
          </b>
        </p>`,
    };
    transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    const newUser = new User({
      email,
      password,
      verificationToken: verificationToken,
    });
    newUser.setPassword(password);

    return await newUser.save();
  } catch (error) {
    throw error;
  }
};
const loginUser = async ({ email, password, token }) => {
  const user = await User.findOne({ email });

  if (!user || !user.validPassword(password)) {
    throw new Error("Wrong email or password");
  }
  if (!user.verify) {
    throw new Error("Before login you have to verify your email address");
  }
  user.setToken(token);
  await user.save();
  return user;
};

const findAccount = async (user) => {
  const result = await User.findOne({ email: user.email });
  return result;
};
const verifyEmail = async (verificationToken) => {
  const update = { verify: true, verificationToken: null };

  const result = await User.findOneAndUpdate(
    {
      verificationToken,
    },
    { $set: update },
    { new: true }
  );

  if (!result) throw new Error("User not found");
};
const verifyUser = async (email) => {
  const result = await User.findOne({ email });
  if (!result) throw new Error("User not found");
  const verificationToken = result.verificationToken;

  if (!verificationToken)
    throw new Error("Verification has already been passed");
  const transporter = nodeMailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.OUTLOOK_EMAIL,
      pass: process.env.OUTLOOK_PASS,
    },
  });

  const mailOptions = {
    from: process.env.OUTLOOK_EMAIL,
    to: email,
    subject: "Email Verification",
    html: `<p>For account verification click on the following link<b><a  href="http://localhost:3000/api/contacts/users/verify/${verificationToken}">
              Click Here!
            </a>
          </b>
        </p>`,
  };
  transporter.sendMail(mailOptions);
  console.log("Email sent successfully");
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
  verifyEmail,
  verifyUser,
};
