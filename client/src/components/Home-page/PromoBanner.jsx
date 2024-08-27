import React from 'react'
import { Link } from 'react-router-dom'
import PromoImg from '../../assets/PromoImage.png'

const PromoBanner = () => {
  return (
    <div className='mt-16 py-12 bg-teal-200 px-4 lg:px-24' >
        <div className='flex flex-col md:flex-row justify-between items-center gap-12'>
            <div className='md:w-1/2'>
                <h2 className='text-4xl font-bold mb-6 leading-snug'>
                    The 2024 National Book Awards for fiction Shortlist
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
