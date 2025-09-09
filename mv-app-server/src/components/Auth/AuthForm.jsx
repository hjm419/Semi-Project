// src/components/AuthForm.jsx

import React, { useState } from 'react';

function AuthForm({ type, onSubmit, errorMessage, loading }) {
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (type === 'register') {
            onSubmit({ nickname, email, password });
        } else {
            onSubmit({ email, password });
        }
    };

    return (
        <div className="card shadow-lg p-5 bg-dark text-white rounded-4 border-0">
            <h2 className="card-title text-center mb-4 text-danger fw-bold">
                {type === 'login' ? '로그인' : '회원가입'}
            </h2>
            <form onSubmit={handleSubmit}>
                {type === 'register' && (
                    <div className="mb-3">
                        <label htmlFor="usernameInput" className="form-label text-light">
                            사용자 이름
                        </label>
                        <input
                            type="text"
                            className="form-control form-control-lg bg-secondary text-white border-0 rounded-pill px-4"
                            id="usernameInput"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>
                )}
                <div className="mb-3">
                    <label htmlFor="emailInput" className="form-label text-light">
                        이메일 주소
                    </label>
                    <input
                        type="email"
                        className="form-control form-control-lg bg-secondary text-white border-0 rounded-pill px-4"
                        id="emailInput"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="passwordInput" className="form-label text-light">
                        비밀번호
                    </label>
                    <input
                        type="password"
                        className="form-control form-control-lg bg-secondary text-white border-0 rounded-pill px-4"
                        id="passwordInput"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>
                {errorMessage && (
                    <div className="alert alert-danger text-center mt-3" role="alert">
                        {errorMessage}
                    </div>
                )}
                <div className="d-grid gap-2">
                    <button
                        type="submit"
                        className="btn btn-danger btn-lg mt-4 py-3 rounded-pill fw-bold"
                        disabled={loading}
                    >
                        {loading ? '처리 중...' : type === 'login' ? '로그인' : '회원가입'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AuthForm;
