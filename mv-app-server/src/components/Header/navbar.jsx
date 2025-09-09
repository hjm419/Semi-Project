// src/components/Header/navbar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import NetplusLogo from './NetplusLogo';
import { Home as HomeIcon, LogIn, UserPlus, FileText, User, LogOut } from 'lucide-react';

export default function Navbar({ isLoggedIn: isLoggedInProp, currentUser, onLogout }) {
    const navigate = useNavigate();
    const isLoggedIn = isLoggedInProp ?? Boolean(currentUser);

    const handleLogout = () => {
        onLogout?.();
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-lg border-bottom border-secondary custom-nav-height">
            <div className="container-fluid container-max-width">
                <NavLink className="navbar-brand me-2" to="/">
                    <NetplusLogo />
                </NavLink>

                <button
                    className="navbar-toggler border-danger"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    {/* 좌측 메뉴 */}
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link d-flex align-items-center text-white-50 nav-item-hover" to="/">
                                <HomeIcon size={16} className="me-2" /> 홈
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <a
                                className="nav-link d-flex align-items-center text-white-50 nav-item-hover"
                                href="/#latest-movies"
                            >
                                <FileText size={16} className="me-2" /> 최신 영화
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className="nav-link d-flex align-items-center text-white-50 nav-item-hover"
                                href="/#top-rating"
                            >
                                <FileText size={16} className="me-2" /> 추천 영화
                            </a>
                        </li>
                    </ul>

                    {/* 우측 메뉴 */}
                    <ul className="navbar-nav">
                        {isLoggedIn ? (
                            <>
                                <li className="nav-item d-flex align-items-center me-3">
                                    <span className="nav-link text-white-50 d-flex align-items-center">
                                        <User size={16} className="me-2" /> {currentUser?.nickname ?? '사용자'}
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        className="nav-link d-flex align-items-center text-white-50 nav-item-hover"
                                        to="/mypage"
                                    >
                                        <FileText size={16} className="me-2" /> 내 리뷰
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className="btn btn-outline-danger btn-sm ms-3 d-flex align-items-center rounded-pill"
                                        onClick={handleLogout}
                                    >
                                        <LogOut size={16} className="my-2" /> 로그아웃
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item me-2">
                                    <NavLink
                                        className="nav-link d-flex align-items-center text-white-50 nav-item-hover"
                                        to="/login"
                                    >
                                        <LogIn size={16} className="me-2" /> 로그인
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink
                                        className="nav-link d-flex align-items-center text-white-50 nav-item-hover"
                                        to="/register"
                                    >
                                        <UserPlus size={16} className="me-2" /> 회원가입
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
