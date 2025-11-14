
import React from 'react'

function IconCard() {
     

  const icons = Array.from({ length: 5 })

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 px-4 sm:px-6'>
      {icons.map((_, i) => (
      <img key={i} src={`/icon/f${i+1}.png`} alt="" />
      ))}
      
    </div>
  )
}

export default IconCard
