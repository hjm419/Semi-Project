// src/components/ReviewList.jsx

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Star, Edit, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

function ReviewList({ reviews, onDelete, showActions = false, currentUser }) {
    const navigate = useNavigate();

    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center p-5 text-white-50">
                <p className="fs-4">아직 작성된 리뷰가 없습니다. 🙁</p>
                {showActions && (
                    <button
                        className="btn btn-outline-danger mt-3 fw-bold rounded-pill px-4 py-2"
                        onClick={() => navigate('/#latest-movies')} // 홈 화면의 특정 섹션으로 이동하도록 수정
                    >
                        최신 영화 보러가기
                    </button>
                )}
            </div>
        );
    }

    useEffect(() => {
        console.log(reviews);
    }, []);

    const handleEdit = (review) => {
        navigate(`/review/edit/${review.id}`, {
            state: { movieTitle: review.Movie.originalTitle, movieId: review.movieId },
        });
    };

    return (
        <div className="row g-4 justify-content-center">
            {reviews.map((review) => (
                <div key={review.id} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
                    <div className="card h-100 shadow-lg border-0 bg-dark text-white rounded-4 review-card-hover">
                        {review.Movie && review.Movie.posterPath ? (
                            <Link to={`/movies/${review.Movie.id}`}>
                                <img
                                    src={review.Movie.posterPath}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://placehold.co/500x750/333333/FFFFFF?text=No+Poster';
                                    }}
                                    alt={review.Movie.originalTitle}
                                    className="card-img-top review-poster"
                                />
                            </Link>
                        ) : (
                            <div className="card-img-top review-poster d-flex align-items-center justify-content-center bg-secondary text-white-50">
                                No Poster
                            </div>
                        )}
                        <div className="card-body d-flex flex-column p-4">
                            <h5 className="card-title text-danger mb-2 fs-5 fw-bold text-truncate">
                                {review.Movie ? review.Movie.originalTitle : '영화 제목 없음'}
                            </h5>
                            <h6 className="card-subtitle mb-2">
                                작성자: <span className="text-info">{review.User.nickname}</span>
                            </h6>
                            <div className="mb-3 d-flex align-items-center">
                                <span className="text-warning me-1">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} size={20} fill="currentColor" strokeWidth={0} />
                                    ))}
                                    {[...Array(5 - review.rating)].map((_, i) => (
                                        <Star
                                            key={i + review.rating}
                                            size={20}
                                            className="text-light"
                                            strokeWidth={1}
                                        />
                                    ))}
                                </span>
                                <span className="ms-1 text-light">{review.rating} / 5</span>
                            </div>
                            <p className="card-text flex-grow-1 text-light mb-4 review-text-ellipsis">
                                {review.content}
                            </p>
                            <small className="mt-auto">
                                작성일:{' '}
                                {new Date(review.createdAt).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </small>
                            {showActions && currentUser && currentUser.id === review.userId && (
                                <div className="mt-3 d-flex justify-content-end gap-2">
                                    <button
                                        className="btn btn-sm btn-outline-info d-flex align-items-center rounded-pill px-3 py-1"
                                        onClick={() => handleEdit(review)}
                                    >
                                        <Edit size={16} className="me-1" /> 수정
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger d-flex align-items-center rounded-pill px-3 py-1"
                                        onClick={() => onDelete(review.id)}
                                    >
                                        <Trash2 size={16} className="me-1" /> 삭제
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ReviewList;
