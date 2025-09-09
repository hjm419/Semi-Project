const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken, optionalAuth } = require('../middleware/authMiddleware');

// 인증이 필요한 라우트
router.post('/', authenticateToken, reviewController.createReview);
router.put('/:id', authenticateToken, reviewController.updateReview);
router.delete('/:id', authenticateToken, reviewController.deleteReview);
router.get('/my', authenticateToken, reviewController.getMyReviews);

// 인증이 선택적인 라우트 (조회만)
router.get('/', optionalAuth, reviewController.getReviews);
router.get('/:id', optionalAuth, reviewController.getReview);

module.exports = router;
