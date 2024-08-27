import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";
import "../Home-page/BannerCard.css";

// import required modules
import { EffectCards } from "swiper/modules";
const BannerCard = () => {
  return (
    <div className="banner">
      <Swiper
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards]}
        className="mySwiper"
        onClick={(swiper) => {
          if (swiper.isEnd) {
            swiper.slideTo(0);
          } else {
            swiper.slideNext();
          }
        }}
        loop={true}
      >
        <SwiperSlide></SwiperSlide>
        <SwiperSlide></SwiperSlide>
        <SwiperSlide></SwiperSlide>
        <SwiperSlide></SwiperSlide>
        <SwiperSlide></SwiperSlide>
      </Swiper>
    </div>
  );
};

export default BannerCard;