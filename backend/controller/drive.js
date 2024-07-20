import { matchedData, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import Drive from "../models/drive.js";
import Admin from "../models/admin.js";
import User from "../models/user.js";
import customError, {
  errorResponse,
  successfulResponse,
  validationErrorResponse,
} from "../utils/response.js";

export const createDrive = async (req, res) => {
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const data = matchedData(req);
      data.adminID = jwt.verify(data.id, process.env.authSecret)._id;
      delete data.id;
      if (!(await Admin.exists({ _id: data.adminID })))
        throw new customError("Invalid adminID, no admin found", 404);
      if (req.file) data.detailedInfo = req.file.buffer;
      const drive = await Drive.create(data);
      let obj = drive.toObject();
      obj.id = jwt.sign({ _id: drive._id }, process.env.authSecret);
      obj.adminID = jwt.sign({ _id: drive.adminID }, process.env.normalSecret);
      delete obj._id;
      delete obj.__v;
      successfulResponse(res, 201, "Placement drive created", obj);
    } else validationErrorResponse(res, result.array());
  } catch (error) {
    errorResponse(error, res);
  }
};

export const adminGetDrive = async (req, res) => {
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const drives = await Drive.find({
        adminID: jwt.verify(matchedData(req).id, process.env.authSecret),
      });
      if (!drives.length) throw new customError("No drives found", 404);
      let obj = drives.map((drive) => {
        let tmp = drive.toObject();
        tmp.id = jwt.sign({ _id: drive._id }, process.env.authSecret);
        tmp.appliedCandidatesIDs = tmp.appliedCandidatesIDs.map(
          (appliedCandidatesID) =>
            jwt.sign({ _id: appliedCandidatesID }, process.env.normalSecret)
        );
        delete tmp.adminID;
        delete tmp._id;
        delete tmp.__v;
        return tmp;
      });
      successfulResponse(res, 200, "Data fetched successfully", obj);
    } else validationErrorResponse(res, result.array());
  } catch (error) {
    errorResponse(error, res);
  }
};

export const updateStage = async (req, res) => {
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      let { id, acceptedCandidatesIDs } = matchedData(req);
      const drive = await Drive.findById(
        jwt.verify(id, process.env.authSecret)
      );
      if (!drive) throw new customError("No drive found with given id", 404);
      acceptedCandidatesIDs = acceptedCandidatesIDs.map(
        (acceptedCandidateID) =>
          jwt.verify(acceptedCandidateID, process.env.normalSecret)._id
      );
      if (
        !acceptedCandidatesIDs.every((acceptedCandidatesID) =>
          drive.appliedCandidatesIDs.includes(acceptedCandidatesID)
        )
      )
        throw new customError(
          "Invalid candidate id,candidate not present in applied candidates list",
          404
        );
      if (drive.registrationOpenedTill > Date.now())
        throw new customError(
          "Registrations are still open for drive, stage can't be updated",
          400
        );
      if (drive.currentStage >= drive.stages.length)
        throw new customError("No further stage available", 400);
      drive.appliedCandidatesIDs = acceptedCandidatesIDs;
      drive.currentStage++;
      await drive.save();
      let obj = drive.toObject();
      obj.id = jwt.sign({ _id: drive._id }, process.env.authSecret);
      obj.appliedCandidatesIDs = obj.appliedCandidatesIDs.map(
        (appliedCandidatesID) =>
          jwt.sign({ _id: appliedCandidatesID }, process.env.normalSecret)
      );
      delete obj.adminID;
      delete obj._id;
      delete obj.__v;
      successfulResponse(res, 200, "Stage updated successfully", obj);
    } else validationErrorResponse(res, result.array());
  } catch (error) {
    errorResponse(error, res);
  }
};

export const sendUpdate = async (req, res) => {
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      let { id, update } = matchedData(req);
      const drive = await Drive.findById(
        jwt.verify(id, process.env.authSecret)
      );
      if (!drive) throw new customError("No drive found", 404);
      drive.updates.push(update);
      await drive.save();
      successfulResponse(res, 200, "Update send successfully");
    } else validationErrorResponse(res, result.array());
  } catch (error) {
    errorResponse(error, res);
  }
};

export const userGetDrive = async (req, res) => {
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const user = await User.findById(jwt.verify(
        matchedData(req).id,
        process.env.authSecret
      )._id);
      if (!user) throw new customError("No user found", 404);
      const drives = await Drive.find({
        registrationOpenedTill: { $gt: Date.now() },
        _id: {$nin: user.drives},
      });
      if (!drives.length) throw new customError("No drives found", 404);
      const obj = drives.map((drive) => {
        let tmp = drive.toObject();
        tmp.id = jwt.sign({ _id: drive._id }, process.env.normalSecret);
        tmp.appliedCandidatesIDs = tmp.appliedCandidatesIDs.map(
          (appliedCandidatesID) =>
            jwt.sign({ _id: appliedCandidatesID }, process.env.normalSecret)
        );
        delete tmp.adminID;
        delete tmp._id;
        delete tmp.__v;
        return tmp;
      });
      successfulResponse(res, 200, "Data fetched successfully", obj);
    }
  } catch (error) {
    errorResponse(error, res);
  }
};

export const applyToDrive = async (req, res) => {
  try {
    // console.log(driveId)
    const result = validationResult(req);
    if (result.isEmpty()) {
      let { id, driveID } = matchedData(req);
      id = jwt.verify(id, process.env.authSecret)._id;
      driveID = jwt.verify(driveID, process.env.normalSecret)._id;
      const drive = await Drive.findById(driveID);
      const user = await User.findById(id);
      if (!drive) throw new customError("No drive found", 404);
      if (!user) throw new customError("No user found", 404);
      if (drive.registrationOpenedTill < Date.now())
        throw new customError(
          "Registrations are closed for drive, can't apply to drive",
          400
        );
      if (
        drive.appliedCandidatesIDs.includes(id) &&
        user.drives.includes(driveID)
      )
        throw new customError("Already applied to drive", 400);
      drive.requiredUserDetails.forEach(userDetail => {
        if (!user[userDetail]) throw new customError(`${userDetail} is required for registration`, 400);
      });
      if (!drive.appliedCandidatesIDs.includes(id))
        drive.appliedCandidatesIDs.push(id);
      if (!user.drives.includes(driveID)) user.drives.push(driveID);
      await drive.save();
      await user.save();
      successfulResponse(res, 200, "Applied to drive successfully");
    } else validationErrorResponse(res, result.array())
  } catch (error) {
    errorResponse(error, res);
  }
};
