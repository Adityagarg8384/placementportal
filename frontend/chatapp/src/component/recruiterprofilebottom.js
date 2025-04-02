import React, { useState, useEffect } from 'react';
import ProfilePagePost from './profilepagepost'; 
import { useRouter } from 'next/router';
import { useFileContext } from '@/context/Auth';

const RecruiterProfileBottom = () => {
  const router = useRouter();
  const { user, post, updatePost } = useFileContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (user && user?.post && user?.post?.length > 0) {
        try {
          const responses = await Promise.all(
            user?.post?.map(id => fetch(`http://localhost:3000/getpost/${id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            }))
          );



          const results = await Promise.all(
            responses?.map(response => response?.ok ? response.json() : Promise.reject("Failed to fetch"))
          );
          setData(results);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching posts:", error);
          setError("Error fetching user posts");
          setLoading(false);
        }
      }
    };

    if (user) {
      fetchPosts();
    }
  }, [user]);

  const handleClick = (id, company) => {
    if (id) {
      updatePost(company)
      router.push(`/recruiterpost/${id}`);
    }
  };

  return (
    <div className="flex flex-row justify-center items-center w-full">
      <div className="flex flex-col justify-center items-center w-6/12">
        <div
          className="flex flex-wrap sm:flex-row justify-center items-center w-full max-w-3xl mx-auto ml-4 sm:ml-1 mt-4 p-2"
          style={{ backgroundColor: '#1d1e20' }}
        >
          <div className="w-full sm:w-1/3 px-2 py-1 sm:px-4 sm:py-2 text-white">
            <button
              className="w-full text-center sm:text-left text-white"
              disabled
            >
              Posts
            </button>
          </div>
        </div>

        <div className="flex flex-col ml-4 sm:ml-1 items-start justify-start w-full max-w-3xl mb-8 mx-auto mt-4 p-4 sm:p-2 bg-gray-100 rounded-lg shadow-lg">
          <div className="w-full">
           

            <div className="profile-friend-container overflow-y-auto max-h-80 w-full">
              {loading && <p>Loading...</p>}
              {error && <p>{error}</p>}
              {data && data?.map((post) => (
                  <div
                    key={post?._id}
                    onClick={() => handleClick(post?._id, post)}
                    className={`cursor-pointer flex flex-row items-center p-2 hover:bg-[#303135] mt-1 mb-1 `}
                    style={{ backgroundColor: '#1d1e20' }}
                  >
                    <img
                      src={post?.image} 
                      alt="Post Image"
                      className="w-6 h-6 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-lg"
                    />
                    <h3 className='text-white sm:text-base sm:text-xl ml-2 font-base'>{post?.creatername}</h3>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default RecruiterProfileBottom;
