// src/App.jsx

import React, { useState, useEffect } from 'react';
import { Route, Routes, NavLink, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyPage from './pages/MyPage';
import ReviewWrite from './pages/ReviewWrite';
import MovieDetail from './pages/MovieDetail'; // MovieDetail 컴포넌트 임포트
import Navbar from './components/Header/navbar';
import Footer from './components/Footer';
import api from './api/axiosInstance';
// Bootstrap CSS/JS import
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = api.getCurrentUser();
        if (user) {
            setIsLoggedIn(true);
            setCurrentUser(user);
        } else {
            setIsLoggedIn(false);
            setCurrentUser(null);
        }
    }, []);

    const handleLoginSuccess = () => {
        const user = api.getCurrentUser();
        setIsLoggedIn(!!user);
        setCurrentUser(user);
    };

    const handleLogout = () => {
        api.logout();
        setIsLoggedIn(false);
        setCurrentUser(null);
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-dark-subtle text-white app-root">
            <Navbar isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={handleLogout} />
            <main className="flex-grow-1">
                <Routes>
                    <Route path="/" element={<Home isLoggedIn={isLoggedIn} currentUser={currentUser} />} />
                    <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/mypage" element={<MyPage />} />
                    <Route path="/review/write" element={<ReviewWrite />} />
                    <Route path="/review/edit/:id" element={<ReviewWrite />} />
                    <Route path="/movies/:movieId" element={<MovieDetail />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
