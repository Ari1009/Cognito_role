'use client'
import { Send } from 'lucide-react'
import React from 'react'

function Static2() {
  return (
    <div className='w-full px-4 sm:px-6 lg:px-8 mb-10'>
      <div className='relative max-w-[1200px] mx-auto'>
        {/* Background card */}
        <img
          src="static/bg.png"
          alt="Stay home background"
          className='w-full h-auto border-0 rounded-xl'
        />

        {/* Text + email input */}
        <div className='absolute inset-x-0 top-6 sm:top-10 lg:top-12 px-4 sm:px-8 flex flex-col gap-3 max-w-xl'>
          <p className='font-bold text-xl sm:text-2xl lg:text-3xl font-quicksand leading-snug'>
            Stay home & get your daily <br className='hidden sm:block' />
            needs from our shop
          </p>
          <p className='text-[rgba(126,126,126,1)] text-[11px] sm:text-[12px] mt-1 font-lato'>
            Start You'r Daily Shopping with <span className='text-[rgba(59,183,126,1)]'>Nest Mart</span>
          </p>

          <div className='w-full sm:w-72 md:w-80 h-10 flex justify-between items-center pl-2 mt-4 bg-white border-0 rounded-full shadow-sm'>
            <div className='flex gap-2 pl-1 items-center'>
              <div className='pt-0.5'><Send size='12' color='rgba(131, 131, 131, 1)'/></div>
              <p className='text-[rgba(131,131,131,1)] text-[10px] sm:text-[11px] font-lato'>Your email address</p>
            </div>
            <button
              type='button'
              title='Subscribe'
              aria-label='Subscribe'
              className='bg-[rgba(245,62,50,1)] px-4 h-10 font-quicksand text-[10px] sm:text-[11px] border-0 rounded-full mr-2 text-white'
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Man image on right, hidden on very small screens */}
        <div className='hidden sm:block absolute right-2 sm:right-4 bottom-0'>
          <img src="static/man.png" className='w-32 sm:w-40 md:w-52 lg:w-64 h-auto' alt="Delivery man" />
        </div>
      </div>
    </div>
  )
}

export default Static2

