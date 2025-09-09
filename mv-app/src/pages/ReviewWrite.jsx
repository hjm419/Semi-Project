import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import ReviewForm from '../components/review/ReviewForm';
import api from '../api/axiosInstance';

function ReviewWrite() {
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(params.id);
    const { movieId: writeMovieId, movieTitle: writeMovieTitle } = location.state || {};
    const reviewId = params.id;

    // 폼에 넘길 데이터
    const [initialData, setInitialData] = useState(null);
    const [movieTitle, setMovieTitle] = useState(writeMovieTitle || '');
    const [loading, setLoading] = useState(isEditMode);

    useEffect(() => {
        if (isEditMode && reviewId) {
            // 리뷰 데이터 불러오기 (영화 제목은 ReviewList에서 navigate의 state로 전달받음)
            setLoading(true);
            api.getReview(reviewId)
                .then((res) => {
                    const review = res.data.review;
                    setInitialData({
                        rating: review.rating,
                        reviewText: review.content,
                    });
                    // 영화 제목은 writeMovieTitle을 그대로 사용
                })
                .catch(() => {
                    setInitialData(null);
                })
                .finally(() => setLoading(false));
        } else {
            setInitialData({ rating: 0, reviewText: '' });
            setMovieTitle(writeMovieTitle || '');
        }
    }, [isEditMode, reviewId, writeMovieTitle]);

    // 작성/수정 API 연동
    const handleSubmit = async (formData) => {
        if (isEditMode && reviewId) {
            // 수정
            try {
                setLoading(true);
                await api.updateReview(reviewId, {
                    rating: formData.rating,
                    content: formData.reviewText,
                });
                alert('리뷰가 성공적으로 수정되었습니다.');
                // navigate(`/movies/${writeMovieId || initialData?.movieId}`);
                navigate('/mypage');
            } catch (err) {
                alert('리뷰 수정에 실패했습니다.');
            } finally {
                setLoading(false);
            }
        } else {
            // 작성
            try {
                setLoading(true);
                await api.createReview({
                    rating: formData.rating,
                    content: formData.reviewText,
                    movieId: writeMovieId,
                });
                alert('리뷰가 성공적으로 작성되었습니다.');
                navigate(`/movies/${writeMovieId}`);
            } catch (err) {
                alert('리뷰 작성에 실패했습니다.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <ReviewForm
            initialData={initialData}
            movieTitle={movieTitle}
            loading={loading}
            buttonText={isEditMode ? '리뷰 수정하기' : '리뷰 작성하기'}
            onSubmit={handleSubmit}
        />
    );
}

export default ReviewWrite;
