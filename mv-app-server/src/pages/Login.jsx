// src/pages/Login.jsx

import React, { useState, useEffect } from 'react';
import AuthForm from '../components/Auth/AuthForm';
import api from '../api/axiosInstance';
import { useNavigate, useLocation } from 'react-router-dom';

function Login({ onLoginSuccess }) {
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        if (api.getCurrentUser()) {
            navigate('/');
        }
    }, [navigate]);

    const handleLogin = async (credentials) => {
        setLoading(true);
        try {
            setErrorMessage('');
            await api.login(credentials);
            onLoginSuccess();
            navigate(from, { replace: true });
        } catch (error) {
            const message = error.response?.data?.message || '로그인 중 오류가 발생했습니다.';
            setErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark-subtle">
            <div className="col-md-7 col-lg-5 col-xl-4">
                <AuthForm type="login" onSubmit={handleLogin} errorMessage={errorMessage} loading={loading} />
            </div>
        </div>
    );
}

export default Login;
