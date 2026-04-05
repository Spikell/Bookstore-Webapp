import React from 'react'
import { Link } from 'react-router-dom'
import PromoImg from '../../assets/PromoImage.png'

const PromoBanner = () => {
  return (
    <div className='py-12 bg-teal-200 px-4 lg:px-24' >
        <div className='flex flex-col md:flex-row justify-between items-center gap-12'>
            <div className='md:w-1/2'>
                <h2 className='text-4xl font-extrabold mb-6 leading-snug relative'>
                    <span className='bg-gradient-to-r from-teal-600 to-blue-700 bg-clip-text text-transparent'>The 2024 National Book Awards</span>
                    <span className='block mt-2 bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent'>for fiction Shortlist</span>
                </h2>
                    <Link to="/shop" className='block'>
                    <button className='bg-blue-600 text-white font-semibold px-5 py-2 rounded-md hover:bg-blue-800 transition-all duration-300'>
                        Explore More
                    </button>
                </Link>
            </div>
            <div>
                <img src={PromoImg} alt="promo banner" className='w-96' />
            </div>
        </div>
      
    </div>
  )
}

export default PromoBanner
