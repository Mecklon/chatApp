import React from 'react'
import Image from '../hooks/Image'

function Multimedia({media}) {
  return (
    <div className='flex flex-col gap-2 cursor-pointer'>
        {media.map(m=>{
            return <Image className='w-full rounded' key={m.fileName} path={m.fileName}/>
        })}
    </div>
  )
}

export default Multimedia
