const jwt = require('jsonwebtoken');
const { User } = require('../models');

// JWT 토큰 검증 미들웨어
const authenticateToken = async (req, res, next) => {
    try {
        // Authorization 헤더에서 토큰 추출
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN" 형식

        // 토큰이 없는 경우
        if (!token) {
            return res.status(401).json({ message: '액세스 토큰이 필요합니다' });
        }

        // 토큰 검증
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 사용자 정보 조회
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: '유효하지 않은 토큰입니다' });
        }

        // req.user에 사용자 정보 저장
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: '유효하지 않은 토큰입니다' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: '토큰이 만료되었습니다' });
        } else {
            console.error('토큰 검증 오류:', error);
            return res.status(500).json({ message: '서버 오류' });
        }
    }
};

// 선택적 인증 미들웨어 (토큰이 있어도 되고 없어도 되는 경우)
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByPk(decoded.id);
            if (user) {
                req.user = user;
            }
        }
        next();
    } catch (error) {
        // 토큰이 유효하지 않아도 계속 진행
        next();
    }
};

module.exports = {
    authenticateToken,
    optionalAuth
};
