export const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: err.message });
  }
  if (err.message?.includes('Only PNG, JPEG, WEBP, PDF, and TXT files are allowed')) {
    return res.status(400).json({ message: err.message });
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || 'Something went wrong',
  });
};
