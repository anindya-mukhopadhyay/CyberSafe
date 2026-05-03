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
    evidenceFiles: [
      {
        filename: { type: String, required: true },
        originalName: { type: String, required: true },
        mimeType: { type: String, required: true },
        size: { type: Number, required: true },
        url: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'investigating', 'resolved'],
      default: 'pending',
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ['pending', 'investigating', 'resolved'],
          required: true,
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const Report = mongoose.model('Report', reportSchema);
