import React from 'react'

function Footer() {
  return (
    <div className='bg-[#f7f7f7] mt-10 py-8 sm:py-10 px-4 sm:px-6 lg:px-10 flex relative justify-center items-center overflow-hidden'>
      <div className='w-full max-w-[900px]'>
        <img src="/footer.png" alt="Footer" className='w-full h-auto' />
      </div>
      {/* Decorative icons – hidden on very small screens to avoid overlap */}
      <div className='hidden sm:block absolute w-10 sm:w-12 top-4 left-2'><img src="/icon1.png" alt="Decorative icon" /></div>
      <div className='hidden sm:block absolute w-10 sm:w-12 right-4 top-0'><img src="/icon2.png" alt="Decorative icon" /></div>
    </div>
  )
}

export default Footer
