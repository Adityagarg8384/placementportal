import React, { useState } from 'react'
import Component2 from '@/component/component2';
import Component3 from '@/component/component3';
import { FaArrowLeft } from 'react-icons/fa'; 

const Chat = () => {
  const [showComponent2, setShowComponent2] = useState(false);

  const toggleComponent2 = () => {
    setShowComponent2(!showComponent2);
  };

  return (
    <div className="flex flex-row  h-screen">
      <button
        className={`sm:hidden absolute ml-4 top-4 left-4 p-4 bg-gray-800 text-white rounded-md shadow-md ${showComponent2 ? 'hidden' : 'block'}`}
        onClick={toggleComponent2}
      >
        <FaArrowLeft className="w-4 h-4" />
      </button>
      <div className={`${showComponent2 ? 'flex' : 'hidden'
        } sm:flex flex-grow sm:w-1/3 w-full bg-gray-100 flex-shrink-0`}>
        <Component2 showComponent2={showComponent2} setShowComponent2={setShowComponent2} />

      </div>
      <div className={`${showComponent2 ? 'hidden' : 'flex'
        } sm:flex flex-grow sm:w-2/3 w-full bg-gray-200 flex-shrink-0`}>
        <Component3 />
      </div>
    </div>
  )
}

export default Chat;
