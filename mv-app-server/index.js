const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { sequelize } = require('./src/models');

const app = express();
const port = process.env.PORT || 8080;

//기본 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = require('./src/routes');
app.use('/api', routes);

//sequelize와 데이터베이스 동기화
sequelize
    .sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error('데이터베이스 연결 실패: ', err);
    });

app.listen(port, () => {
    console.log(`PORT: ${port}} 서버 시작`);
    console.log(`http://localhost:${port}`);
});
