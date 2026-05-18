const multer = require('multer');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const crypto = require('crypto');
const path = require('path');

// multer بيحفظ في الذاكرة مؤقتاً
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'video/mp4', 'video/webm', 'video/ogg',
      'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg',
      'application/pdf',
      'image/jpeg', 'image/png', 'image/webp',
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`نوع الملف غير مدعوم: ${file.mimetype}`), false);
  },
});

// دالة رفع الملف على GridFS
const uploadToGridFS = (fileBuffer, originalname, mimetype, userId) => {
  return new Promise((resolve, reject) => {
    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'media' });
    const filename = crypto.randomBytes(16).toString('hex') + path.extname(originalname);

    const uploadStream = bucket.openUploadStream(filename, {
      metadata: {
        originalName: originalname,
        uploadedBy: userId,
        type: mimetype.startsWith('video') ? 'video'
            : mimetype.startsWith('audio') ? 'audio'
            : mimetype === 'application/pdf' ? 'pdf'
            : 'image',
      },
    });

    uploadStream.end(fileBuffer);
    uploadStream.on('finish', () => resolve(uploadStream));
    uploadStream.on('error', reject);
  });
};

module.exports = { upload, uploadToGridFS };