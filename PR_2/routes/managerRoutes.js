const express = require("express");
const router = express.Router();
const managerController = require("../controllers/managerController");

router.post("/add", managerController.addManager);
router.get("/all", managerController.getAllManagers);
router.delete("/delete/:id", managerController.deleteManager);
router.put("/update/:id", managerController.updateManager);
router.get("/search", managerController.searchManagers);
router.get("/pagination", managerController.getPaginatedManagers);
router.post("/delete-multiple", managerController.deleteMultipleManagers);

module.exports = router;
