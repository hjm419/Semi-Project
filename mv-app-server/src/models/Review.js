module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define(
        'Review',
        {
            // 1. 리뷰 내용 (content)
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            // 2. 별점 (rating) - INT로 변경, 1-5 범위 체크
            rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 5
                }
            },
            // 3. 영화 고유 ID (movieId)
            movieId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            // userId 필드 추가 (관계 설정용)
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
            // movieTitle 필드 제거 (movies 테이블과 조인으로 해결)
            // createdAt, updatedAt은 Sequelize가 자동으로 관리
        },
        {
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            timestamps: true, // createdAt, updatedAt 자동 생성
            updatedAt: 'updatedAt' // updatedAt 필드명 명시
        }
    );

    // 관계 설정 수정
    Review.associate = (db) => {
        // User와의 관계
        db.Review.belongsTo(db.User, { 
            foreignKey: 'userId', 
            targetKey: 'id', 
            onDelete: 'CASCADE' 
        });
        
        // Movie와의 관계 추가
        db.Review.belongsTo(db.Movie, { 
            foreignKey: 'movieId', 
            targetKey: 'id' 
        });
    };

    return Review;
};
