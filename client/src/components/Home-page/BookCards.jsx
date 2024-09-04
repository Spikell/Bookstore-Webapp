import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

const BookCards = ({ headline, books }) => {
  return (
    <div className="my-12 px-4 lg:px-24">
      <h2 className="text-4xl text-center font-bold text-black my-12">
        {headline}
      </h2>
      <div className="relative pb-2"> {/* Added relative positioning and padding */}
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 50,
            },
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {books.map(book => (
            <SwiperSlide key={book._id}>
              <Link to={`/book/${book._id}`}>
                <div className="relative bg-white rounded-lg border-r-2 border-b-2 shadow-lg overflow-hidden">
                  <img src={book.imageURL} alt="" className="w-full h-90 object-cover" /> {/* Increased height to 80 */}
                  <div className="absolute top-3 right-3 bg-blue-700 hover:bg-blue-800 p-2 rounded-lg">
                    <FaShoppingCart className="text-white w-4 h-4" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{book.bookTitle}</h3>
                    <p className="text-sm text-gray-600">{book.authorName}</p>
                    <div className="mt-2">
                      <p className="text-lg font-bold text-blue-600">${book.price}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <style>
        {`
          .mySwiper {
            padding-bottom: 30px;
          }
          .mySwiper .swiper-pagination {
            bottom: 0 !important;
          }
        `}
      </style>
    </div>
  );
};

export default BookCards;