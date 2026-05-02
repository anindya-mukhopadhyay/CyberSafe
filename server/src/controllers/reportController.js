import { Report } from '../models/Report.js';

const severityWeightsByType = {
  phishing: 22,
  fraud: 28,
  harassment: 20,
  identity_theft: 34,
  other: 15,
};

const criticalKeywords = [
  'otp',
  'bank',
  'upi',
  'wire transfer',
  'card',
  'ransom',
  'threat',
  'blackmail',
  'ssn',
  'aadhar',
  'password',
  'crypto',
];

const determineSeverity = ({ incidentType, description, urlOrPhone }) => {
  const text = `${description || ''} ${urlOrPhone || ''}`.toLowerCase();
  let score = severityWeightsByType[incidentType] || 15;

  criticalKeywords.forEach((keyword) => {
    if (text.includes(keyword)) {
      score += 8;
    }
  });

  if (text.includes('http://')) {
    score += 8;
  }

  if (description && description.length > 250) {
    score += 8;
  }

  if (score >= 70) {
    return 'critical';
  }
  if (score >= 50) {
    return 'high';
  }
  if (score >= 30) {
    return 'medium';
  }
  return 'low';
};

export const createReport = async (req, res) => {
  try {
    const { name, email, incidentType, description, urlOrPhone } = req.body;

    if (!name || !email || !incidentType || !description) {
      return res
        .status(400)
        .json({ message: 'Name, email, incident type, and description are required' });
    }

    const severity = determineSeverity({ incidentType, description, urlOrPhone });

    const report = await Report.create({
      name,
      email,
      incidentType,
      description,
      urlOrPhone,
      severity,
      createdBy: req.user._id,
      statusHistory: [{ status: 'pending', changedBy: req.user._id }],
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
    const { type, status, severity, q } = req.query;

    const filter = {};
    if (type) {
      filter.incidentType = type;
    }
    if (status) {
      filter.status = status;
    }
    if (severity) {
      filter.severity = severity;
    }
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { urlOrPhone: { $regex: q, $options: 'i' } },
      ];
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
    report.statusHistory.push({ status, changedBy: req.user._id });
    await report.save();

    return res.status(200).json({ message: 'Report status updated', report });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
};

export const getAdminOverview = async (req, res) => {
  try {
    const [total, pending, investigating, resolved, critical, last24h, typeDistribution] =
      await Promise.all([
        Report.countDocuments(),
        Report.countDocuments({ status: 'pending' }),
        Report.countDocuments({ status: 'investigating' }),
        Report.countDocuments({ status: 'resolved' }),
        Report.countDocuments({ severity: 'critical' }),
        Report.countDocuments({
          createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        }),
        Report.aggregate([
          {
            $group: {
              _id: '$incidentType',
              count: { $sum: 1 },
            },
          },
          {
            $sort: { count: -1 },
          },
        ]),
      ]);

    return res.status(200).json({
      overview: {
        total,
        pending,
        investigating,
        resolved,
        critical,
        last24h,
        typeDistribution,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch admin overview', error: error.message });
  }
};
