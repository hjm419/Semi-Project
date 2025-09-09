// models/Movie.js
const { sequelize } = require('./index'); // sequelize import 추가

module.exports = (sequelize, DataTypes) => {
    const Movie = sequelize.define('Movie', {
        originalTitle: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        posterPath: {
            type: DataTypes.STRING(300)
        },
        genre: {
            type: DataTypes.STRING(50)
        },
        tagline: {
            type: DataTypes.STRING(100)
        },
        releaseDate: {
            type: DataTypes.DATEONLY
        },
        // 평점 속성 추가
        averageRating: {
            type: DataTypes.DECIMAL(3, 2), // 소수점 둘째 자리까지 (예: 4.25)
            allowNull: true,
            defaultValue: null
        }
    }, {
        timestamps: false, // createdAt, updatedAt 필드 비활성화
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci'
    });

    Movie.associate = (db) => {
        Movie.hasMany(db.Review, { foreignKey: 'movieId', sourceKey: 'id' });
    };

    // 평점 계산 및 업데이트 함수 추가
    Movie.updateAverageRating = async function(movieId) {
        try {
            const { Review } = require('./index');
            
            // 해당 영화의 모든 리뷰에서 평점 평균 계산
            const result = await Review.findOne({
                where: { movieId },
                attributes: [
                    [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
                    [sequelize.fn('COUNT', sequelize.col('id')), 'reviewCount']
                ]
            });

            const averageRating = result ? parseFloat(result.dataValues.averageRating) : null;
            const reviewCount = result ? parseInt(result.dataValues.reviewCount) : 0;

            // 평점이 있으면 소수점 둘째 자리까지 반올림하여 저장
            const roundedRating = averageRating ? Math.round(averageRating * 100) / 100 : null;

            // 영화의 평점 업데이트
            await this.update(
                { averageRating: roundedRating },
                { where: { id: movieId } }
            );

            return {
                averageRating: roundedRating,
                reviewCount
            };
        } catch (error) {
            console.error('평점 업데이트 오류:', error);
            throw error;
        }
    };

    return Movie;
};
