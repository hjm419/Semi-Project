import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import api from '../../api/axiosInstance';
import '../../pages/styles/Home.css';
import { Type } from 'lucide-react';

function TopCarousel() {
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [topCarouselMovies, setTopCarouselMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleCarousel = (selectedIndex) => {
        setCarouselIndex(selectedIndex);
    };

    useEffect(() => {
        const fetchCarouselData = async () => {
            setLoading(true);
            try {
                // 캐러셀 이미지 API 호출
                const response = await api.getCarouselImages();
                console.log('캐러셀 이미지 데이터:', response.data);

                // 성공적으로 받아온 경우 배열로 저장
                if (response.data.success) {
                    setTopCarouselMovies(response.data.data); // [{id, title, backdropUrl}, ...]
                } else {
                    setTopCarouselMovies([]);
                }
            } catch (error) {
                console.error('캐러셀 데이터를 불러오는 데 실패했습니다:', error);
                setTopCarouselMovies([]);
            }
            setLoading(false);
        };

        fetchCarouselData();
    }, []);

    if (loading) {
        return (
            <section className="position-relative w-100 carousel-height">
                <div className="d-flex justify-content-center align-items-center h-100">
                    <div className="text-center">
                        <div className="spinner-border text-danger" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">인기 영화를 불러오는 중...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="position-relative w-100 carousel-height">
            <Carousel
                activeIndex={carouselIndex}
                onSelect={handleCarousel}
                interval={4500}
                indicators={true}
                controls={true}
                className="topCarousel"
            >
                {topCarouselMovies.map((movie) => (
                    <Carousel.Item key={movie.id} className="h-100">
                        <div className="carousel-image-wrapper">
                            {/* 확대+블러 배경 이미지 */}
                            <img src={movie.backdropUrl} alt="" className="carousel-bg-blur" aria-hidden="true" />
                            {/* 원본 이미지 */}
                            <img src={movie.backdropUrl} alt={movie.title} className="carousel-main-img" />
                            <div className="carousel-image-title">
                                <a href={`/movies/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    {movie.title}
                                </a>
                            </div>
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </section>
    );
}

export default TopCarousel;
