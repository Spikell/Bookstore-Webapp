import React, { useEffect, useState } from 'react'
import BookCards from './BookCards';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const BestSellingBooks = ({ onBookSelect }) => {
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/all-books` || "http://localhost:5000/all-books")
        .then(res => res.json())
        .then(data => {
            setBooks(data.slice(0, 10));
            setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }, []);

    const SkeletonBookCard = () => (
        <div className="bg-white rounded-lg border-r-2 border-b-2 shadow-lg overflow-hidden">
            <div className="relative aspect-[2/3] bg-gray-100">
                <Skeleton height="100%" />
            </div>
            <div className="p-4">
                <Skeleton width="80%" height={24} className="mb-2" />
                <Skeleton width="60%" height={20} className="mb-1" />
                <Skeleton width="40%" height={20} />
            </div>
        </div>
    );

    return (
        <div>
            {isLoading ? (
                <div className="my-12 px-4 lg:px-24">
                    <h2 className="text-4xl text-center font-bold text-black my-12">
                        <Skeleton width={300} height={40} className="mx-auto" />
                    </h2>
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={10}
                        pagination={{ clickable: true }}
                        breakpoints={{
                            640: { slidesPerView: 2, spaceBetween: 20 },
                            768: { slidesPerView: 4, spaceBetween: 40 },
                            1024: { slidesPerView: 5, spaceBetween: 50 },
                        }}
                        modules={[Pagination]}
                    >
                        {[...Array(5)].map((_, index) => (
                            <SwiperSlide key={index}>
                                <SkeletonBookCard />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            ) : (
                <BookCards books={books} headline="Best Selling Books" onBookSelect={onBookSelect} />
            )}
        </div>
    )
}

export default BestSellingBooks
