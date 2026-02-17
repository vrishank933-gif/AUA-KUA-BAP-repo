const multer = require('multer');
const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.resolve(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const sanitizeName = (name) =>
  String(name || '')
    .trim()
    .replace(/[^\w.\-\s]/g, '_'); 

const sanitizeId = (id) =>
  String(id || 'unknown')
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, ''); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const uid = sanitizeId(req.user?.userid || 'unknown');
      const userDir = path.join(UPLOADS_DIR, uid);

      fs.mkdir(userDir, { recursive: true }, (err) => {
        if (err) return cb(err);
        cb(null, userDir);
      });
    } catch (e) {
      cb(e);
    }
  },
  filename: (req, file, cb) => {
    try {
      const original = file.originalname || 'file';
      const safeOriginal = sanitizeName(original);

      const fallback =
        (path.extname(original) && ('upload' + path.extname(original))) || 'upload';

      cb(null, safeOriginal || fallback);
    } catch (e) {
      cb(e);
    }
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
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10,
  },
});

module.exports = upload;