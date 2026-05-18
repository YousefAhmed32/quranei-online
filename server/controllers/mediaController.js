const mongoose = require('mongoose');
const { getGfsBucket } = require('../config/db');
const { uploadToGridFS } = require('../services/gridfs'); 
// GET /api/media — list all media files
const listMedia = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const files = await db.collection('media.files')
      .find({})
      .sort({ uploadDate: -1 })
      .limit(100)
      .toArray();

    if (!files || files.length === 0) {
      return res.json({ success: true, files: [] });
    }
    res.json({ success: true, files });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/media/stream/:id — stream file
const streamMedia = async (req, res) => {
  try {
    const bucket = getGfsBucket();
    const fileId = new mongoose.Types.ObjectId(req.params.id);

    const db = mongoose.connection.db;
    const file = await db.collection('media.files').findOne({ _id: fileId });
    if (!file) return res.status(404).json({ message: 'الملف غير موجود' });

    res.set('Content-Type', file.contentType || 'application/octet-stream');
    res.set('Content-Length', file.length);
    res.set('Accept-Ranges', 'bytes');

    const range = req.headers.range;
    if (range && file.contentType?.startsWith('video')) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : file.length - 1;
      const chunkSize = end - start + 1;

      res.status(206);
      res.set('Content-Range', `bytes ${start}-${end}/${file.length}`);
      res.set('Content-Length', chunkSize);

      const downloadStream = bucket.openDownloadStream(fileId, { start, end: end + 1 });
      downloadStream.pipe(res);
    } else {
      const downloadStream = bucket.openDownloadStream(fileId);
      downloadStream.pipe(res);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/media/:id — delete file
const deleteMedia = async (req, res) => {
  try {
    const bucket = getGfsBucket();
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    await bucket.delete(fileId);
    res.json({ success: true, message: 'تم حذف الملف بنجاح' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/media/upload — upload handled by multer middleware
const uploadMedia = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'لم يتم إرسال ملف' });

    const uploadStream = await uploadToGridFS(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      req.user?._id
    );

    res.status(201).json({
      message: 'تم الرفع بنجاح',
      file: {
        id: uploadStream.id,
        filename: uploadStream.filename,
      },
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'فشل رفع الملف', error: err.message });
  }
};


module.exports = { listMedia, streamMedia, deleteMedia, uploadMedia };
