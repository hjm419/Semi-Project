const express = require('express');
const router = express.Router();

const authRouter = require('./authRouter');
const reviewRouter = require('./reviewRouter');
const movieRouter = require('./movieRouter');

router.use('/auth', authRouter);
router.use('/reviews', reviewRouter);
router.use('/movies', movieRouter);

module.exports = router;
