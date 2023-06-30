const express = require("express");
const {
  registerUser,
  loginUser,
  Logout,
  GetUserData,
  updateLocation,
  Getbuslocations,
} = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/newlocation", updateLocation);
router.get("/logout", Logout);
router.post("/profile", GetUserData);
router.post("/buslocation", Getbuslocations);
module.exports = router;
