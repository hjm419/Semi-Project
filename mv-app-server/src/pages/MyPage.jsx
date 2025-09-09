// src/pages/MyPage.jsx

import React, { useEffect, useState } from 'react';
import ReviewList from '../components/review/ReviewList';
import Navbar from '../components/Header/navbar';
import Footer from '../components/Footer';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

function MyPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = api.getCurrentUser();
        if (!user) {
            navigate('/login');
            return;
        }
        setCurrentUser(user);

        const fetchMyReviews = async () => {
            try {
                setLoading(true);
                const response = await api.getMyReviews({ page: currentPage, limit: 4 });
                setReviews(response.data.reviews);
                setPagination(response.data.pagination);
            } catch (err) {
                console.error('내 리뷰를 불러오는 중 오류 발생:', err);
                setError('내 리뷰를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchMyReviews();
    }, [navigate, currentPage]);

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDeleteReview = async (reviewId) => {
        // Custom alert/confirm 사용
        const confirmDelete = window.confirm('정말로 이 리뷰를 삭제하시겠습니까?'); // 실제 앱에서는 커스텀 모달로 대체
        if (confirmDelete) {
            try {
                await api.deleteReview(reviewId);
                setReviews(reviews.filter((review) => review.id !== reviewId));
                alert('리뷰가 성공적으로 삭제되었습니다.');
            } catch (err) {
                console.error('리뷰 삭제 중 오류 발생:', err);
                setError('리뷰 삭제에 실패했습니다.');
            }
        }
    };
    const handleEditReview = (review) => {
        navigate(`/movies/${review.movieId}/review/edit/${review.id}`);
    };

    const alert = (message) => {
        const customAlert = document.createElement('div');
        customAlert.className =
            'alert alert-info alert-dismissible fade show fixed-top mt-3 mx-auto shadow-lg bg-info text-white border-0';
        customAlert.style.maxWidth = '400px';
        customAlert.style.zIndex = '1050';
        customAlert.setAttribute('role', 'alert');
        customAlert.innerHTML = `
      <div>${message}</div>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
        document.body.appendChild(customAlert);
        setTimeout(() => {
            customAlert.remove();
        }, 3000);
    };

    const generatePagination = () => {
        if (!pagination) return { pageNumbers: [], startPage: 1, endPage: 1 };

        const { currentPage, totalPages } = pagination;
        const pagesPerGroup = 5;
        const currentGroup = Math.ceil(currentPage / pagesPerGroup);

        let startPage = (currentGroup - 1) * pagesPerGroup + 1;
        let endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

        const pageNumbers = [];
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return { pageNumbers, startPage, endPage, totalPages };
    };

    const { pageNumbers, startPage, endPage, totalPages } = generatePagination();

    if (loading) {
        return (
            <div
                className="d-flex flex-column justify-content-center align-items-center text-danger"
                style={{ minHeight: '80vh' }}
            >
                <div className="spinner-border mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">로딩 중...</span>
                </div>
                <p className="fs-5">리뷰 불러오는 중...</p>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger text-center mt-5">{error}</div>;
    }

    return (
        <div className="d-flex flex-column min-vh-100 bg-dark-subtle text-white app-root">
            <main className="flex-grow-1">
                <div className="bg-dark-subtle text-white min-vh-100">
                    <div className="container py-5">
                        <h1 className="text-center mb-5 text-danger display-4 fw-bold">
                            <User size={48} className="me-3" /> {currentUser?.nickname}님의 리뷰
                        </h1>
                        <ReviewList
                            reviews={reviews}
                            onDelete={handleDeleteReview}
                            onEdit={handleEditReview}
                            showActions={true}
                            currentUser={currentUser}
                        />
                        {pagination && pagination.totalPages > 1 && (
                            <nav aria-label="Page navigation" className="d-flex justify-content-center mt-5">
                                <ul className="pagination rounded-pill bg-dark-subtle border border-secondary">
                                    {/* '이전' 그룹 버튼 */}
                                    <li className={`page-item ${startPage === 1 ? 'disabled' : ''}`}>
                                        <button
                                            onClick={() => handlePageClick(startPage - 1)}
                                            className="page-link text-white bg-dark-subtle border-0"
                                        >
                                            &laquo;
                                        </button>
                                    </li>

                                    {/* 페이지 번호 버튼들 */}
                                    {pageNumbers.map((number) => (
                                        <li
                                            key={number}
                                            className={`page-item ${currentPage === number ? 'active' : ''}`}
                                        >
                                            <button
                                                onClick={() => handlePageClick(number)}
                                                className="page-link text-white bg-dark-subtle border-0"
                                            >
                                                {number}
                                            </button>
                                        </li>
                                    ))}

                                    {/* '다음' 그룹 버튼 */}
                                    <li className={`page-item ${endPage === totalPages ? 'disabled' : ''}`}>
                                        <button
                                            onClick={() => handlePageClick(endPage + 1)}
                                            className="page-link text-white bg-dark-subtle border-0"
                                        >
                                            &raquo;
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default MyPage;
