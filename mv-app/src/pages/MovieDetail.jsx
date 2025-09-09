import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star } from 'lucide-react';
import api from '../api/axiosInstance';
import Navbar from '../components/Header/navbar';
import Footer from '../components/Footer';

function MovieDetail() {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userNickname, setUserNickname] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const movieResponse = await api.getMovie(movieId);
                const reviewsResponse = await api.getAllReviews(movieId);
                setMovie(movieResponse.data.data);
                setReviews(reviewsResponse.data.reviews);
            } catch (error) {
                console.error('영화/리뷰 정보를 불러오는 데 실패했습니다:', error);
                setError(
                    error.response?.status === 404
                        ? '영화 정보를 찾을 수 없습니다.'
                        : '데이터를 불러오는 중 문제가 발생했습니다.'
                );
                setIsLoading(false);
                return;
            }
            try {
                const userResponse = await api.getMe();
                setIsLoggedIn(true);
                setUserNickname(userResponse.data.nickname);
            } catch {
                setIsLoggedIn(false);
            }
            setIsLoading(false);
        };
        fetchData();
    }, [movieId]);

    const renderRating = (rating) => {
        if (!rating) {
            return (
                <div className="d-flex align-items-center">
                    <span className="text-muted fs-5 me-2">평점 없음</span>
                </div>
            );
        }
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        return (
            <div className="d-flex align-items-center">
                <div className="d-flex me-2">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={20}
                            className="mx-1"
                            fill={
                                i < fullStars
                                    ? 'var(--bs-yellow)'
                                    : i === fullStars && hasHalfStar
                                    ? 'var(--bs-yellow)'
                                    : 'none'
                            }
                            color="var(--bs-yellow)"
                            style={{ strokeWidth: 0 }}
                        />
                    ))}
                </div>
                <span className="fw-bold text-warning fs-5"> {Number(rating)?.toFixed(1) ?? '0.0'}</span>
            </div>
        );
    };

    const handleReviewClick = () => {
        if (!isLoggedIn) {
            navigate('/login', { state: { from: location } });
            //현재 경로를 전달해서 로그인 후 다시돌아올수 있도록 함
        } else {
            navigate('/review/write', {
                state: { movieId: movie.id, movieTitle: movie.originalTitle, userNickname },
            });
        }
    };

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="text-center p-5">로딩 중...</div>
                <Footer />
            </>
        );
    }
    if (error) {
        return (
            <>
                <Navbar />
                <div className="container-fluid container-max-width py-5 text-center">
                    <h1 className="text-danger">{error}</h1>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <div className="container-fluid container-max-width py-5">
                <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start">
                    <div className="flex-shrink-0 me-md-5 mb-4 mb-md-0">
                        <img
                            src={movie.posterPath}
                            alt={movie.originalTitle}
                            className="img-fluid rounded-lg shadow-lg"
                            style={{ maxWidth: '300px' }}
                        />
                    </div>
                    <div className="flex-grow-1 text-center text-md-start">
                        <h1 className="fw-bold text-info mb-3">{movie.originalTitle}</h1>
                        <h3 className="text-black-50 fs-5 mb-4">{movie.tagline}</h3>
                        <div className="mb-4">
                            <p className="text-black-50 fs-5 mb-2">평점</p>
                            {renderRating(movie.averageRating)}
                        </div>
                        <p className="text-black-50 fs-5 mb-4">장르 : {movie.genre}</p>
                        <p className="text-black-50 fs-5 mb-4">개봉일 : {movie.releaseDate}</p>
                        <div className="d-flex justify-content-center justify-content-md-start">
                            <button
                                className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold me-2"
                                onClick={() => navigate('/')}
                            >
                                뒤로가기
                            </button>
                            <button
                                className="btn btn-danger rounded-pill px-4 py-2 fw-bold"
                                onClick={handleReviewClick}
                            >
                                {isLoggedIn ? '리뷰 작성' : '로그인 후 리뷰 작성'}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-5 pt-5 border-top border-secondary">
                    <h2 className="text-center text-danger fw-bold mb-4">사용자 후기</h2>
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.id} className="card bg-dark text-white rounded-4 shadow-sm mb-3">
                                <div className="card-body">
                                    <h5 className="card-title d-flex align-items-center mb-2">
                                        <span className="me-2 fw-bold">{review.User.nickname}</span>
                                        <div className="d-flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={20}
                                                    className="mx-1"
                                                    fill={i < review.rating ? 'var(--bs-yellow)' : 'none'}
                                                    color="var(--bs-yellow)"
                                                    style={{ strokeWidth: 0 }}
                                                />
                                            ))}
                                        </div>
                                    </h5>
                                    <p className="card-text text-white-50">{review.content}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-white-50">아직 작성된 후기가 없습니다. 첫 후기를 남겨주세요!</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default MovieDetail;
