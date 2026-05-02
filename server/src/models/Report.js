import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    incidentType: {
      type: String,
      required: true,
      enum: ['phishing', 'fraud', 'harassment', 'identity_theft', 'other'],
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
    },
    urlOrPhone: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'investigating', 'resolved'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const Report = mongoose.model('Report', reportSchema);
