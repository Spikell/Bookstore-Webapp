import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { FaStar } from "react-icons/fa";
import { Avatar } from "flowbite-react";
import profile from "../../assets/profile.jpg";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination } from "swiper/modules";

const Reviews = () => {
  return (
    <div className="my-12 px-4 lg:px-24">
      <h2 className="text-4xl font-bold text-center my-12">Customer Reviews</h2>
      <div>
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 50,
            },
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          <SwiperSlide>
            <div className="space-y-2 bg-white py-6 px-8 rounded-lg border-r-2 border-b-2 shadow-xl md:m-5">
              <div className="text-amber-500 flex gap-2">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              {/* Text */}
              <div className="mt-7">
                <p className="mb-5">
                  This website is fantastic! The user interface is so easy to navigate and I found exactly what I was looking for.
                </p>
                <Avatar
                  img={profile}
                  alt="avatar of Jessy"
                  rounded
                  className="w-10 mb-4"
                />
                <h5 className="text-lg font-medium">Jessy Moore</h5>
                <p className="text-base">CEO, Co-Founder</p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="space-y-2 bg-white py-6 px-8 rounded-lg border-r-2 border-b-2 shadow-xl md:m-5">
              <div className="text-amber-500 flex gap-2">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              {/* Text */}
              <div className="mt-7">
                <p className="mb-5">
                  I love shopping on this site! The selection of books is amazing and the checkout process is seamless.
                </p>
                <Avatar
                  img={profile}
                  alt="avatar of John"
                  rounded
                  className="w-10 mb-4"
                />
                <h5 className="text-lg font-medium">John Doe</h5>
                <p className="text-base">Book Enthusiast</p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="space-y-2 bg-white py-6 px-8 rounded-lg border-r-2 border-b-2 shadow-xl md:m-5">
              <div className="text-amber-500 flex gap-2">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              {/* Text */}
              <div className="mt-7">
                <p className="mb-5">
                  The customer service on this website is top-notch. They were very helpful and resolved my issue quickly.
                </p>
                <Avatar
                  img={profile}
                  alt="avatar of Sarah"
                  rounded
                  className="w-10 mb-4"
                />
                <h5 className="text-lg font-medium">Sarah Lee</h5>
                <p className="text-base">Literature Professor</p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="space-y-2 bg-white py-6 px-8 rounded-lg border-r-2 border-b-2 shadow-2xl md:m-5">
              <div className="text-amber-500 flex gap-2">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              {/* Text */}
              <div className="mt-7">
                <p className="mb-5">
                  I had a great experience shopping here. The delivery was fast and the books arrived in perfect condition.
                </p>
                <Avatar
                  img={profile}
                  alt="avatar of Michael"
                  rounded
                  className="w-10 mb-4"
                />
                <h5 className="text-lg font-medium">Michael Brown</h5>
                <p className="text-base">Avid Reader</p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default Reviews;
