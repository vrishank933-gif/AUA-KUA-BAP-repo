const multer = require('multer');
const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.resolve(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const sanitize = (name) =>
  String(name || '')
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '')

const stripDocumentpathSuffix = (fieldname) =>
  String(fieldname || '').replace(/_documentpath$/i, '');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uid = sanitize(req.user?.userid || 'unknown');
    const baseName = sanitize(stripDocumentpathSuffix(file.fieldname) || 'file');
    const ext = path.extname(file.originalname || '').toLowerCase();
    cb(null, `${uid}_${baseName}${ext || ''}`);
  },
});

const allowed = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
]);

const fileFilter = (req, file, cb) => {
  if (allowed.has(file.mimetype)) return cb(null, true);
  return cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: pdf, png, jpg, jpeg`));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 6,
  },
});
module.exports = upload;