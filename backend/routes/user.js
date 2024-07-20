import express from "express";
import {
  validateArray,
  validateEmail,
  validateID,
  validateName,
  validatePassword,
  validateString,
} from "../utils/validators.js";
import {
  getuser,
  updateUser,
  userLogin,
  userRegister,
} from "../controller/user.js";
import {userUploads} from "../utils/multer.js";

const router = express.Router();

router.post(
  "/register",
  [
    validateName(),
    validateEmail,
    validatePassword,
    validateArray("strengths").optional(),
    validateString("strengths.*"),
    validateArray("weaknesses").optional(),
    validateString("weaknesses.*"),
    validateArray("hobbies").optional(),
    validateString("hobbies.*"),
    validateArray("skills").optional(),
    validateString("skills.*"),
    validateString("description"),
    validateArray("achievements").optional(),
    validateString("achievements.*"),
  ],
  userUploads.fields([
    { name: "resume", maxCount: 1 },
    { name: "cv", maxCount: 1 },
    { name: "picture", maxCount: 1 },
  ]),
  userRegister
);
router.post("/login", [validateEmail, validatePassword], userLogin);
router.put(
  "/update/:id",
  [
    validateName().optional(),
    validateArray("strengths").optional(),
    validateString("strengths.*"),
    validateArray("weaknesses").optional(),
    validateString("weaknesses.*"),
    validateArray("hobbies").optional(),
    validateString("hobbies.*"),
    validateArray("skills").optional(),
    validateString("skills.*"),
    validateString("description"),
    validateArray("achievements").optional(),
    validateString("achievements.*"),
    validateID,
  ],
  userUploads.fields([
    { name: "resume", maxCount: 1 },
    { name: "cv", maxCount: 1 },
    { name: "picture", maxCount: 1 },
  ]),
  updateUser
);
router.get("/get/:id", [validateID], getuser);

export default router;
