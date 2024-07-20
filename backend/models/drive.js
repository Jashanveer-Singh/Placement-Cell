import { Schema, model } from "mongoose";

const schema = new Schema({
  adminID: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  company: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  postJobDescription: {
    type: [String],
    required: true,
  },
  eligibityCriteria: {
    type: [String],
    required: true,
  },
  creationTime: {
    type: Date,
    default: Date.now(),
  },
  registrationOpenedTill: {
    type: Date,
    required: true,
  },
  currentStage: {
    type: Number,
    default: 0,
  },
  detailedInfo: {
    type: Buffer,
    required: true,
  },
  placementProcedure: [String],
  appliedCandidatesIDs: [Schema.Types.ObjectId],
  requiredUserDetails: [String],
  stages: [String],
  updates: [String],
});

schema.index({ adminID: 1, name: 1 }, { unique: true });

export default model("drives", schema);
