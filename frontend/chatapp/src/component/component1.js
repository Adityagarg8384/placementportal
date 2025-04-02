import React from 'react';
import Link from 'next/link';
import { useFileContext } from '@/context/Auth';
import toast, { Toaster } from 'react-hot-toast';


const Logout = async (username, updateUser) => {
  try {

    const response = await fetch("http://localhost:3000/logout", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: "include"
    });

    if (!response?.ok) {
      throw new Error(`Logout failed: ${response?.status}`);
    }

    const data = await response.json();

    localStorage.removeItem("user-chat");
    updateUser(null);
    
    window.location.reload();
  } catch (err) {
    alert("An error occurred while logging out. Please try again.");
  }
};

const Component1 = () => {
  const { user, updateUser } = useFileContext();

  return (
    <div className='flex flex-col justify-between w-12 ml-8 mt-4 mb-4 p-2 rounded-lg' style={{ backgroundColor: '#1d1e20' }}>
      <div className='mt-6' style={{ height: '30px', width: '30px', backgroundColor: '#1d1e20' }}>
        <img src="meetme.png" alt="Logo" />
      </div>

      <div>
        <div className='mb-6' style={{ height: '30px', width: '30px', backgroundColor: '#1d1e20' }}>
          <Link href="/login" passHref>
            <div>
              <img src="/icons8-user-50.png" alt="User Icon" />
              {/* <span className='text-white'>{user?.fullname}</span> */}
            </div>
          </Link>
        </div>

        <div className='mb-6 cursor-pointer' style={{ height: '30px', width: '30px', backgroundColor: '#1d1e20' }}>
          <img 
            src="/logout (1).png" 
            alt="Logout Icon" 
            onClick={() => {
              if (user) {
                Logout(user, updateUser);
              } else {
                alert("No user logged in.");
              }
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default Component1;
