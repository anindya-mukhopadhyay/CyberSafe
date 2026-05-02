import { Report } from '../models/Report.js';

export const createReport = async (req, res) => {
  try {
    const { name, email, incidentType, description, urlOrPhone } = req.body;

    if (!name || !email || !incidentType || !description) {
      return res
        .status(400)
        .json({ message: 'Name, email, incident type, and description are required' });
    }

    const report = await Report.create({
      name,
      email,
      incidentType,
      description,
      urlOrPhone,
      createdBy: req.user._id,
    });

    return res.status(201).json({ message: 'Report submitted successfully', report });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create report', error: error.message });
  }
};

export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ reports });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch your reports', error: error.message });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const { type, status } = req.query;

    const filter = {};
    if (type) {
      filter.incidentType = type;
    }
    if (status) {
      filter.status = status;
    }

    const reports = await Report.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({ reports });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch reports', error: error.message });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['investigating', 'resolved'].includes(status)) {
      return res.status(400).json({ message: 'Status must be investigating or resolved' });
    }

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = status;
    await report.save();

    return res.status(200).json({ message: 'Report status updated', report });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
};
