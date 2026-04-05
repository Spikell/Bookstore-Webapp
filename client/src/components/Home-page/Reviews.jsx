import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { Avatar } from "flowbite-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/effect-cards";

// import required modules
import { Pagination, Autoplay, EffectCards } from "swiper/modules";

const Reviews = () => {
  // Review data array for easier management
  const reviewsData = [
    {
      id: 1,
      text: "This website is fantastic! The user interface is so easy to navigate and I found exactly what I was looking for.",
      avatar: "https://i.pravatar.cc/150?img=1",
      name: "Jessy Moore",
      title: "CEO, Co-Founder"
    },
    {
      id: 2,
      text: "I love shopping on this site! The selection of books is amazing and the checkout process is seamless.",
      avatar: "https://i.pravatar.cc/150?img=11",
      name: "John Doe",
      title: "Book Enthusiast"
    },
    {
      id: 3,
      text: "The customer service on this website is top-notch. They were very helpful and resolved my issue quickly.",
      avatar: "https://i.pravatar.cc/150?img=5",
      name: "Sarah Lee",
      title: "Literature Professor"
    },
    {
      id: 4,
      text: "I had a great experience shopping here. The delivery was fast and the books arrived in perfect condition.",
      avatar: "https://i.pravatar.cc/150?img=12",
      name: "Michael Brown",
      title: "Avid Reader"
    },
    {
      id: 5,
      text: "The book recommendations on this site are spot on! I've discovered so many new authors that I now love.",
      avatar: "https://i.pravatar.cc/150?img=9",
      name: "Emily Johnson",
      title: "Bookstore Owner"
    },
    {
      id: 6,
      text: "I appreciate the detailed descriptions and reviews for each book. It makes my purchasing decisions so much easier!",
      avatar: "https://i.pravatar.cc/150?img=13",
      name: "David Wilson",
      title: "Fiction Writer"
    },
    {
      id: 7,
      text: "The special offers and discounts are amazing! I saved so much on my last order and got some great books.",
      avatar: "https://i.pravatar.cc/150?img=23",
      name: "Sophia Martinez",
      title: "College Student"
    },
    {
      id: 8,
      text: "The mobile app is fantastic! I can browse and purchase books on the go. The interface is clean and intuitive.",
      avatar: "https://i.pravatar.cc/150?img=15",
      name: "Robert Thompson",
      title: "Tech Enthusiast"
    }
  ];

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-4 relative">
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">What Our Customers Say</span>
            <div className="w-32 h-1 bg-gradient-to-r from-amber-500 to-orange-600 mx-auto mt-3"></div>
          </h2>
        </div>

        {/* Desktop view - Grid layout */}
        <div className="hidden md:block">
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            modules={[Pagination, Autoplay]}
            className="mySwiper"
          >
            {reviewsData.map((review) => (
              <SwiperSlide key={review.id}>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 h-full">
                  <div className="p-8">
                    <div className="flex items-center mb-4">
                      <div className="text-amber-500 flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>
                    </div>
                    <div className="relative">
                      <FaQuoteLeft className="text-gray-200 text-4xl absolute -top-2 -left-1" />
                      <p className="text-gray-600 mb-6 relative z-10 pl-6">
                        {review.text}
                      </p>
                    </div>
                    <div className="flex items-center mt-6">
                      <Avatar
                        img={review.avatar}
                        alt={`avatar of ${review.name}`}
                        rounded
                        size="md"
                      />
                      <div className="ml-4">
                        <h5 className="text-lg font-semibold text-gray-800">{review.name}</h5>
                        <p className="text-sm text-gray-500">{review.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Mobile view - Card effect */}
        <div className="md:hidden max-w-sm mx-auto">
          <Swiper
            effect={"cards"}
            grabCursor={true}
            modules={[EffectCards, Autoplay]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="mySwiper"
          >
            {reviewsData.map((review) => (
              <SwiperSlide key={review.id}>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-amber-500 flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <FaQuoteLeft className="text-gray-200 text-3xl absolute -top-2 -left-1" />
                    <p className="text-gray-600 mb-6 relative z-10 pl-5">
                      {review.text}
                    </p>
                  </div>
                  <div className="flex items-center mt-4">
                    <Avatar
                      img={review.avatar}
                      alt={`avatar of ${review.name}`}
                      rounded
                      size="md"
                      className="border-2 border-amber-500"
                    />
                    <div className="ml-4">
                      <h5 className="text-lg font-semibold text-gray-800">{review.name}</h5>
                      <p className="text-sm text-gray-500">{review.title}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
