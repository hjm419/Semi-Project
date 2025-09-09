module.exports = (sequelize, DataTypes) => {
    // DataTypes를 두 번째 인자로 받습니다.
    const User = sequelize.define(
        'User',
        {
            email: {
                type: DataTypes.STRING, // 인자로 받은 DataTypes를 사용합니다.
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            nickname: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        { timestamps: false }
    );
    return User;
};
