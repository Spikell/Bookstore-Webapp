import React from 'react'
import Banner from '../components/Home-page/Banner'
import BestSellingBooks from '../components/Home-page/BestSellingBooks'
import FavBook from '../components/Home-page/FavBook'
import PromoBanner from '../components/Home-page/PromoBanner'
import OtherBooks from '../components/Home-page/OtherBooks'
import Reviews from '../components/Home-page/Reviews'

const Home = () => {
  return (
    <div>
      <Banner/>
      <BestSellingBooks/>
      <FavBook/>
      <PromoBanner/>
      <OtherBooks/> 
      <Reviews/>
    </div>
    
  )
}

export default Home
