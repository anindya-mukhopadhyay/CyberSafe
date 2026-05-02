import { analyzePhishingRisk } from '../utils/phishingUtils.js';

export const checkPhishingUrl = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    const analysis = analyzePhishingRisk(url);
    return res.status(200).json({ result: analysis });
  } catch (error) {
    return res.status(500).json({ message: 'Phishing check failed', error: error.message });
  }
};
