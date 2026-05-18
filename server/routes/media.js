const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/auth');
const { upload } = require('../services/gridfs');
const { listMedia, streamMedia, deleteMedia, uploadMedia } = require('../controllers/mediaController');

router.get('/', protect, adminOnly, listMedia);
router.get('/stream/:id', streamMedia); // public streaming
router.post('/upload', protect, adminOnly, upload.single('file'), uploadMedia);
router.delete('/:id', protect, adminOnly, deleteMedia);

module.exports = router;
