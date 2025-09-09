import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import api from '../../api/axiosInstance';

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
                // ID 1,2,3번 영화를 단건 조회로 가져오기
                const topCarouselPromises = [1, 2, 3].map((id) => api.getMovie(id));
                const topCarouselResults = await Promise.all(topCarouselPromises);

                // 성공적으로 가져온 영화들만 필터링
                const validMovies = topCarouselResults
                    .filter((response) => response.data.success)
                    .map((response) => response.data.data);

                setTopCarouselMovies(validMovies);
            } catch (error) {
                console.error('캐러셀 데이터를 불러오는 데 실패했습니다:', error);
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
        <section>
            <Carousel
                activeIndex={carouselIndex}
                onSelect={handleCarousel}
                interval={4500}
                indicators={true}
                controls={true}
                className="topCarousel"
            >
                {topCarouselMovies.map((movie, index) => (
                    <Carousel.Item key={movie.id}>
                        <img src={movie.posterPath} alt={movie.originalTitle} />
                    </Carousel.Item>
                ))}
            </Carousel>
        </section>
    );
}

export default TopCarousel;
