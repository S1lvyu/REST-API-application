const express = require("express");
const { auth } = require("../../middlewares/auth");
const router = express.Router();
const controller = require("../../controllers/controllers");

router.get("/", auth, controller.get);

router.get("/:contactId", auth, controller.getById);

router.post("/", auth, controller.add);

router.delete("/:contactId", auth, controller.remove);

router.put("/:contactId", auth, controller.update);

router.patch("/:contactId/favorite", auth, controller.updateStatus);

router.post("/users/signup", controller.createAccount);

router.post("/users/login", controller.loginAccount);

router.get("/users/logout", controller.logoutAccount);

router.get("/users/current", controller.getAccount);

router.patch("/users", auth, controller.updateSubscription);

module.exports = router;
