const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//회원가입
exports.register = async (req, res) => {
    try {
        const { email, password, nickname } = req.body;

        //비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            nickname,
        });

        res.status(201).json({
            message: '회원가입 성공',
            user: {
                id: newUser.id,
                email: newUser.email,
                nickname: newUser.nickname,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '회원가입 실패 -서버 오류' });
    }
};

//로그인
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: '비밀번호가 일치하지 않습니다' });
        }

        //jwt 생성
        const payload = { id: user.id }; //토큰에 담을 정보
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET, //비밀키
            { expiresIn: '1d' } //토큰 유효기간 (1일)
        );

        res.status(200).json({
            message: '로그인 성공',
            token: `Bearer ${token}`,
            user: {
                id: user.id,
                email: user.email,
                nickname: user.nickname,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '로그인 실패 - 서버 오류' });
    }
};

// 현재 로그인된 사용자 정보 응답
exports.getMe = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByPk(userId, {
            attributes: ['id', 'email', 'nickname'],
        });

        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('사용자 정보 조회 오류:', error);
        res.status(500).json({ message: '서버 내부 오류' });
    }
};
