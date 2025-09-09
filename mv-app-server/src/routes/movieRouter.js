const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

// 영화 목록 조회 (클라이언트용)
router.get('/', movieController.getMovies);

// 캐러셀 이미지 3개 가져오기
router.get('/carousel_images', movieController.getCarouselImages);

//영화 상세정보 조회
router.get('/:id', movieController.getMovieById); // getMovie -> getMovieById로 수정

// TMDB 데이터 동기화 (관리자용)
router.post('/sync', movieController.syncMoviesFromTMDB);

module.exports = router;
