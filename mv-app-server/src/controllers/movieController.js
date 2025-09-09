const { Movie } = require('../models');
const axios = require('axios');
const { Op } = require('sequelize'); // 추가

// TMDB API 설정
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// TMDB에서 영화 데이터를 가져와서 DB에 저장하는 함수
const fetchAndSaveMovies = async () => {
    try {
        // TMDB API에서 인기 영화 목록 가져오기 (최대 5페이지 = 100개 영화)
        for (let page = 1; page <= 5; page++) {
            const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
                params: {
                    api_key: TMDB_API_KEY,
                    language: 'ko-KR',
                    page: page,
                },
            });

            const movies = response.data.results;

            for (const movie of movies) {
                // DB에 이미 존재하는지 확인
                const existingMovie = await Movie.findOne({
                    where: { originalTitle: movie.original_title },
                });

                if (!existingMovie) {
                    // 영화 상세 정보 가져오기 (tagline을 위해)
                    const detailResponse = await axios.get(`${TMDB_BASE_URL}/movie/${movie.id}`, {
                        params: {
                            api_key: TMDB_API_KEY,
                            language: 'ko-KR',
                        },
                    });

                    const movieDetail = detailResponse.data;

                    // 장르 정보 가져오기
                    const genres = movieDetail.genres.map((genre) => genre.name).join(', ');

                    // DB에 저장
                    await Movie.create({
                        originalTitle: movie.original_title,
                        posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
                        genre: genres,
                        tagline: movieDetail.tagline || '',
                        releaseDate: movie.release_date,
                    });

                    console.log(`영화 저장 완료: ${movie.original_title}`);
                }
            }
        }

        console.log('모든 영화 데이터 저장 완료');
    } catch (error) {
        console.error('영화 데이터 저장 중 오류:', error);
        throw error;
    }
};

// 영화 목록 조회 (DB에서 조회)
exports.getMovies = async (req, res) => {
    try {
        const { page = 1, limit = 20, searchTerm } = req.query;
        const offset = (page - 1) * limit;

        // 검색 조건 추가
        const whereClause = {};
        if (searchTerm) {
            whereClause.originalTitle = {
                [Op.like]: `%${searchTerm}%`, // 수정
            };
        }

        const movies = await Movie.findAndCountAll({
            attributes: ['id', 'originalTitle', 'posterPath', 'genre', 'tagline', 'releaseDate', 'averageRating'],
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['id', 'ASC']],
        });

        res.status(200).json({
            success: true,
            data: {
                movies: movies.rows,
                total: movies.count,
                currentPage: parseInt(page),
                totalPages: Math.ceil(movies.count / limit),
            },
        });
    } catch (error) {
        console.error('영화 목록 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '영화 목록을 가져오는데 실패했습니다.',
        });
    }
};
// ...

// TMDB 데이터를 DB에 저장하는 엔드포인트 (관리자용)
exports.syncMoviesFromTMDB = async (req, res) => {
    try {
        await fetchAndSaveMovies();

        res.status(200).json({
            success: true,
            message: 'TMDB에서 영화 데이터를 성공적으로 가져와 저장했습니다.',
        });
    } catch (error) {
        console.error('TMDB 동기화 오류:', error);
        res.status(500).json({
            success: false,
            message: 'TMDB 데이터 동기화에 실패했습니다.',
        });
    }
};

// 영화 단건 조회
exports.getMovieById = async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findByPk(id); // attributes 제거하여 모든 필드 조회

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: '영화를 찾을 수 없습니다.',
            });
        }

        res.status(200).json({
            success: true,
            data: movie,
        });
    } catch (error) {
        console.error('영화 단건 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '영화 정보를 가져오는데 실패했습니다.',
        });
    }
};

// 캐러셀용 영화 이미지 API
exports.getCarouselImages = async (req, res) => {
    try {
        // DB에서 id 1,2,3 영화 조회
        const movies = await Movie.findAll({
            where: { id: [1, 2, 3] },
            attributes: ['id', 'originalTitle'],
        });

        // TMDB backdrop 이미지 가져오기
        const images = [];
        for (const movie of movies) {
            // TMDB에서 영화 상세 정보 조회
            const tmdbRes = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
                params: {
                    api_key: TMDB_API_KEY,
                    query: movie.originalTitle,
                    language: 'ko-KR',
                },
            });

            const tmdbMovie = tmdbRes.data.results[0];
            if (tmdbMovie && tmdbMovie.backdrop_path) {
                images.push({
                    id: movie.id,
                    title: movie.originalTitle,
                    backdropUrl: `https://image.tmdb.org/t/p/original${tmdbMovie.backdrop_path}`,
                });
            } else {
                images.push({
                    id: movie.id,
                    title: movie.originalTitle,
                    backdropUrl: null,
                });
            }
        }

        res.status(200).json({
            success: true,
            data: images,
        });
    } catch (error) {
        console.error('캐러셀 이미지 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '캐러셀 이미지를 가져오는데 실패했습니다.',
        });
    }
};
