import React, { useState, useEffect } from 'react';

const ProfilePageFriend = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null); // Add error state

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("https://placementportal-hhm9.onrender.com/getuser", {
                    method: "GET",
                    credentials: "include",
                });

                if (!response?.ok) {
                    throw new Error("Network response was not ok");
                }

                const res = await response.json();
                setData(res?.body);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Error fetching data");
                setLoading(false);
            }
        };

        fetchUserData();
    }, []); 
    
    return (
        <div className="profile-friend-container overflow-y-auto max-h-80 w-full">
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {data && data?.map((item) => (
                <div
                    key={item?._id}
                    className={`cursor-pointer flex flex-row items-center p-4 hover:bg-[#303135] mt-2 mb-2 `}
                    style={{backgroundColor: '#1d1e20'}}
                >
                    <img
                        src={item?.profilepic}
                        alt="User Image"
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
                    />
                    <h3 className='text-white ml-4 font-base'>{item?.username}</h3>
                </div>
            ))}
        </div>
    );
};

export default ProfilePageFriend;
