import React, { useEffect } from 'react'
import { Pagedetailsright } from './pagedetailsright'
import { useState } from 'react';
import { useFileContext } from "@/context/Auth";
import toast, { Toaster } from 'react-hot-toast';

export const Pagedetails = ({ postid }) => {

    const [data, setData] = useState();
    const { post, updatePost } = useFileContext();

    useEffect(() => {
        const m = async (req, res) => {
            try {
                const response = await fetch(`https://placementportal-hhm9.onrender.com/getpost/${postid}`, {
                    method: "GET",
                    withCredentials: true,
                })
                const res = await response.json();

                setData(res);
                localStorage.setItem("post-data", JSON.stringify(res))
                updatePost(newPostData);
            }
            catch (err) {
            }
        }
        if (postid) {
            m();
        }

    }, [postid]);
    return (
        <div className='flex flex-col bg-gray-100 justify-center items-center mb-20 ml-4 sm:ml-1 w-full sm:w-5/6'>
            <div className="flex  justify-start items-center border border-gray-200 w-11/12 mt-10">
                <p className="p-4 text-black font-bold">{data?.creatername} | {data?.Role}</p>
            </div>
            <div className="flex flex-col sm:flex-row w-11/12 justify-start items-start  mt-0 border border-gray-300 h-full">
                <div className="flex flex-col w-full sm:w-8/12">
                    <div className=" flex items-center w-full h-28 bg-orange-500">
                        <div className=" ">
                            <img src={data?.image} alt="Company Logo" className="w-28 h-28 p-1" />
                        </div>
                    </div>

                    <div className='text-3xl font-medium text-gray-600 ml-10 mt-10'>
                        <h2>{data?.Role} -{data?.creatername}</h2> 
                    </div>

                    <div className='flex w-full mt-2 mb-10 justify-center'>
                        <div className="bg-gray-400 h-px w-11/12"></div>
                    </div>

                    <div className='text-lg font-medium text-gray-600 ml-10'>
                        <h2>Opening Overview</h2> 
                    </div>

                    <div className='flex w-full mt-2 mb-2 justify-center'>
                        <div className="bg-gray-400 h-px w-11/12 ml-4"></div>
                    </div>

                    <div className='text-lg font-medium text-gray-600 flex ml-10 w-full justify-start flex-row'>
                        <p className="w-2/4">Place of posting</p> 
                        {data?.placeofposting ? <p className="w-2/3">{data?.placeofposting}</p> : <p className="w-2/3">None</p>}
                    </div>

                    <div className='flex w-full mt-2 mb-2 justify-center'>
                        <div className="bg-gray-400 h-px w-11/12 ml-4"></div>
                    </div>

                    <div className='text-lg font-medium text-gray-600 flex ml-10 w-full justify-start flex-row'>
                        <p className="w-2/4">Batch</p>
                        <div className="w-2/3">
                            {data?.batch && data?.batch?.length > 0 ? (
                                data?.batch.map((batchItem, index) => (
                                    <p key={index}>{batchItem}</p> 
                                ))
                            ) : (
                                <p>None</p>
                            )}
                        </div>
                    </div>

                    <div className='flex w-full mt-2 mb-2 justify-center'>
                        <div className="bg-gray-400 h-px w-11/12 ml-4"></div>
                    </div>

                    <div className='text-lg font-medium text-gray-600 flex ml-10 w-full justify-start flex-row'>
                        <p className="w-2/4">CTC/Stipend</p> 
                        {data?.Ctc ? <p className="w-2/3">{data?.Ctc}</p> : <p className="w-2/3">None</p>}
                    </div>

                    <div className='flex w-full mt-2 mb-2 justify-center'>
                        <div className="bg-gray-400 h-px w-11/12 ml-4"></div>
                    </div>

                    <div className='text-lg font-medium text-gray-600 flex ml-10 w-full justify-start flex-row'>
                        <p className="w-2/4">CGPA</p> 
                        {data?.CGPA ? <p className="w-2/3">{data?.CGPA}</p> : <p className="w-2/3">0.0</p>}
                    </div>

                    <div className='flex w-full mt-2 mb-2 justify-center'>
                        <div className="bg-gray-400 h-px w-11/12 ml-4"></div>
                    </div>

                    <div className='text-lg font-medium text-gray-600 flex ml-10 w-full justify-start flex-row'>
                        <p className="w-2/4">Category</p>
                        {data?.category ? <p className="w-2/3">{data?.category}</p> : <p className="w-2/3">None</p>}
                    </div>

                    <div className='flex w-full mt-2 mb-2 justify-center'>
                        <div className="bg-gray-400 h-px w-11/12 ml-4"></div>
                    </div>

                    <div className='text-lg font-medium text-gray-600 flex ml-10 w-full justify-start flex-row'>
                        <p className="w-2/4">Backlogs</p> 
                        {data?.Backlogs ? <p className="w-2/3">{data?.Backlogs}</p> : <p className="w-2/3">0</p>}
                    </div>

                    <div className='flex w-full mt-2 mb-2 justify-center'>
                        <div className="bg-gray-400 h-px w-11/12 ml-4"></div>
                    </div>

                    <div className='text-lg font-medium text-gray-600 flex ml-10 w-full justify-start flex-row'>
                        <p className="w-2/4">Branch</p>
                        <div className="w-2/3">
                            {data?.Branch && data?.Branch?.length > 0 ? (
                                data?.Branch?.map((branchItem, index) => (
                                    <p key={index}>{branchItem}</p> 
                                ))
                            ) : (
                                <p>None</p>
                            )}
                        </div>
                    </div>
                    <div className='flex w-full mt-2 mb-2 justify-center'>
                        <div className="bg-gray-400 h-px w-11/12 ml-4"></div>
                    </div>
                    <div className='text-lg font-medium text-gray-600 flex ml-10 w-full justify-start flex-row'>
                        <p className="w-2/4">Registration date</p>
                        <p className="w-2/3">
                            {data?.Registrationdate ?
                                new Date(data?.Registrationdate).toLocaleDateString() 
                                :
                                '0'
                            }
                        </p>
                    </div>
                    <div className='flex w-full mt-2 mb-2 justify-center'>
                        <div className="bg-gray-400 h-px w-11/12 ml-4"></div>
                    </div>

                    <div className='text-lg font-medium text-gray-600 flex ml-10 mb-14 w-full justify-start flex-col'>
                        <p className="w-full">Job Description</p> 
                        {data?.Jobdescription ? (
                            <p className="w-2/3 flex-wrap break-words overflow-hidden">
                                {data?.Jobdescription}
                            </p>
                        ) : (
                            <p className="w-2/3">0</p>
                        )}
                    </div>
                </div>
                <div className='w-full sm:w-4/12'>
                    <Pagedetailsright postid={postid} postdata={data} />
                </div>
            </div>
        </div>
    )
}  