import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Film, Star } from 'lucide-react';
import Carousel from 'react-bootstrap/Carousel';
import api from '../../api/axiosInstance';

function BottomCarousel() {
    const [ratingCarouselIndex, setRatingCarouselIndex] = useState(0);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleRatingCarousel = (selectedIndex) => {
        setRatingCarouselIndex(selectedIndex);
    };

    useEffect(() => {
        const fetchTopRatedMovies = async () => {
            setLoading(true);
            try {
                // 평점 TOP 3은 기존 API 사용 (서버에 추가된 API가 있다면)
                // 만약 서버에 추가된 API가 없다면 여기서도 단건 조회로 처리할 수 있습니다
                try {
                    const topRatedResponse = await api.getTopRatedMovies();
                    setTopRatedMovies(topRatedResponse.data.data);
                } catch (error) {
                    console.log('평점 TOP API가 없어서 기본 영화 목록에서 가져옵니다.');
                    // 평점 TOP API가 없다면 기본 영화 목록에서 평점이 있는 영화들을 가져옴
                    const moviesResponse = await api.getMovies({ page: 1, limit: 20 });
                    const moviesWithRating = moviesResponse.data.data.movies
                        .filter((movie) => movie.averageRating !== null)
                        .sort((a, b) => b.averageRating - a.averageRating)
                        .slice(0, 3);
                    setTopRatedMovies(moviesWithRating);
                }
            } catch (error) {
                console.error('평점 TOP 영화를 불러오는 데 실패했습니다:', error);
            }
            setLoading(false);
        };

        fetchTopRatedMovies();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <div className="text-center">
                    <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">추천 영화를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* 섹션 제목 */}
            <h2 id="top-rating" className="text-center text-black mb-4 fw-bold">
                <Film /> 추천 영화
            </h2>

            <Carousel
                activeIndex={ratingCarouselIndex}
                onSelect={handleRatingCarousel}
                indicators={false}
                interval={4000}
            >
                {topRatedMovies.map((movie, idx) => (
                    <Carousel.Item
                        key={movie.id}
                        as={Link}
                        to={`/movies/${movie.id}`}
                        style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
                    >
                        <div className="card shadow-lg border-0 bg-dark text-white rounded-4 mb-5 p-4 p-md-5">
                            <div className="row g-4 align-items-center">
                                {/* Left Column: Poster Image */}
                                <div className="col-md-4 text-center">
                                    <img
                                        src={movie.posterPath}
                                        className="img-fluid rounded-3 shadow-lg"
                                        alt={movie.originalTitle}
                                        style={{ maxHeight: '300px', objectFit: 'cover', width: 'auto' }}
                                    />
                                </div>

                                {/* Right Column: Rating and Description */}
                                <div className="col-md-8">
                                    <div className="d-flex flex-column h-100 justify-content-center text-center text-md-start">
                                        {/* Top part: Rating */}
                                        <div className="mb-4">
                                            <h3 className="fw-bold mb-3">{movie.originalTitle}</h3>
                                            <div className="fs-1 fw-bold text-warning d-flex align-items-center justify-content-center justify-content-md-start">
                                                <Star size={38} fill="currentColor" strokeWidth={0} className="me-2" />
                                                {Number(movie.averageRating)?.toFixed(1) ?? '0.0'}
                                            </div>
                                            <div className="text-muted mt-2">{movie.genre}</div>
                                        </div>

                                        {/* Bottom part: Description */}
                                        <div>
                                            <p className="text-white-50 mb-0 fs-5 fst-italic">{movie.tagline}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </>
    );
}

export default BottomCarousel;
