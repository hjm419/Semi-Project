// src/components/footer.jsx
import React from 'react';

const Footer = () => (
    <footer className="bg-dark text-white-50 text-center py-4 mt-auto shadow-lg border-top border-secondary">
        <div className="container container-max-width">
            <p className="mb-0">&copy; {new Date().getFullYear()} NETPLUS. All rights reserved.</p>
            <p className="text-sm mt-2 mb-0">회사 정보 | 이용 약관 | 개인정보 처리방침 | 연락처</p>
        </div>
    </footer>
);

export default Footer;
