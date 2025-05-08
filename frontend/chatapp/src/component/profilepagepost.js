import React, { useState, useEffect } from 'react';
import { useFileContext } from '@/context/Auth';

const ProfilePagePost = () => {
    const { user } = useFileContext();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await fetch(`https://placementportal-hhm9.onrender.com/getuserpost/${user?._id}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response?.ok) {
                    throw new Error("Network response was not ok");
                }

                const res = await response.json();
                setPosts(res?.posts);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user posts:", error);
                setError("Error fetching user posts");
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, []); 

    return (
        <div className="profile-friend-container overflow-y-auto max-h-80 w-full">
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {posts && posts?.map((post) => (
                <div
                    key={post?._id}
                    className={`cursor-pointer flex flex-row items-center p-4 hover:bg-[#303135] mt-2 mb-2 `}
                    style={{ backgroundColor: '#1d1e20' }}
                >
                    <img
                        src={post?.image} 
                        alt="Post Image"
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
                    />
                    <h3 className='text-white ml-4 font-base'>{post?.message}</h3>
                </div>
            ))}
        </div>
    );
};

export default ProfilePagePost;
