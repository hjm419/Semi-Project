const { Review, User, Movie } = require('../models');
const { sequelize } = require('../models'); // sequelize import 추가

// 리뷰 생성
exports.createReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { content, rating, movieId } = req.body;

        // 필수 필드 검증
        if (!content || !rating || !movieId) {
            return res.status(400).json({
                message: '리뷰 내용, 별점, 영화 ID는 필수입니다',
            });
        }

        // 별점 범위 검증 (1 ~ 5)
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: '별점은 1에서 5 사이여야 합니다',
            });
        }

        const review = await Review.create({
            content,
            rating,
            movieId,
            userId,
        });

        // 영화의 평점 업데이트
        await Movie.updateAverageRating(movieId);

        res.status(201).json({
            message: '리뷰가 성공적으로 생성되었습니다',
            review,
        });
    } catch (error) {
        console.error('리뷰 생성 오류:', error);
        res.status(500).json({ message: '서버 오류' });
    }
};

// 리뷰 목록 조회
exports.getReviews = async (req, res) => {
    try {
        const { movieId, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = {};

        // movieId 또는 movieTitle로 검색
        if (movieId) {
            whereClause.movieId = movieId;
        }

        const reviews = await Review.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    attributes: ['id', 'nickname'],
                    as: 'User',
                },
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        const totalPages = Math.ceil(reviews.count / limit);

        res.status(200).json({
            message: '리뷰 목록을 성공적으로 조회했습니다',
            reviews: reviews.rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalCount: reviews.count,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        });
    } catch (error) {
        console.error('리뷰 조회 오류:', error);
        res.status(500).json({ message: '서버 오류' });
    }
};

// 특정 리뷰 조회
exports.getReview = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await Review.findByPk(id, {
            include: [
                {
                    model: User,
                    attributes: ['id', 'nickname'],
                    as: 'User',
                },
            ],
        });

        if (!review) {
            return res.status(404).json({
                message: '해당 리뷰를 찾을 수 없습니다',
            });
        }

        res.status(200).json({
            message: '리뷰를 성공적으로 조회했습니다',
            review,
        });
    } catch (error) {
        console.error('리뷰 조회 오류:', error);
        res.status(500).json({ message: '서버 오류' });
    }
};

// 리뷰 수정
exports.updateReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { content, rating } = req.body;

        // 필수 필드 검증
        if (!content || !rating) {
            return res.status(400).json({
                message: '리뷰 내용과 별점은 필수입니다',
            });
        }

        // 별점 범위 검증 (1 ~ 5)
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                message: '별점은 1에서 5 사이여야 합니다',
            });
        }

        const review = await Review.findByPk(id);

        if (!review) {
            return res.status(404).json({
                message: '해당 리뷰를 찾을 수 없습니다',
            });
        }

        // 리뷰 작성자만 수정 가능
        if (review.userId !== userId) {
            return res.status(403).json({
                message: '자신이 작성한 리뷰만 수정할 수 있습니다',
            });
        }

        const oldMovieId = review.movieId;

        await review.update({
            content,
            rating,
        });

        // 영화의 평점 업데이트
        await Movie.updateAverageRating(oldMovieId);

        res.status(200).json({
            message: '리뷰가 성공적으로 수정되었습니다',
            review,
        });
    } catch (error) {
        console.error('리뷰 수정 오류:', error);
        res.status(500).json({ message: '서버 오류' });
    }
};

// 리뷰 삭제
exports.deleteReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const review = await Review.findByPk(id);

        if (!review) {
            return res.status(404).json({
                message: '해당 리뷰를 찾을 수 없습니다',
            });
        }

        // 리뷰 작성자만 삭제 가능
        if (review.userId !== userId) {
            return res.status(403).json({
                message: '자신이 작성한 리뷰만 삭제할 수 있습니다',
            });
        }

        const movieId = review.movieId;
        await review.destroy();

        // 영화의 평점 업데이트
        await Movie.updateAverageRating(movieId);

        res.status(200).json({
            message: '리뷰가 성공적으로 삭제되었습니다',
        });
    } catch (error) {
        console.error('리뷰 삭제 오류:', error);
        res.status(500).json({ message: '서버 오류' });
    }
};

// 내가 작성한 리뷰 목록 조회
exports.getMyReviews = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const reviews = await Review.findAndCountAll({
            where: { userId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'nickname'],
                    as: 'User',
                },
                //영화 정보도 같이 가져오기
                {
                    model: Movie,
                    attributes: ['id', 'originalTitle', 'posterPath'],
                },
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        const totalPages = Math.ceil(reviews.count / limit);

        res.status(200).json({
            message: '내 리뷰 목록을 성공적으로 조회했습니다',
            reviews: reviews.rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalCount: reviews.count,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        });
    } catch (error) {
        console.error('내 리뷰 조회 오류:', error);
        res.status(500).json({ message: '서버 오류' });
    }
};

// 영화별 평균 별점 조회 (API 사용 안함 - DB에서 직접 조회)
exports.getMovieAverageRating = async (req, res) => {
    try {
        const { movieId } = req.params;

        // Movie 테이블에서 직접 평점 조회
        const movie = await Movie.findByPk(movieId, {
            attributes: ['id', 'originalTitle', 'averageRating'],
        });

        if (!movie) {
            return res.status(404).json({
                message: '해당 영화를 찾을 수 없습니다',
            });
        }

        // 리뷰 개수도 함께 조회
        const reviewCount = await Review.count({
            where: { movieId },
        });

        res.status(200).json({
            message: '영화 평균 별점을 성공적으로 조회했습니다',
            movieId,
            averageRating: movie.averageRating,
            reviewCount,
        });
    } catch (error) {
        console.error('평균 별점 조회 오류:', error);
        res.status(500).json({ message: '서버 오류' });
    }
};
