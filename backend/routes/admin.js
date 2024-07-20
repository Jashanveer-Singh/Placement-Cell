import express from "express";
import { adminLogin, getAdmin, registerAdmin } from "../controller/admin.js";
import {
  validateEmail,
  validateID,
  validateName,
  validatePassword,
} from "../utils/validators.js";
const router = express.Router();

router.post(
  "/register",
  [validateEmail, validateName(), validatePassword],
  registerAdmin
);
router.post("/login", [validateEmail, validatePassword], adminLogin);
router.get("/get/:id", [validateID], getAdmin);

export default router;
