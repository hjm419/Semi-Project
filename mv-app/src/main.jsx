// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // App을 AppWrapper 대신 직접 임포트
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // BrowserRouter를 여기서 임포트

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            {/* App 컴포넌트를 BrowserRouter로 직접 감쌈 */}
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
