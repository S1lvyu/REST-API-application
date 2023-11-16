const express = require("express");

const router = express.Router();
const controller = require("../../controllers/controllers");

router.get("/", controller.get);

router.get("/:contactId", controller.getById);

router.post("/", controller.add);

router.delete("/:contactId", controller.remove);

router.put("/:contactId", controller.update);

router.patch("/:contactId/favorite", controller.updateStatus);

module.exports = router;
