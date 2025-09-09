import React, { useState, useEffect } from 'react';
import { Film, Star, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';

function MovieList() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [movies, setMovies] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleCardClick = (movieId) => {
        navigate(`/movies/${movieId}`);
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // 검색어가 변경되면 1페이지로 리셋
    };

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const response = await api.getMovies({
                    page: currentPage,
                    limit: 5,
                    searchTerm: searchTerm,
                });
                setMovies(response.data.data.movies);
                setPagination(response.data.data);
            } catch (error) {
                console.error('영화 목록을 불러오는 데 실패했습니다:', error);
            }
            setLoading(false);
        };
        fetchMovies();
    }, [currentPage, searchTerm]);

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

    return (
        <div className="container py-4">
            <h2 id="latest-movies" className="text-center mb-4 text-danger fw-bold">
                최신 영화
            </h2>
            <p className="text-center text-black-50 mb-4">
                {/* Search Bar */}
                <div className="mx-auto w-50 mb-4">
                    <div className="input-group">
                        <span className="input-group-text bg-dark-subtle text-white border-end-0 border-secondary rounded-start-4">
                            <Search size={20} />
                        </span>
                        <input
                            type="text"
                            className="form-control bg-dark-subtle text-white border-start-0 border-secondary rounded-end-4"
                            placeholder="영화 제목을 검색하세요..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
                <Film />
                영화 카드를 눌러 상세 정보와 후기를 확인하세요.
                <Film />
            </p>

            {/* 영화 목록 카드 */}
            <div className="row g-4 justify-content-center mb-5">
                {loading ? (
                    <p>로딩 중...</p>
                ) : movies.length > 0 ? (
                    movies.map((movie) => (
                        <div key={movie.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
                            <div
                                className="card h-100 rounded-lg shadow-lg bg-dark text-white border-0 movie-card-hover cursor-pointer"
                                onClick={() => handleCardClick(movie.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <img
                                    src={movie.posterPath}
                                    className="card-img-top rounded-top-lg"
                                    alt={movie.originalTitle}
                                />
                                <div className="card-body d-flex flex-column align-items-center justify-content-center p-3">
                                    <h5 className="card-title text-center text-truncate w-100">
                                        {movie.originalTitle}
                                    </h5>
                                    {movie.averageRating && (
                                        <div className="d-flex align-items-center mt-2">
                                            <Star
                                                size={16}
                                                fill="var(--bs-yellow)"
                                                colo0r="var(--bs-yellow)"
                                                className="me-1"
                                            />
                                            <span className="text-warning fw-bold">
                                                {Number(movie.averageRating).toFixed(1)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center text-black-50">
                        <p className="fs-5">검색 결과가 없습니다.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <nav aria-label="Page navigation" className="d-flex justify-content-center mt-4">
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
                            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
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
    );
}

export default MovieList;
