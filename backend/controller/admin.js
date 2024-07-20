import jwt from "jsonwebtoken";
import { compare, hash } from "bcrypt";
import Admin from "../models/admin.js";
import { matchedData, validationResult } from "express-validator";
import customError, {
  errorResponse,
  successfulResponse,
  validationErrorResponse,
} from "../utils/response.js";

export const registerAdmin = async (req, res) => {
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const { name, email, password } = matchedData(req);
      const hashedPassword = await hash(password, 10);
      const admin = await Admin.create({
        name,
        email,
        password: hashedPassword,
      });
      successfulResponse(res, 201, "Registered Successfully", {
        id: jwt.sign({ _id: admin.id }, process.env.authSecret),
        name: admin.name,
      });
    } else validationErrorResponse(res, result.array());
  } catch (error) {
    errorResponse(error, res);
  }
};

export const adminLogin = async (req, res) => {
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const { email, password } = matchedData(req);
      const admin = await Admin.findOne({ email }).select("+password");
      if (!admin) throw new customError("No admin registered with email", 404);
      else if (!(await compare(password, admin.password)))
        throw new customError("Invalid email or password", 401);
      else
        successfulResponse(res, 200, "Logined successfully", {
          id: jwt.sign({ _id: admin._id }, process.env.authSecret),
          name: admin.name,
        });
    } else validationErrorResponse(res, result.array());
  } catch (error) {
    errorResponse(error, res);
  }
};

export const getAdmin = async (req, res) => {
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const id = matchedData(req).id;
      const admin = await Admin.findById(
        jwt.verify(id, process.env.authSecret)
      );
      if (!admin) throw new customError("Invalid id", 400);
      successfulResponse(res, 200, "Data fetched successfully", {
        name: admin.name,
      });
    } else validationErrorResponse(res, result.array());
  } catch (error) {
    errorResponse(error, res);
  }
};
