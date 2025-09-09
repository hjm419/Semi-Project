// src/components/ReviewForm.jsx

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

function ReviewForm({ initialData = {}, onSubmit, buttonText, loading, movieTitle }) {
    const safeInitialData = initialData || {};

    const [rating, setRating] = useState(safeInitialData.rating || 0);
    const [reviewText, setReviewText] = useState(safeInitialData.reviewText || '');
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        if (initialData) {
            setRating(initialData.rating || 0);
            setReviewText(initialData.reviewText || '');
        } else {
            setRating(0);
            setReviewText('');
        }
    }, [initialData]);

    const handleRatingClick = (newRating) => {
        if (!loading) {
            setRating(newRating);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!reviewText.trim() || rating === 0) {
            alert('평점과 후기 내용을 모두 입력해주세요.');
            return;
        }
        onSubmit({ rating, reviewText });
    };

    return (
        <div className="card shadow-lg p-5 bg-dark text-white rounded-4 border-0">
            <h2 className="card-title text-center mb-4 text-danger fw-bold">
                {buttonText === '리뷰 수정하기' ? '리뷰 수정' : '영화 후기 작성'}
            </h2>
            {movieTitle && <h3 className="fw-bold text-info mb-4 text-center">영화 제목: {movieTitle}</h3>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="form-label text-light">평점</label>
                    <div className="d-flex align-items-center mb-2">
                        {[1, 2, 3, 4, 5].map((starValue) => (
                            <Star
                                key={starValue}
                                size={36}
                                className="cursor-pointer mx-1"
                                fill={hoverRating >= starValue || rating >= starValue ? 'var(--bs-yellow)' : 'none'}
                                color="var(--bs-yellow)"
                                onClick={() => handleRatingClick(starValue)}
                                onMouseEnter={() => setHoverRating(starValue)}
                                onMouseLeave={() => setHoverRating(0)}
                                style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                            />
                        ))}
                        <span className="ms-3 fs-4 text-white-50">{rating} / 5</span>
                    </div>
                </div>
                <div className="mb-5">
                    <label htmlFor="reviewTextInput" className="form-label text-light">
                        후기 내용
                    </label>
                    <textarea
                        className="form-control bg-secondary text-white border-0 rounded-3 p-3"
                        id="reviewTextInput"
                        rows="8"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        disabled={loading}
                        required
                        placeholder="영화에 대한 감상을 자유롭게 남겨주세요."
                    ></textarea>
                </div>
                <div className="d-grid gap-2">
                    <button
                        type="submit"
                        className="btn btn-danger btn-lg mt-3 py-3 rounded-pill fw-bold"
                        disabled={loading}
                    >
                        {loading ? '처리 중...' : buttonText}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ReviewForm;
