import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    failedLoginAttempts: { type: Number, default: 0 },
    expirationDate: { type: Date, default: null },
    permissions: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
