import React, { useEffect } from 'react'
import { useState } from 'react';
import PhoneInput from "react-phone-input-2";
import axios from 'axios';
import { useFileContext } from '@/context/Auth';
import { Backdrop } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { FaDownload } from 'react-icons/fa';
// import toast, { Toaster } from 'react-hot-toast';
import toast, { Toaster } from 'react-hot-toast';


const ProfileDescription = () => {
    const { user, updateUser, role } = useFileContext();
    const [loading, setLoading] = useState(false)
    const [datachange, setDataChange] = useState(false);
    const [pdfexists, setPdfexists] = useState(false);
    const [shareablelink, setShareablelink] = useState("");
    const [uploadstate, setUploadstate] = useState(false);

    const [showFullText, setShowFullText] = useState(false);
    const [file, setFile] = useState(null)

    const [data, setData] = useState({
        Age: "",
        Bloodgroup: "",
        tenthpercent: "",
        twelthpercent: "",
        dob: "",
        gender: "",
        batch: "",
        branch: "",
        degree: "",
        sem1cgpa: "",
        sem2cgpa: "",
        sem3cgpa: "",
        sem4cgpa: "",
        sem5cgpa: "",
        sem6cgpa: "",
        sem7cgpa: "",
        sem8cgpa: "",
        collegename: "",
        emailid: "",
        phonenumber: "",
        about: "",
        pdfid: "",
    })

    useEffect(() => {
        if (role == "student") {
            const fetchData = async () => {
                try {
                    const getresponse = await fetch(`http://localhost:3000/getspecificuser`, {
                        method: "GET",
                        credentials: "include",
                    });
                    const res = await getresponse.json();

                    if (res?.data) {
                        updateUser(res?.data);
                        setData({
                            Age: res?.data?.Age || "",
                            Bloodgroup: res?.data?.Bloodgroup || "",
                            tenthpercent: res?.data?.tenthpercent || 0,
                            twelthpercent: res?.data?.twelthpercent || 0,
                            dob: res?.data?.dob || "",
                            gender: res?.data?.gender || "",
                            batch: res?.data?.batch || "",
                            degree: res?.data?.degree || "",
                            sem1cgpa: res?.data?.sem1cgpa || 0,
                            sem2cgpa: res?.data?.sem2cgpa || 0,
                            sem3cgpa: res?.data?.sem3cgpa || 0,
                            sem4cgpa: res?.data?.sem4cgpa || 0,
                            sem5cgpa: res?.data?.sem5cgpa || 0,
                            sem6cgpa: res?.data?.sem6cgpa || 0,
                            sem7cgpa: res?.data?.sem7cgpa || 0,
                            sem8cgpa: res?.data?.sem8cgpa || 0,
                            collegename: res?.data?.collegename || "",
                            emailid: res?.data?.emailid || "",
                            phonenumber: res?.data?.phonenumber || "",
                            about: res?.data?.about || "",
                            pdfid: res?.data?.pdfid || "",
                            branch: res.data?.branch || "",
                            aboutme: res?.data?.about || "",
                        })
                        if (res?.data?.pdfid != "" && res?.data?.pdfid != "0" && res?.data?.pdfid != null) {
                            setPdfexists(true);
                        }
                        else {
                            setPdfexists(false);
                        }
                    }

                } catch (error) {
                    console.error("Error fetching specific user:", error);
                }
            };
            fetchData();
        }
    }, [datachange]);

    useEffect(() => {
        setShareablelink(`https://drive.google.com/file/d/${data?.pdfid}/view?usp=sharing`)
    }, [shareablelink, data])

    const toggleTextVisibility = () => {
        setShowFullText(!showFullText);
    };

    const handlefilechange = (event) => {
        setFile(event.target.files[0]);
    }

    
    const deleteupload = async () => {
        if (!data?.pdfid) {
            toast.error("Cannot find the uploaded pdf")
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(`/api/deletepdf`, { id: data?.pdfid }, {
                headers: {
                    "Content-Type": "application/json",
                }
            });


            if (response?.status === 200) {

                const d = { pdfid: "0" }; 

                const rese = await fetch(`http://localhost:3000/updateuser/${user?._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(d)
                });

                if (!rese?.ok) {
                    const errorMessage = await rese?.text();
                    toast.error("Error updating user information")
                    return;
                }

                const updatedUser = await rese.json();
                console.log(updatedUser); 

                setDataChange(prevstate => !prevstate);
                toast.success("File Deleted Successfully")
            } else if (response?.status === 404) {
                toast.error("Error in deleting pdf")
            }

        } catch (err) {
            console.log("An error occurred:", err);
            toast.error("An unexpected error occurred");
        }
        finally {
            setLoading(false);
        }
    };

    const handleupload = async () => {

        if (!file) {
            toast.error("No file selected")
            return;
        }

        const formData = new FormData();

        formData.append('filename', file?.name);

        formData.append('file', file);

        try {
            setLoading(true);
            const response = await axios.post("/api/uploadpdf", formData, {
                headers: {
                    "Content-type": "multipart/form-data",
                },
                withCredentials: true,
            })
            if (response?.status == 200) {
                setShareablelink(`https://drive.google.com/file/d/${response?.data}/view?usp=sharing`)
                const d = { pdfid: response?.data }
                const rese = await fetch(`http://localhost:3000/updateuser/${user?._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(d)
                })
                setDataChange(prevstate => !prevstate);
                toast.error("Successfully added toast")
            }
            else if (response.status == 404) {
                toast.error("Error occurred in uploading resume")
            }
        }
        catch (err) {
            toast.error("Error in uploading resum ", err);
            return;
        }
        finally {
            setLoading(false);
        }
    }

    const toggleupload = async () => {
        if (uploadstate == true) {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:3000/updateuser/${user?._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(data)
                })
                updateUser(data);
                const res = await response.json();
                setDataChange(prevstate => !prevstate);
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

    const handlepdfdownload = async () => {
        try {
            const response = await axios.post(
                "/api/downloadpdf",
                { pdfid: data?.pdfid },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                    responseType: 'arraybuffer'
                }
            );

            const blob = await new Blob([response?.data], { type: 'application/pdf' });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'resume.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <div className='flex flex-col w-full'>
            {loading ?
                <Backdrop className="" open={open}>
                    <CircularProgress color="inherit" />
                </Backdrop> : <></>
            }
            <div className="flex flex-col items-center m ">
                <h2 className="mt-4 text-xl font-semibold text-gray-900">{user ? user?.username : "Loading"}</h2>
                <div className="flex flex-col sm:flex-row justify-between ml-8 sm:ml-4 space-y-5 sm:space-y-0 sm:space-x-8 w-full mb-5">
                    <div className="flex flex-col sm:flex-row items-start w-full sm:w-1/2">
                        <h3 className="text-xl font-semibold w-full sm:w-2/5 p-1 " style={{ color: "#2c2c2c" }}>Age</h3>
                        <div className="p-1 w-full sm:w-3/5 flex justify-center items-center ">
                            {uploadstate === false ? (
                                <p className="text-base break-words w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" style={{ color: "#6e6e6e" }}>{(data?.Age ? data?.Age : "None")}</p>
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
                                            setData(prevData => ({ ...prevData, Age: e.target.value }));
                                        } else {
                                            setData(prevData => ({ ...prevData, Age: '' }));
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start w-full sm:w-1/2">
                        <h3 className="text-xl font-semibold w-2/5 p-1 " style={{ color: "#2c2c2c" }}>Blood Group</h3>
                        <div className="p-1 w-full sm:w-3/5 flex justify-center items-center">
                            {uploadstate === false ? (
                                <p className="text-base break-words w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" style={{ color: "#6e6e6e" }}>{(data?.Bloodgroup ? data?.Bloodgroup : "None")}</p>
                            ) : (
                                <select
                                    className="text-base text-gray-900 break-words w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm 
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out"
                                    value={data?.Bloodgroup}
                                    onChange={(e) => setData(prevData => ({ ...prevData, Bloodgroup: e.target.value }))}
                                >
                                    <option value="">Select Blood Group</option>
                                    <option value="O+">O+</option>
                                    <option value="A+">A+</option>
                                    <option value="B+">B+</option>
                                    <option value="O-">O-</option>
                                    <option value="A-">A-</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                </select>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between ml-8 sm:ml-4 sm:space-x-8 w-full mb-5">
                    <div className="flex flex-col sm:flex-row items-start w-full sm:w-1/2">
                        <h3 className="text-xl font-semibold w-2/5 p-1 " style={{ color: "#2c2c2c" }}>Class 10%</h3>
                        <div className="p-1 w-full sm:w-3/5 flex justify-center items-center">
                            {uploadstate === false ? (
                                <p className="text-base break-words w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" style={{ color: "#6e6e6e" }}>{(data?.tenthpercent ? data?.tenthpercent : "None")}</p>
                            ) : (
                                <input
                                    type="number"
                                    className="text-base text-gray-900 break-words w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm 
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out"
                                    min="1"
                                    max="100"
                                    step="0.2"
                                    value={data?.tenthpercent}
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value);
                                        if (!isNaN(value) && value >= 1 && value <= 100) {
                                            setData(prevData => ({ ...prevData, tenthpercent: e.target.value }));
                                        } else {
                                            setData(prevData => ({ ...prevData, tenthpercent: '' }));
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start w-full sm:w-1/2 ml-0">
                        <h3
                            className="text-xl font-semibold w-2/5 p-1"
                            style={{ color: "#2c2c2c" }}
                        >
                            Class 12%
                        </h3>
                        <div className="p-1 w-full sm:w-3/5 flex justify-center items-center">
                            {uploadstate === false ? (
                                <p
                                    className="text-base break-words w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                                    style={{ color: "#6e6e6e" }}
                                >
                                    {data?.twelthpercent ? data?.twelthpercent : "None"}
                                </p>
                            ) : (
                                <input
                                    type="number"
                                    className="text-base text-gray-900 break-words w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm 
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out"
                                    min="1"
                                    max="100"
                                    step="0.2"
                                    value={data?.twelthpercent}
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value);
                                        if (!isNaN(value) && value >= 1 && value <= 100) {
                                            setData((prevData) => ({
                                                ...prevData,
                                                twelthpercent: e.target.value,
                                            }));
                                        } else {
                                            setData((prevData) => ({ ...prevData, twelthpercent: "" }));
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>

                </div>
                <div className="flex flex-col sm:flex-row justify-between ml-8 sm:ml-4 space-y-5 sm:space-y-0 sm:space-x-8 w-full mb-5">
                    <div className="flex flex-col sm:flex-row items-start w-full sm:w-1/2">
                        <h3 className="text-xl font-semibold w-2/5 p-1 " style={{ color: "#2c2c2c" }}>Date of Birth</h3>
                        <div className="p-1 w-full sm:w-3/5 flex justify-center items-center">
                            {uploadstate === false ? (
                                <p className="text-base break-words w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" style={{ color: "#6e6e6e" }}>{(data?.dob ? data?.dob : "None")}</p>
                            ) : (
                                <input
                                    type="date"
                                    className="text-base text-gray-900 break-words w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm 
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out"
                                    value={data.dob}
                                    onChange={(e) => setData(prevData => ({ ...prevData, dob: e.target.value }))}
                                />
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start w-full sm:w-1/2">
                        <h3 className="text-xl font-semibold w-2/5 p-1 " style={{ color: "#2c2c2c" }}>Gender</h3>
                        <div className="p-1 w-full sm:w-3/5 flex justify-center items-center">
                            {uploadstate === false ? (
                                <p className="text-base break-words w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" style={{ color: "#6e6e6e" }}>{(data?.gender ? data?.gender : "None")}</p>
                            ) : (
                                <select
                                    className="text-base text-gray-900 break-words w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm 
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out"
                                    value={data.gender}
                                    onChange={(e) => setData(prevData => ({ ...prevData, gender: e.target.value }))}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between ml-8 sm:ml-4 space-y-5 sm:space-y-0 sm:space-x-8 w-full mb-5">
                    <div className="flex flex-col sm:flex-row items-start w-full sm:w-1/2">
                        <h3 className="text-xl font-semibold w-2/5 p-1 " style={{ color: "#2c2c2c" }}>Batch</h3>
                        <div className="rounded-lg p-1 w-full sm:w-3/5 flex justify-center items-center">
                            {uploadstate === false ? (
                                <p className="text-base break-words w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" style={{ color: "#6e6e6e" }}>{(data?.batch ? data?.batch : "None")}</p>
                            ) : (
                                <select
                                    className="text-base text-gray-900 break-words w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm 
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out"
                                    value={data?.batch}
                                    onChange={(e) => setData(prevData => ({ ...prevData, batch: e.target.value }))}
                                >
                                    <option value="">Select Year</option>
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                    <option value="2027">2027</option>
                                </select>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start w-full sm:w-1/2">
                        <h3 className="text-xl font-semibold w-2/5 p-1 " style={{ color: "#2c2c2c" }}>Degree</h3>
                        <div className=" p-1 w-full sm:w-3/5 flex justify-center items-center">
                            {uploadstate === false ? (
                                <p className="text-base break-words w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" style={{ color: "#6e6e6e" }}>{(data?.degree ? data?.degree : "None")}</p>
                            ) : (
                                <input
                                    type="text"
                                    className="text-base text-gray-900 break-words w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm 
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out"
                                    value={data?.degree}
                                    onChange={(e) => setData(prevData => ({ ...prevData, degree: e.target.value }))}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between ml-8 sm:ml-4 space-y-5 sm:space-y-0 sm:space-x-8 w-full mb-5">
                    <div className="flex flex-col sm:flex-row items-start w-full sm:w-1/2">
                        <h3 className="text-xl font-semibold w-2/5 p-1 " style={{ color: "#2c2c2c" }}>Sem1 Cgpa</h3>
                        <div className="p-1 w-full sm:w-3/5 flex justify-center items-center">
                            {uploadstate === false ? (
                                <p className="text-base break-words w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" style={{ color: "#6e6e6e" }}>{(data?.sem1cgpa ? data?.sem1cgpa : "None")}</p>
                            ) : (
                                <input
                                    type="number"
                                    className="text-base text-gray-900 break-words w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm 
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out"
                                    min="1"
                                    max="10"
                                    step="0.1"
                                    value={data?.sem1cgpa}
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value);
                                        if (!isNaN(value) && value >= 1 && value <= 10) {
                                            setData(prevData => ({ ...prevData, sem1cgpa: e.target.value }));
                                        } else {
                                            setData(prevData => ({ ...prevData, sem1cgpa: '' }));
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start w-full sm:w-1/2">
                        <h3 className="text-xl font-semibold w-2/5 p-1 " style={{ color: "#2c2c2c" }}>Sem2 Cgpa</h3>
                        <div className="p-1 w-full sm:w-3/5 flex justify-center items-center">
                            {uploadstate === false ? (
                                <p className="text-base break-words w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" style={{ color: "#6e6e6e" }}>{(data?.sem2cgpa ? data?.sem2cgpa : "None")}</p>
                            ) : (
                                <input
                                    type="number"
                                    className="text-base text-gray-900 break-words w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm 
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out"
                                    min="1"
                                    max="10"
                                    step="0.1"
                                    value={data?.sem2cgpa}
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value);
                                        if (!isNaN(value) && value >= 1 && value <= 10) {
                                            setData(prevData => ({ ...prevData, sem2cgpa: e.target.value }));
                                        } else {
                                            setData(prevData => ({ ...prevData, sem2cgpa: '' }));
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between ml-8 sm:ml-4 space-y-5 sm:space-y-0 sm:space-x-8 w-full mb-5">
                    <div className="flex flex-col sm:flex-row items-start w-full sm:w-1/2">
                        <h3 className="text-xl font-semibold w-2/5 p-1 " style={{ color: "#2c2c2c" }}>Sem3 Cgpa</h3>
                        <div className="p-1 w-full sm:w-3/5 flex justify-center items-center">
                            {uploadstate === false ? (
                                <p className="text-base break-words w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" style={{ color: "#6e6e6e" }}>{(data?.sem3cgpa ? data?.sem3cgpa : "None")}</p>
                            ) : (
                                <input
                                    type="number"
                                    className="text-base text-gray-900 break-words w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm 
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out"
                                    min="1"
                                    max="10"
                                    step="0.1"
                                    value={data?.sem3cgpa}
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value);
                                        if (!isNaN(value) && value >= 1 && value <= 10) {
                                            setData(prevData => ({ ...prevData, sem3cgpa: e.target.value }));
                                        } else {
                                            setData(prevData => ({ ...prevData, sem3cgpa: '' }));
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start w-full sm:w-1/2">
                        <h3 className="text-xl font-semibold w-2/5 p-1 " style={{ color: "#2c2c2c" }}>Sem4 Cgpa</h3>
                        <div className="p-1 w-full sm:w-3/5 flex justify-center items-center">
                            {uploadstate === false ? (
                                <p className="text-base break-words w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" style={{ color: "#6e6e6e" }}>{(data?.sem4cgpa ? data?.sem4cgpa : "None")}</p>
                            ) : (
                                <input
                                    type="number"
                                    className="text-base text-gray-900 break-words w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm 
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out"
                                    min="1"
                                    max="10"
                                    step="0.1"
                                    value={data?.sem4cgpa}
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value);
                                        if (!isNaN(value) && value >= 1 && value <= 10) {
                                            setData(prevData => ({ ...prevData, sem4cgpa: e.target.value }));
                                        } else {
                                            setData(prevData => ({ ...prevData, sem4cgpa: '' }));
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between ml-8 sm:ml-4 space-y-5 sm:space-y-0 sm:space-x-8 w-full mb-5">
                    <div className="flex flex-col sm:flex-row items-start w-full sm:w-1/2">
                        <h3 className="text-xl font-semibold w-2/5 p-1 " style={{ color: "#2c2c2c" }}>Sem5 Cgpa</h3>
                        <div className="p-1 w-full sm:w-3/5 flex justify-center items-center">
                            {uploadstate === false ? (
                                <p className="text-base break-words w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" style={{ color: "#6e6e6e" }}>{(data?.sem5cgpa ? data?.sem5cgpa : "None")}</p>
                            ) : (
                                <input
                                    type="number"
                                    className="text-base text-gray-900 break-words w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm 
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out"
                                    min="1"
                                    max="10"
                                    step="0.1"
                                    value={data?.sem5cgpa}
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value);
                                        if (!isNaN(value) && value >= 1 && value <= 10) {
                                            setData(prevData => ({ ...prevData, sem5cgpa: e.target.value }));
                                        } else {
                                            setData(prevData => ({ ...prevData, sem5cgpa: '' }));
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start w-full sm:w-1/2">
                        <h3 className="text-xl font-semibold w-2/5 p-1 " style={{ color: "#2c2c2c" }}>Sem6 Cgpa</h3>
                        <div className="p-1 w-full sm:w-3/5 flex justify-center items-center">
                            {uploadstate === false ? (
                                <p className="text-base break-words w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" style={{ color: "#6e6e6e" }}>{(data?.sem6cgpa ? data?.sem6cgpa : "None")}</p>
                            ) : (
                                <input
                                    type="number"
                                    className="text-base text-gray-900 break-words w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm 
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out"
                                    min="1"
                                    max="10"
                                    step="0.1"
                                    value={data?.sem6cgpa}
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value);
                                        if (!isNaN(value) && value >= 1 && value <= 10) {
                                            setData(prevData => ({ ...prevData, sem6cgpa: e.target.value }));
                                        } else {
                                            setData(prevData => ({ ...prevData, sem6cgpa: '' }));
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between ml-8 sm:ml-4 space-y-5 sm:space-y-0 sm:space-x-8 w-full mb-5">
                    <div className="flex flex-col sm:flex-row items-start w-full sm:w-1/2">
                        <h3 className="text-xl font-semibold w-2/5 p-1 " style={{ color: "#2c2c2c" }}>Sem7 Cgpa</h3>
                        <div className="p-1 w-full sm:w-3/5 flex justify-center items-center">
                            {uploadstate === false ? (
                                <p className="text-base break-words w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" style={{ color: "#6e6e6e" }}>{(data?.sem7cgpa ? data?.sem7cgpa : "None")}</p>
                            ) : (
                                <input
                                    type="number"
                                    className="text-base text-gray-900 break-words w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm 
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out"
                                    min="1"
                                    max="10"
                                    step="0.1"
                                    value={data?.sem7cgpa}
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value);
                                        if (!isNaN(value) && value >= 1 && value <= 10) {
                                            setData(prevData => ({ ...prevData, sem7cgpa: e.target.value }));
                                        } else {
                                            setData(prevData => ({ ...prevData, sem7cgpa: '' }));
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start w-full sm:w-1/2">
                        <h3 className="text-xl font-semibold w-2/5 p-1 " style={{ color: "#2c2c2c" }}>Sem8 Cgpa</h3>
                        <div className="p-1 w-3/5 flex justify-center items-center">
                            {uploadstate === false ? (
                                <p className="text-base break-words w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" style={{ color: "#6e6e6e" }}>{(data?.sem8cgpa ? data?.sem8cgpa : "None")}</p>
                            ) : (
                                <input
                                    type="number"
                                    className="text-base text-gray-900 break-words w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm 
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out"
                                    min="1"
                                    max="10"
                                    step="0.1"
                                    value={data?.sem8cgpa}
                                    onChange={(e) => {
                                        const value = parseFloat(e.target.value);
                                        if (!isNaN(value) && value >= 1 && value <= 10) {
                                            setData(prevData => ({ ...prevData, sem8cgpa: e.target.value }));
                                        } else {
                                            setData(prevData => ({ ...prevData, sem8cgpa: '' }));
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start ml-8 sm:ml-4 w-full mb-5">
                    <h3 className="text-xl font-semibold w-1/5 p-1 " style={{ color: "#2c2c2c" }}>College Name</h3>
                    <div className=" p-1 w-full sm:w-4/5 flex justify-center items-center">
                        {uploadstate === false ? (
                            <p className="text-base break-words w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" style={{ color: "#6e6e6e" }}>{(data?.collegename ? data?.collegename : "None")}</p>
                        ) : (
                            <input
                                type="text"
                                className="text-base text-gray-900 break-words w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm 
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out"
                                value={data?.collegename}
                                onChange={(e) => setData(prevData => ({ ...prevData, collegename: e.target.value }))}
                            />
                        )}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start w-full ml-8 sm:ml-4 mb-5">
                    <h3 className="text-xl font-semibold w-1/5 p-1 " style={{ color: "#2c2c2c" }}>Branch</h3>
                    <div className="p-1 w-full sm:w-4/5 flex justify-center items-center">
                        {uploadstate === false ? (
                            <p className="text-base break-words w-full p-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" style={{ color: "#6e6e6e" }}>{(data?.branch ? data?.branch : "None")}</p>
                        ) : (
                            <select
                                className="text-base text-gray-900 break-words w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm 
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 ease-in-out"
                                value={data?.branch}
                                onChange={(e) => setData(prevData => ({ ...prevData, branch: e.target.value }))}
                            >
                                <option value="">Select Year</option>
                                <option value="CSE">CSE</option>
                                <option value="IT">IT</option>
                                <option value="ECE">ECE</option>
                                <option value="EE">EE</option>
                                <option value="ME">ME</option>
                            </select>
                        )}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-start w-full ml-8 sm:ml-4 mb-5">
                    <h3 className="text-xl font-semibold w-1/5 p-1 " style={{ color: "#2c2c2c" }}>Email id</h3>
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
                <div className="flex flex-col sm:flex-row items-start w-full ml-8 sm:ml-4 mb-5">
                    <h3 className="text-xl font-semibold w-1/5 p-1 " style={{ color: "#2c2c2c" }}>Phone Number</h3>
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
                <div className="flex flex-col sm:flex-row items-start w-full ml-8 sm:ml-4 mb-5">
                    <h3 className="text-xl font-semibold w-1/5 p-1 " style={{ color: "#2c2c2c" }}>About You</h3>
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

                <button className="bg-red-500 text-white ml-8 sm:ml-4 font-semibold py-2 px-4 rounded hover:bg-red-600 w-full sm:w-3/5"
                    onClick={toggleupload}>
                    {(uploadstate ? "Save" : "UpdateProfile")}
                </button>
            </div>
            <div className='flex flex-col'>
                <p className='text-3xl font-semibold text-gray-900 ml-4 sm:ml-4 mt-10 mb-4'>Upload Resume</p>

                {pdfexists ?
                    <div className='flex flex-col ml-4 sm:ml-4'>
                        <div className="flex items-center ml-4 sm:ml-4 space-x-4 p-2">
                            <a href={shareablelink} target="_blank" rel="noopener noreferrer"
                                class="inline-flex items-center px-4 py-2 text-blue-600 font-semibold bg-gray-100 border border-gray-300 rounded 
                            hover:bg-gray-200 hover:text-teal-500 transition duration-300 ease-in-out">
                                View
                            </a>
                            
                            <button onClick={handlepdfdownload} class="inline-flex items-center px-4 py-2 text-blue-600 font-semibold bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 hover:text-teal-500 transition duration-300 ease-in-out">
                                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                                Download Resume
                            </button>
                        </div>
                        <button className="bg-red-500 text-white font-semibold ml-4 sm:ml-4 py-2 px-4 rounded hover:bg-red-600 w-2/5"
                            onClick={deleteupload}>
                            Delete Resume
                        </button>
                    </div> : <div>
                        <input type='file' accept='application/pdf' onChange={handlefilechange} />
                        <button className="bg-red-500 text-white ml-4 sm:ml-4 font-semibold py-2 px-4 rounded hover:bg-red-600 w-2/5"
                            onClick={handleupload}>
                            Upload Resume
                        </button>
                    </div>
                }

            </div>
        </div >
    )
}

export default ProfileDescription
