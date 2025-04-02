import React from 'react'
import Link from 'next/link'
import Component1 from './component1'
import Component2 from './component2'
import Component3 from './component3'

const Main = () => {
  

  return (
    <div className='flex flex-row h-screen w-screen' style={{ backgroundColor: '#121317' }}>

      <Component1/>

      <Component2/>

      <Component3/>
      
    </div>
  )
}

export default Main;
