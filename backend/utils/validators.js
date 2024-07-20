import { body, param } from "express-validator";

export const validateName = () =>
  body("name")
    .trim()
    .escape()
    .isString()
    .withMessage("not string type")
    .isLength({ min: 3 })
    .withMessage("length should be at least 3");

export const validatePassword = body("password")
  .isString()
  .withMessage("not string type")
  .isLength({ min: 8 })
  .withMessage("length should be at least 8");

export const validateEmail = body("email")
  .trim()
  .notEmpty()
  .withMessage("empty email")
  .isEmail()
  .withMessage("not an email");

export const validateString = (field, isOptional = true) =>
  isOptional
    ? body(field)
        .isString()
        .withMessage("not a string")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("empty string")
        .optional()
    : body(field)
        .isString()
        .withMessage("not a string")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("empty string");

export const validateArray = (field) =>
  body(field).isArray({ min: 1 }).withMessage("not an array or empty array");

export const validateIsUserDetail = body("requiredUserDetails.*")
  .isString()
  .withMessage("not a string")
  .trim()
  .escape()
  .isIn(["strengths", "weaknesses", "hobbies", "skills", "resume", "cv"]);

export const validateRegistrationOpenedTill = body("registrationOpenedTill")
  .isISO8601()
  .withMessage("Not a ISO8601 format date");

export const validateAcceptedCandidatesIDs = body("appliedCandidatesID.*")
  .isString()
  .withMessage("not a string")
  .notEmpty()
  .withMessage("id is empty");

export const validateDriveId = body("driveID")
  .isString()
  .withMessage("not a string")
  .notEmpty()
  .withMessage("id is empty");

export const validateID = param("id")
  .isString()
  .withMessage("not a string")
  .notEmpty()
  .withMessage("id is empty");
