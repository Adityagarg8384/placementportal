import React, { useEffect, useState } from 'react';
import { useConversation } from "../zustand/Conversation";
import toast, { Toaster } from 'react-hot-toast';
import { CiSearch } from "react-icons/ci";
import { useFileContext } from '@/context/Auth';
import Recruiterdata from './recruiterdata';


const Component2 = ({ showComponent2, setShowComponent2 }) => {
    const { user, role } = useFileContext();
    const { selectedConversation, setSelectedConversation } = useConversation();
    const [data, setData] = useState([]);
    const [recruiterdata, setRecruiterData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchval, setSearchVal] = useState("");
    const [showRecruiters, setShowRecruiters] = useState(false); // Toggle state

    useEffect(() => {
        // console.log(user);
        const fetchUserData = async () => {
            try {
                const response = await fetch("http://localhost:3000/getalluser", {
                    method: "GET",
                    credentials: "include",
                });

                if (!response?.ok) {
                    throw new Error("Network response was not ok");
                }

                const res = await response.json();
                console.log("Users are ", res.body)
                setData(res.body);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setError("Error fetching data");
                setLoading(false);
            }
        };

        const fetchRecruiterDate = async () => {
            try {
                const response = await fetch("http://localhost:3000/getrecruiter", {
                    method: "GET",
                    credentials: "include",
                });

                if (!response?.ok) {
                    throw new Error("Network response was not ok");
                }

                const res = await response.json();


                setRecruiterData(res.body);
                setLoading(false);
            }
            catch (error) {
                setError("");
                setLoading(false);
            }
        }

        fetchRecruiterDate();
        fetchUserData();
    }, [searchval]);

    const handlesearch = (e) => {
        e.preventDefault();

        if (!searchval) {
            return;
        }

        if (searchval.length < 3) {
            return toast.error("Length should be greater than 3");
        }

        const findata = data?.filter((c) => c?.fullname.toLowerCase().includes(searchval.toLowerCase()));
        if (findata?.length > 0) {
            setData(findata);
        } else {
            toast.error("No such user found");
        }
    };

    if (loading) {
        return <p className='text-black ml-4'>Loading...</p>;
    }

    // if (error) {
    //     return <p className='text-black ml-4'>{error}</p>;
    // }

    return (
        <div className='flex flex-col ml-6 w-full h-full'>
            <Toaster />
            <div className='flex flex-col justify-between w-auto items-centers bg-[#424449] h-1/6 p-4'>
                <div >
                    <h1 className='text-white text-2xl'>Chat</h1>
                </div>
                <form onSubmit={handlesearch} className="flex items-center">
                    <input
                        placeholder='Search'
                        className='bg-[#1d1e20] border-white border-2 rounded-full w-4/6 text-white pl-4 pr-10 h-10'
                        value={searchval}
                        onChange={(e) => setSearchVal(e.target.value)}
                    />
                    <button type="submit" className="ml-2">
                        <CiSearch className='text-white h-6 w-6' />
                    </button>
                </form>
            </div>
            <div className='flex-grow overflow-auto'>
                <div className={`flex flex-col bg-[#1d1e20] p-4 h-full`}>

                    {/* Toggle Button */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className='text-white text-lg font-semibold'>
                            {showRecruiters ? "Recruiters" : "Candidates"}
                        </h2>
                        {role == "student" ?
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                                onClick={() => setShowRecruiters(!showRecruiters)}
                            >
                                {showRecruiters ? "Show Candidates" : "Show Recruiters"}
                            </button> :
                            <></>
                            // <button
                            //     className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                            //     onClick={() => setShowRecruiters(!showRecruiters)}
                            // >
                            //     {showRecruiters ? "Show Users" : "Show Recruiters"}
                            // </button>
                        }

                    </div>

                    {/* List Rendering */}
                    <div className='overflow-y-auto'>
                        {(showRecruiters ? recruiterdata : data)
                            ?.filter(item => item?._id !== user?._id)
                            .map((item) => (
                                <div
                                    key={item?._id}
                                    className={`cursor-pointer flex flex-row items-center p-4 rounded-lg hover:bg-[#303135] mt-2 mb-2 
      ${(selectedConversation && selectedConversation?._id === item?._id) ? 'bg-blue-600' : 'bg-[#1d1e20]'}`}
                                    onClick={() => { setSelectedConversation(item); }}
                                >
                                    <img
                                        src={item?.profilepic}
                                        alt="User Image"
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                                    />
                                    <h3 className='text-white ml-4 font-medium'>{item?.username}</h3>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Component2;
