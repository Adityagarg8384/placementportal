import React, { useEffect, useState } from 'react';
import { useFileContext } from '@/context/Auth';
import axios from 'axios';

export const Pagedetailsright = ({ postid, postdata }) => {
    const { user, updateUser } = useFileContext();
    const { post } = useFileContext();
    const [apply, setApply] = useState(false);
    const [data, setData] = useState(null);
    const [eligibility, setEligibility] = useState({
        cgpa: false,
        batch: false,
        branch: false,
        gender: false,
    });
    const [isEligible, setIsEligible] = useState(false);
    const [expired, setExpired] = useState(false)
    const [load, setLoad] = useState(false);

    const requiredFields = ['batch', 'branch', 'gender', 'sem1cgpa'];

    const checkEligibility = () => {
        if (user && postdata) {
            const currentDate = new Date();
            const registrationDate = new Date(postdata?.Registrationdate);

            const meetsCriteria = eligibility?.cgpa && eligibility?.batch && eligibility?.branch && eligibility?.gender;
            setIsEligible(meetsCriteria && currentDate < registrationDate);
            setExpired(currentDate > registrationDate)
        }
    };

    const handleApply = async () => {
        try {
            const response = await fetch(`http://localhost:3000/updateuser/${user?._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobapplied: postdata?._id }),
                credentials: 'include',
            });

            if (response?.ok) {
                const resData = await response.json();
                updateUser(resData?.data);

                const res= await axios.post('/api/addsheet', {
                    id: post?.spreadsheetid,
                    data: user,
                }, {
                    headers: { 'Content-Type': 'application/json' },
                });
                if(res?.ok){
                    setApply(true);
                }
            }
                
        } catch (error) {
            console.error('Error applying:', error);
        }
    };

    const handleWithdraw = async () => {
        try {
            const response = await fetch("http://localhost:3000/removejobapplied", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userid: user?._id, jobid: post?._id }),
                credentials: "include",
            });

            if (response?.ok) {
                const resData = await response.json();
                updateUser(resData?.data);
                setApply(false);

                await axios.post("/api/deletesheetdata", {
                    userid: user?._id,
                    spreadsheetid: post?.spreadsheetid,
                }, {
                    headers: { "Content-Type": "application/json" },
                });
            }
        } catch (error) {
            console.error("Error withdrawing application:", error);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await axios.post("/api/downloadsheet", {
                spreadsheetid: post?.spreadsheetid,
            }, {
                headers: { "Content-Type": "application/json" },
            });

            const blob = new Blob([response?.data], { type: 'text/csv' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', 'spreadsheet.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading sheet:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3000/getspecificuser", {
                    method: "GET",
                    credentials: "include",
                });
                const result = await response.json();
                setData(result?.data);

                const userBatch = result?.data?.batch;
                const userBranch = result?.data?.branch;
                const userGender = result?.data?.gender;
                const userCgpa = result?.data?.sem1cgpa;

                setEligibility({
                    cgpa: postdata.CGPA <= userCgpa,
                    batch: Array.isArray(postdata.batch) && postdata?.batch.includes(userBatch),
                    branch: Array.isArray(postdata.Branch) && postdata?.Branch.includes(userBranch),
                    gender: userGender === 'Male' || userGender === 'Female',
                });

                checkEligibility();
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchData();
    }, [user, postdata]);

    useEffect(() => {
        // Check if user has already applied
        if (user && postdata) {
            const appliedJobs = user?.jobapplied || [];
            const t = appliedJobs.includes(postdata?._id);
            setApply(t);
        }
        checkEligibility();
    }, [user, eligibility, postdata]);


    return (
        <div className='flex flex-col w-full'>
            <div className='flex justify-center items-center h-24'>
                Eligibility Criteria Evaluation Result
            </div>

            <div className="flex w-full mt-2 mb-10 justify-center">
                <div className="bg-gray-400 h-px w-10/12 ml-2"></div>
            </div>

            <div className="flex flex-col items-center">
                {Object.entries(eligibility).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                        {value ? <p className='mr-2 text-xl'>✅</p> : <p className='mr-2 text-xl'>❌</p>}
                        <p className="text-gray-700 text-lg pt-2 pb-2">{key.charAt(0).toUpperCase() + key.slice(1)} Criteria</p>
                    </div>
                ))}
            </div>

            {isEligible ? (
                <div className="flex justify-center mt-4">
                    <p className="text-green-500">All criteria met. You are eligible to apply.</p>
                </div>
            ) : (
                expired ? (
                    <div className="flex justify-center mt-4">
                        <p className="text-red-500">Opportunity has expired.</p>
                    </div>
                ) : (
                    <div className="flex justify-center mt-4">
                        <p className="text-red-500">Eligibility criteria not met.</p>
                    </div>
                )
            )}

            <div className='flex justify-center mt-4'>
                {!apply ? (
                    <button
                        className={`bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 w-4/5 ${!isEligible ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={isEligible ? handleApply : null}
                    >
                        Apply
                    </button>
                ) : (
                    <button
                        className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 w-4/5"
                        onClick={handleWithdraw}
                    >
                        Withdraw
                    </button>
                )}
            </div>

            {/* <div className='flex justify-center mt-4'>
                <button
                    className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 w-4/5"
                    onClick={handleDownload}
                >
                    Download Spreadsheet
                </button>
            </div>

            <div className='flex justify-center mt-4'>
                <a href={`https://docs.google.com/spreadsheets/d/${post?.spreadsheetid}/edit?gid=0#gid=0`}
                    target="_blank"
                    rel="noopener noreferrer">
                    <button className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 w-4/5">
                        Open Spreadsheet
                    </button>
                </a>
            </div> */}
        </div>
    );
};
