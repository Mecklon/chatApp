import React from 'react'
import Contacts from './Contacts'
import Header from './Header'
function Home() {
  return (
    <div className='px-30 bg-amber-300 w-full h-screen grid p-1 grid-cols-[320px_1fr_370px] grid-rows-[60px_1fr] gap-1 [grid-template-areas:"header_header_header""sideBar_main_info"]
    '>
      <Header/>
 
      <Contacts/>
      <div className='bg-amber-950 [grid-area:main]'></div>
      <div className='bg-amber-950 [grid-area:info]'></div>
    </div>
  )
}

export default Home
