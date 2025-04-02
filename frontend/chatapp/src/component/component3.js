import React from 'react';
import { useFileContext } from '@/context/Auth';
import { useConversation } from "../zustand/Conversation";
import Component3part2part1 from './component3part2part1';
import Component3part2part2 from './component3part2part2';
import Link from 'next/link';

const Component3 = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { user } = useFileContext();

  return (
    <div className='flex flex-col h-full' style={{ flexGrow: '100' }}>
      <div className='flex flex-row justify-end sm:justify-between h-20 bg-[#4a4b4d] items-center' >
        {selectedConversation === null ?
          <h className='text-white ml-4 font-base'></h> :
          <div className='flex items-center'>
            <img
              src={selectedConversation?.profilepic}
              alt="User Image"
              className="w-12 h-12 mr-4 sm:ml-4 rounded-full object-cover border-2 border-white shadow-lg"
            />
            <h className='text-white mr-4 sm:ml-4 font-base'>{selectedConversation?.username}</h>
          </div>
        }

        <div>
          {user && (
            <div className=' flex-row justify-between items-center mr-4 hidden sm:flex'>
             
                <h className='text-white mr-2 font-base'>{user?.username}</h>
              <Link href="/profile" passHref>
              <img
                src={user?.profilepic}
                alt="User Image"
                className="w-12 h-12 ml-4 rounded-full object-cover border-2 border-white shadow-lg"
              />
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className='flex flex-grow '>
        {selectedConversation === null ?
          <Component3part2part1 /> :
          <Component3part2part2 />
        }
      </div>
    </div>
  );
};

export default Component3;
