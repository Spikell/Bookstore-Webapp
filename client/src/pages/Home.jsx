import React, { useState, useCallback } from 'react'
import Banner from '../components/Home-page/Banner'
import BestSellingBooks from '../components/Home-page/BestSellingBooks'
import FavBook from '../components/Home-page/FavBook'
import PromoBanner from '../components/Home-page/PromoBanner'
import OtherBooks from '../components/Home-page/OtherBooks'
import Reviews from '../components/Home-page/Reviews'
import SingleBook from '../components/SingleBook'

const Home = () => {
  const [selectedBook, setSelectedBook] = useState(null);

  const handleBookSelect = (book) => {
    setSelectedBook(book);
  };

  const handleCloseBook = useCallback(() => {
    setSelectedBook(null);
  }, []);

  const addToCart = (book) => {
    // Implement add to cart functionality
    console.log('Adding to cart:', book);
  };

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      handleCloseBook();
    }
  }, [handleCloseBook]);

  return (
    <div>
      <Banner onBookSelect={handleBookSelect} />
      <BestSellingBooks onBookSelect={handleBookSelect} />
      <FavBook/>
      <PromoBanner/>
      <OtherBooks onBookSelect={handleBookSelect} /> 
      <Reviews/>
      {selectedBook && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-lg w-11/12 max-w-4xl" onClick={e => e.stopPropagation()}>
            <SingleBook book={selectedBook} onClose={handleCloseBook} addToCart={addToCart} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
