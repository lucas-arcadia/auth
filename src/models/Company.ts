import mongoose, { Schema } from "mongoose";

const companySchema = new Schema(
  {
    legalName: { type: String, required: true },
    tradeName: { type: String, required: true },
    ein: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);
