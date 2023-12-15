import React, { useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function Banner() {

  const data = [
    "https://scontent.fhan4-3.fna.fbcdn.net/v/t39.30808-6/280670405_5788330661182662_3185354043905022716_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=783fdb&_nc_ohc=BMK6NnRcyXwAX_3ljXz&_nc_ht=scontent.fhan4-3.fna&oh=00_AfDbwaTiOJ5twebBIOPO42emr95ptvHmzcWQby3l9vP3_A&oe=657EEC34",
    "https://scontent.fhan3-4.fna.fbcdn.net/v/t39.30808-6/294710245_5999307913418268_5118831930447202438_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=783fdb&_nc_ohc=rFAyr_zoOmgAX8OzRng&_nc_ht=scontent.fhan3-4.fna&oh=00_AfB0GblZfAocYF7il8gI_p-p6k3DSdbT9ohMpNNwYQweCA&oe=657E575D",
    "https://scontent.fhan3-3.fna.fbcdn.net/v/t39.30808-6/171149302_4788678894481182_4510621756728186837_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=783fdb&_nc_ohc=jcaD-m4Fo8cAX_SklOl&_nc_ht=scontent.fhan3-3.fna&oh=00_AfBVYCBJmPggWaRMpPBNZK7nrIEMYavs6dPQ2z0Jb7R9WQ&oe=657D9E4D",
    "https://scontent.fhan4-3.fna.fbcdn.net/v/t1.6435-9/151213230_4348067515208991_6457828160166602539_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=300f58&_nc_ohc=Hr3ZvVVBQTcAX_EXh7f&_nc_ht=scontent.fhan4-3.fna&oh=00_AfCTY1vGcUm4aGSMIw85utY12i4wM7lEmqZwVswX1Hg4tw&oe=65A09E43",
  ]

  const [currSlide, setCurrSlide] = useState(0)

  const prevSlide = () => {
    setCurrSlide(currSlide === 0 ? 3 : currSlide - 1)
  }

  const nextSlide = () => {
    setCurrSlide(currSlide === 3 ? 0 : currSlide + 1)
  }

  return (
    <div className='w-full h-auto overflow-x-hidden bottom-5'>
      <div className='w-screen'>
        <div style={{ transform: `translate(-${currSlide * 100}vw)` }}
          className='w-[400vw] h-full flex transition-transform duration-1000'>
          <img className='w-screen h-full object-cover' src={data[0]} alt='' />
          <img className='w-screen h-full object-cover' src={data[1]} alt='' />
          <img className='w-screen h-full object-cover' src={data[2]} alt='' />
          <img className='w-screen h-full object-cover' src={data[3]} alt='' />
          {/* <img
            className='w-screen h-[730px] object-cover object-center' // Adjust the height value as needed
            loading='priority'
            src={data[3]}
            alt=''
          /> */}
        </div>
        <div className='absolute bottom-40 left-0 right-0 w-fit mx-auto flex gap-8  '>
          <div onClick={prevSlide} className='w-14 h-12 border-[1px] border-gray-700 flex items-center justify-center
          hover:cursor-pointer hover:bg-gray-500 hover:text-white active:bg-gray-900 duration-300'>
            <ArrowBackIcon />
          </div>
          <div onClick={nextSlide} className='w-14 h-12 border-[1px] border-gray-700 flex items-center justify-center
          hover:cursor-pointer hover:bg-gray-500 hover:text-white active:bg-gray-900 duration-300'>
            <ArrowForwardIcon />
          </div>
        </div>

      </div>
    </div>
  )
}
export default Banner;