// src/api/axiosInstance.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터 - 토큰 자동 추가
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // 토큰이 이미 "Bearer "로 시작하는지 확인
            if (token.startsWith('Bearer ')) {
                config.headers.Authorization = token;
            } else {
                config.headers.Authorization = `Bearer ${token}`;
            }
            console.log('Authorization header:', config.headers.Authorization);
        } else {
            console.log('No auth token found');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 - 401 에러 처리
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.log('Unauthorized request. Redirecting to login.');
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            // window.location.href = '/login'; // 실제 앱에서는 라우터를 이용하여 처리
        }
        return Promise.reject(error);
    }
);

// 인증 관련 API
const authAPI = {
    register: async (userData) => {
        const response = await axiosInstance.post('/auth/register', userData);
        return response;
    },

    login: async (credentials) => {
        const response = await axiosInstance.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        }
        return response;
    },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        console.log('User logged out.');
    },

    getCurrentUser: () => {
        try {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            return user;
        } catch (e) {
            console.error('Failed to parse currentUser from localStorage', e);
            return null;
        }
    },

    getMe: async () => {
        const response = await axiosInstance.get('/auth/me');
        return response;
    },
};

// 리뷰 관련 API
const reviewAPI = {
    // 모든 리뷰 조회
    getAllReviews: async (movieId) => {
        const response = await axiosInstance.get(`/reviews?movieId=${movieId}`);
        return response;
    },

    // 내 리뷰 조회
    getMyReviews: async ({ page, limit }) => {
        const response = await axiosInstance.get('/reviews/my', {
            params: { page, limit },
        });
        return response;
    },

    // 특정 리뷰 조회
    getReview: async (reviewId) => {
        const response = await axiosInstance.get(`/reviews/${reviewId}`);
        return response;
    },

    // 리뷰 생성
    createReview: async (reviewData) => {
        const response = await axiosInstance.post('/reviews', reviewData);
        return response;
    },

    // 리뷰 수정
    updateReview: async (reviewId, updatedData) => {
        const response = await axiosInstance.put(`/reviews/${reviewId}`, updatedData);
        return response;
    },

    // 리뷰 삭제
    deleteReview: async (reviewId) => {
        const response = await axiosInstance.delete(`/reviews/${reviewId}`);
        return response;
    },

    // 영화 평점 평균 조회
    getMovieAverageRating: async (movieId) => {
        const response = await axiosInstance.get(`/reviews/movie/${movieId}/average`);
        return response;
    },

    // 영화 제목으로 검색
    searchMoviesByTitle: async (title) => {
        const response = await axiosInstance.get(`/reviews/search?title=${encodeURIComponent(title)}`);
        return response;
    },
};

//영화관련
const movieAPI = {
    //DB에 저장된 영화 목록을 조회합니다. (페이지네이션 및 검색 기능 포함)
    getMovies: async ({ page, limit, searchTerm }) => {
        const response = await axiosInstance.get('/movies', {
            params: {
                page,
                limit,
                searchTerm,
            },
        });
        return response;
    },

    //영화 상세조회
    getMovie: async (movieId) => {
        const response = await axiosInstance.get(`/movies/${movieId}`);
        return response;
    },
};

// 통합 API 객체
const api = {
    ...authAPI,
    ...reviewAPI,
    ...movieAPI,
};

export default api;
