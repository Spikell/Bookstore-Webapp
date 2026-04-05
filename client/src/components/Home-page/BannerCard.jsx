import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";
import "../Home-page/BannerCard.css";

// import required modules
import { EffectCards, Autoplay, Keyboard } from "swiper/modules";

// Import book images
import book1 from "../../assets/banner-books/book1.png";
import book2 from "../../assets/banner-books/book2.png";
import book3 from "../../assets/banner-books/book3.png";
import book4 from "../../assets/banner-books/book4.png";
import book5 from "../../assets/banner-books/book5.png";

const BannerCard = () => {
  return (
    <div className="banner z-10 relative">
      <Swiper
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards, Autoplay, Keyboard]}
        className="mySwiper"
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        keyboard={{
          enabled: true,
        }}
        onClick={(swiper) => {
          if (swiper.isEnd) {
            swiper.slideTo(0);
          } else {
            swiper.slideNext();
          }
        }}
        rewind={true}
      >
        <SwiperSlide style={{ backgroundImage: `url(${book1})` }}></SwiperSlide>
        <SwiperSlide style={{ backgroundImage: `url(${book2})` }}></SwiperSlide>
        <SwiperSlide style={{ backgroundImage: `url(${book3})` }}></SwiperSlide>
        <SwiperSlide style={{ backgroundImage: `url(${book4})` }}></SwiperSlide>
        <SwiperSlide style={{ backgroundImage: `url(${book5})` }}></SwiperSlide>
      </Swiper>
    </div>
  );
};

export default BannerCard;