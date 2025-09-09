// src/pages/Register.jsx

import React, { useState, useEffect } from 'react';
import AuthForm from '../components/Auth/AuthForm';
import api from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (api.getCurrentUser()) {
            navigate('/');
        }
    }, [navigate]);

    const handleRegister = async (userData) => {
        setLoading(true);
        try {
            setErrorMessage('');
            const response = await api.register(userData);
            console.log('회원가입 성공:', response.data);
            alert('회원가입이 완료되었습니다! 로그인 해주세요.'); // Custom alert 사용
            navigate('/login');
        } catch (error) {
            const message = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
            setErrorMessage(message);
            console.error('회원가입 오류:', error);
        } finally {
            setLoading(false);
        }
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

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark-subtle">
            <div className="col-md-7 col-lg-5 col-xl-4">
                <AuthForm type="register" onSubmit={handleRegister} errorMessage={errorMessage} loading={loading} />
            </div>
        </div>
    );
}

export default Register;
