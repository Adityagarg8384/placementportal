import React, { useEffect, useState } from 'react'
import { Backdrop } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useFileContext } from '@/context/Auth';
import PhoneInput from "react-phone-input-2";

const Recruiterprofile = () => {
    const { user, updateUser } = useFileContext();
    const [loading, setLoading] = useState(false);
    const [uploadstate, setUploadstate] = useState(false);
    const [showFullText, setShowFullText] = useState(false);

    const [data, setData] = useState({
        Age: "",
        dob: "",
        gender: "",
        position: "",
        companyname: "",
        emailid: "",
        phonenumber: "",
        about: "",

    })

    const toggleTextVisibility = () => {
        setShowFullText(!showFullText);
    };

    const toggleupload = async () => {
        if (uploadstate == true) {
            try {
                setLoading(true);
                const response = await fetch(`https://placementportal-hhm9.onrender.com/updaterecruiter/${user?._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(data)
                })

                const res = await response.json();
                updateUser(res?.data);
                setUploadstate(true);
            }
            catch (err) {
                console.log("Some error occurred ", err);
            }
            finally {
                setLoading(false);
            }
        }

        setUploadstate(prevstate => !prevstate)
    }

    useEffect(() => {
        setData({
            Age: user?.Age || "",
            position: user?.Position || "",
            dob: user?.dob || "",
            gender: user?.gender || "",
            companyname: user?.companyname || "",
            emailid: user?.emailid || "",
            phonenumber: user?.phonenumber || "",
            about: user?.about || "",
        })
    }, [user]);
    
    return (
        <div className='flex flex-col w-full'>
            {loading ?
                <Backdrop className="" open={open}>
                    <CircularProgress color="inherit" />
                </Backdrop> : <></>
            }
            <div className="flex flex-col items-center m ">
                <h2 className="mt-4 text-xl font-semibold text-gray">{user ? user?.username : "Loading"}</h2>
                <div className="flex flex-col sm:flex-row justify-between ml-8 sm:ml-4 space-y-5 sm:space-y-0 sm:space-x-8 w-full mb-5">
                    <div className="flex flex-col sm:flex-row items-start w-full sm:w-1/2">
                        <h3
                            className="text-xl font-semibold w-full sm:w-2/5 p-1"
                            style={{ color: "#2c2c2c" }}
                        >
                            Age
                        </h3>
                        <div className="p-1 w-full sm:w-3/5 flex justify-center items-center">
                            {uploadstate === false ? (
                                <p
                                    className="text-base break-words w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                                    style={{ color: "#6e6e6e" }}
                                >
                                    {data?.Age ? data?.Age : "None"}
                                </p>
                            ) : (
                                <input
                                    type="number"
                                    className="text-base text-gray-900 break-words w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out"
                                    min="1"
                                    max="100"
                                    step="1"
                                    value={data?.Age}
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value);
                                        if (!isNaN(value) && value >= 1 && value <= 100) {
                                            setData((prevData) => ({ ...prevData, Age: e.target.value }));
                                        } else {
                                            setData((prevData) => ({ ...prevData, Age: "" }));
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start w-full sm:w-1/2">
                        <h3
                            className="text-xl font-semibold w-full sm:w-2/5 p-1"
                            style={{ color: "#2c2c2c" }}
                        >
                            Position
                        </h3>
                        <div className="p-1 w-full sm:w-3/5 flex justify-center items-center">
                            {uploadstate === false ? (
                                <p
                                    className="text-base break-words w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                                    style={{ color: "#6e6e6e" }}
                                >
                                    {data?.position ? data?.position : "None"}
                                </p>
                            ) : (
                                <input
                                    type="text"
                                    className="text-base text-gray-900 break-words w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out"
                                    value={data?.position}
                                    onChange={(e) =>
                                        setData((prevData) => ({ ...prevData, position: e.target.value }))
                                    }
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between ml-8 sm:ml-4 space-y-5 sm:space-y-0 sm:space-x-8 w-full mb-5">
                    <div className="flex flex-col sm:flex-row items-start w-full sm:w-1/2">
                        <h3
                            className="text-xl font-semibold p-1 w-full sm:w-2/5"
                            style={{ color: "#2c2c2c" }}
                        >
                            Date of Birth
                        </h3>
                        <div className="p-1 w-full sm:w-3/5 flex justify-center items-center">
                            {uploadstate === false ? (
                                <p
                                    className="text-base break-words w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                                    style={{ color: "#6e6e6e" }}
                                >
                                    {data?.dob ? data?.dob : "None"}
                                </p>
                            ) : (
                                <input
                                    type="date"
                                    className="text-base text-gray-900 break-words w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out"
                                    value={data?.dob}
                                    onChange={(e) =>
                                        setData((prevData) => ({ ...prevData, dob: e.target.value }))
                                    }
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start w-full sm:w-1/2">
                        <h3
                            className="text-xl font-semibold p-1 w-full sm:w-2/5"
                            style={{ color: "#2c2c2c" }}
                        >
                            Gender
                        </h3>
                        <div className="p-1 w-full sm:w-3/5 flex justify-center items-center">
                            {uploadstate === false ? (
                                <p
                                    className="text-base break-words w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                                    style={{ color: "#6e6e6e" }}
                                >
                                    {data?.gender ? data?.gender : "None"}
                                </p>
                            ) : (
                                <select
                                    className="text-base text-gray-900 break-words w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out"
                                    value={data?.gender}
                                    onChange={(e) =>
                                        setData((prevData) => ({ ...prevData, gender: e.target.value }))
                                    }
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col ml-8 sm:ml-4 sm:flex-row items-start w-full mb-5">
                    <h3
                        className="text-xl font-semibold p-1 w-full sm:w-1/5"
                        style={{ color: "#2c2c2c" }}
                    >
                        Company Name
                    </h3>
                    <div className="p-1 w-full sm:w-4/5 flex justify-center items-center">
                        {uploadstate === false ? (
                            <p
                                className="text-base break-words w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                                style={{ color: "#6e6e6e" }}
                            >
                                {data?.companyname ? data?.companyname : "None"}
                            </p>
                        ) : (
                            <input
                                type="text"
                                className="text-base text-gray-900 break-words w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm 
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out"
                                value={data?.companyname}
                                onChange={(e) =>
                                    setData((prevData) => ({ ...prevData, companyname: e.target.value }))
                                }
                            />
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row ml-8 sm:ml-4 items-start w-full mb-5">
                    <h3 className="text-xl font-semibold p-1 w-full sm:w-1/5" style={{ color: "#2c2c2c" }}>Email id</h3>
                    <div className="p-1 w-full sm:w-4/5 flex justify-center items-center">
                        {uploadstate === false ? (
                            <p className="text-base break-words w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" style={{ color: "#6e6e6e" }}>{(data?.emailid ? data?.emailid : "None")}</p>
                        ) : (
                            <input
                                type="text"
                                className="text-base text-gray-900 break-words w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm 
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out"
                                value={data?.emailid}
                                onChange={(e) => setData(prevData => ({ ...prevData, emailid: e.target.value }))}
                            />
                        )}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row ml-8 sm:ml-4 items-start w-full mb-5">
                    <h3 className="text-xl font-semibold p-1 w-full sm:w-1/5" style={{ color: "#2c2c2c" }}>Phone Number</h3>
                    <div className="p-1 w-full sm:w-4/5 flex justify-center items-center">
                        {uploadstate === false ? (
                            <p className="text-base break-words w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" style={{ color: "#6e6e6e" }}>{(data?.phonenumber ? data?.phonenumber : "None")}</p>
                        ) : (
                            <PhoneInput
                                country={"in"}
                                className="text-base text-gray-900 break-words w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm 
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out"
                                value={data?.phonenumber}
                                onChange={(value) => setData(prevData => ({ ...prevData, phonenumber: value }))}
                            />
                        )}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row ml-8 sm:ml-4 items-start w-full mb-5">
                    <h3 className="text-xl font-semibold p-1 w-full sm:w-1/5" style={{ color: "#2c2c2c" }}>About You</h3>
                    <div className="p-1 w-full sm:w-4/5 flex justify-center items-center">
                        {uploadstate === false ? (
                            <p
                                className={`text-base break-words w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm ${showFullText ? '' : 'line-clamp-3'}`}
                                style={{ color: "#6e6e6e" }}
                                onClick={toggleTextVisibility}
                            >
                                {data?.about}
                            </p>
                        ) : (
                            <div className="w-full">
                                <textarea
                                    className="text-base text-gray-900 break-words w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm 
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out"
                                    value={data?.about}
                                    onChange={(e) => setData(prevData => ({ ...prevData, about: e.target.value }))}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <button
                    className="bg-red-500 text-white font-semibold ml-4 sm:ml-4 py-2 px-4 rounded hover:bg-red-600 w-full sm:w-3/5 mx-auto sm:mx-0"
                    onClick={toggleupload}
                >
                    {uploadstate ? "Save" : "Update Profile"}
                </button>
            </div>

        </div >
    )
}

export default Recruiterprofile;
