import React, { useState } from 'react';
import ProfilePageFriend from './profilepagefriend'; 

const StudentProfileBottom = () => {
  const [displayState, setDisplayState] = useState(0);

  return (
    <div>
      <div
        className="flex flex-row justify-around items-center w-full max-w-3xl ml-4 sm:mx-auto mt-4"
        style={{ backgroundColor: '#1d1e20' }}
      >
        {['Friends', 'Jobs Applied'].map((label, index) => (
          <div
            key={index}
            className={`w-1/2 px-4 py-2 ${displayState === index ? 'bg-blue-500 text-white' : 'text-white'}`}
          >
            <button
              onClick={() => setDisplayState(index)}
              className={`w-full text-left ${displayState === index ? 'bg-blue-500 text-white' : 'text-white'}`}
            >
              {label}
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-start justify-start w-full max-w-3xl mb-8 ml-4 sm:mx-auto mt-4 p-6 bg-gray-100 rounded-lg shadow-lg">
        {displayState === 0 && (
          <div className="w-full">
            <h3 className="text-xl font-semibold text-gray-900">Friends</h3>
            <ProfilePageFriend />
          </div>
        )}
        {displayState === 1 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Jobs Applied</h3>
            <p className="text-gray-700">This is the jobs applied section. Display jobs the user has applied for here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfileBottom;
