import React, { useEffect, useState } from 'react';
import './styles/Home.css';
import TopCarousel from '../components/carousel/TopCarousel';
import MovieList from '../components/movie/MovieList';
import BottomCarousel from '../components/carousel/BottomCarousel';

import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

function Home({ isLoggedIn, currentUser }) {
    useEffect(() => {
        // URL 해시(#)로 스크롤 이동
        if (window.location.hash) {
            const element = document.getElementById(window.location.hash.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, []);

    return (
        <div>
            <div className="bg-dark-subtle text-white min-vh-100">
                {/* 상단 캐러셀 */}
                <TopCarousel />
                {/* 영화 목록 */}
                <MovieList />
                {/* 하단 캐러셀 */}
                <BottomCarousel />
            </div>
        </div>
    );
}

export default Home;
