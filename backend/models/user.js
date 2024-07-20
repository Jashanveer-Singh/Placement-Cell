import { Schema, model } from "mongoose";
const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  resume: Buffer,
  cv: Buffer,
  strengths: [String],
  weaknesses: [String],
  hobbies: [String],
  skills: [String],
  picture: Buffer,
  description: String,
  achievements: [String],
  drives: [Schema.Types.ObjectId]
});

export default model("users", schema);