import { matchedData, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Drive from "../models/drive.js";
import customError, {
  errorResponse,
  successfulResponse,
  validationErrorResponse,
} from "../utils/response.js";
import { compare, hash } from "bcrypt";

export const userRegister = async (req, res) => {
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      let data = matchedData(req);
      data.password = await hash(data.password, 10);
      if (req.file) {
        if (req.file["picture"])
          {if (req.file["picture"][0].mimetype !== "images/jpg")
            throw new customError("Picture should be of jpg type", 400);
        data.picture = req.file["picture"][0].buffer;}
        if (req.file["resume"])
          {if (req.file["resume"][0].mimetype !== "application/pdf")
            throw new customError("Resume should be of pdf type", 400);
        data.resume = req.file["resume"][0].buffer;}
        if (req.file["cv"])
          {if (req.file["cv"][0].mimetype !== "application")
            throw new customError("cv should be of pdf type", 400);
        data.cv = req.file["cv"][0].buffer;}
      }
      const user = await User.create(data);
      let obj = user.toObject();
      delete obj._id;
      delete obj.__v;
      delete obj.password;
      obj.id = jwt.sign({ _id: user._id }, process.env.authSecret);
      successfulResponse(res, 201, "Registered Successfully", obj);
    } else validationErrorResponse(res, result.array());
  } catch (error) {
    errorResponse(error, res);
  }
};

export const userLogin = async (req, res) => {
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const { email, password } = matchedData(req);
      const user = await User.findOne({ email }).select("+password");
      if (!user) throw new customError("No user registered with email", 404);
      console.log(password, "\n", user);
      if (!(await compare(password, user.password)))
        throw new customError("Invalid email or password", 401);
      let obj = user.toObject();
      delete obj._id;
      delete obj.__v;
      delete obj.password;
      obj.id = jwt.sign({ _id: user._id }, process.env.authSecret);
      const drives = await Drive.find({ _id: { $in: [obj.drives] } });
      obj.drives = drives.map((drive) => {
        let tmp = drive.toObject();
        tmp.id = jwt.sign({ _id: drive._id }, process.env.normalSecret);
        delete tmp._id;
        delete tmp.__v;
        delete tmp.adminID;
        delete tmp.appliedCandidatesIDs;
        return tmp;
      });
      successfulResponse(res, 200, "Logined successfully", obj);
    } else validationErrorResponse(res, result.array());
  } catch (error) {
    errorResponse(error, res);
  }
};

export const getuser = async (req, res) => {
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const user = await User.findById(
        jwt.verify(matchedData(req).id, process.env.authSecret)
      );
      if (!user) throw new customError("No user found", 404);
      let obj = user.toObject();
      delete obj._id;
      delete obj.__v;
      delete obj.password;
      const drives = await Drive.find({ _id: { $in: [obj.drives] } });
      obj.drives = drives.map((drive) => {
        let tmp = drive.toObject();
        tmp.id = jwt.sign({ _id: drive._id }, process.env.normalSecret);
        delete tmp._id;
        delete tmp.__v;
        delete tmp.adminID;
        delete tmp.appliedCandidatesIDs;
        return tmp;
      });
      successfulResponse(res, 200, "Data fetched Successfully", obj);
    } else validationErrorResponse(res, result.array());
  } catch (error) {
    errorResponse(error, res);
  }
};

export const updateUser = async (req, res) => {
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const { id, ...updates } = matchedData(req);
       if (req.file) {
        if (req.file["picture"])
          {if (req.file["picture"][0].mimetype !== "images/jpg")
            throw new customError("Picture should be of jpg type", 400);
        updates.picture = req.file["picture"][0].buffer;}
        if (req.file["resume"])
          {if (req.file["resume"][0].mimetype !== "application/pdf")
            throw new customError("Resume should be of pdf type", 400);
        updates.resume = req.file["resume"][0].buffer;}
        if (req.file["cv"])
          {if (req.file["cv"][0].mimetype !== "application")
            throw new customError("cv should be of pdf type", 400);
        updates.cv = req.file["cv"][0].buffer;}
      } 
      const user = await User.findByIdAndUpdate(
        jwt.verify(id, process.env.authSecret),
        updates,
        { new: true }
      );
      if (!user) throw new customError("No user found", 404);
      let obj = user.toObject();
      delete obj._id;
      delete obj.__v;
      delete obj.password;
      successfulResponse(res, 200, "Updated successfully", obj);
    } else validationErrorResponse(res, result.array());
  } catch (error) {
    errorResponse(error, res);
  }
};
