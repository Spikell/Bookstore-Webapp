import React, { useEffect, useState } from 'react'
import BookCards from './BookCards'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";

const OtherBooks = ({ onBookSelect }) => {
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/all-books`)
            .then(res => res.json())
            .then(data => {
                setBooks(data.slice(20, 30));
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    const SkeletonBookCard = () => (
        <div className="bg-white rounded-lg border-r-2 border-b-2 shadow-lg overflow-hidden h-[480px] w-full flex flex-col">
            <div className="h-[320px] w-full overflow-hidden">
                <Skeleton height="100%" />
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                    <Skeleton width="80%" height={28} className="mb-2" />
                    <Skeleton width="60%" height={20} className="mb-1" />
                </div>
                <div className="mt-2">
                    <Skeleton width="40%" height={20} />
                </div>
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
                        navigation={{
                            nextEl: '.swiper-button-next-otherbooks',
                            prevEl: '.swiper-button-prev-otherbooks',
                            disabledClass: 'swiper-button-disabled',
                            hiddenClass: 'swiper-button-hidden'
                        }}
                        breakpoints={{
                            640: { slidesPerView: 2, spaceBetween: 20 },
                            768: { slidesPerView: 4, spaceBetween: 40 },
                            1024: { slidesPerView: 5, spaceBetween: 50 },
                        }}
                        modules={[Pagination, Navigation]}
                    >
                        {[...Array(5)].map((_, index) => (
                            <SwiperSlide key={index}>
                                <SkeletonBookCard />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="swiper-button-prev-otherbooks"></div>
                    <div className="swiper-button-next-otherbooks"></div>
                    <style>
                        {`
                            .swiper-button-next-otherbooks,
                            .swiper-button-prev-otherbooks {
                                color: #1d4ed8;
                                background-color: rgba(255, 255, 255, 0.8);
                                border-radius: 50%;
                                width: 40px;
                                height: 40px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                position: absolute;
                                top: 50%;
                                transform: translateY(-50%);
                                z-index: 10;
                                cursor: pointer;
                            }
                            .swiper-button-prev-otherbooks {
                                left: 10px;
                            }
                            .swiper-button-next-otherbooks {
                                right: 10px;
                            }
                            .swiper-button-next-otherbooks:after,
                            .swiper-button-prev-otherbooks:after {
                                font-size: 18px;
                                font-weight: bold;
                                content: '';
                            }
                            .swiper-button-next-otherbooks:after {
                                content: '→';
                            }
                            .swiper-button-prev-otherbooks:after {
                                content: '←';
                            }
                            .swiper-button-disabled {
                                opacity: 0;
                                cursor: auto;
                                pointer-events: none;
                                visibility: hidden;
                            }
                            .swiper-button-hidden {
                                opacity: 0;
                                visibility: hidden;
                            }
                        `}
                    </style>
                </div>
            ) : (
                <BookCards books={books} headline="Other Books" onBookSelect={onBookSelect} />
            )}
        </div>
    )
}

export default OtherBooks