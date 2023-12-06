const express = require("express");
const { auth } = require("../../middlewares/auth");
const { upload } = require("../../middlewares/upload");
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
router.get(
  "/users/verify/:verificationToken",
  controller.verifyEmailController
);
router.post("/users/verify", controller.verifyUserController);

router.patch("/users", auth, controller.updateSubscription);

router.patch(
  "/users/avatars",
  auth,
  upload.single("avatar"),
  controller.uploadAvatar
);

module.exports = router;
