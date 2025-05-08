import React, { useEffect, useState } from 'react';
import { useFileContext } from '@/context/Auth';
import { Backdrop, CircularProgress } from '@mui/material';
import axios from 'axios';

const Recruiterdata = ({ recruiterpostid }) => {
    const [companydata, setCompanydata] = useState([]);
    const { post } = useFileContext();
    const [loading, setLoading] = useState(false);
    const [priv, setPriv] = useState(false);
    const [message, setMessage] = useState('');

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const handleSendMessage = () => {
        const to = "adityagarg8384@gmail.com"; 
        const subject = encodeURIComponent("Hi"); 
        const body = encodeURIComponent(message);

        const ccEmails = companydata
            .map((company) => company?.EMAILID)
            .filter((email) => email !== "N/A")
            .join(',');

        const mailtoLink = `mailto:${to}?cc=${ccEmails}&subject=${subject}&body=${body}`;

        window.open(mailtoLink, '_blank');
    };

    useEffect(() => {
        console.log(post);
    }, [post]);

    useEffect(() => {
        const fetchSpreadsheet = async () => {
            if (!post?.spreadsheetid) {
                console.error("Spreadsheet ID is missing");
                return;
            }

            setLoading(true);
            try {
                const apiKey = process.env.NEXT_PUBLIC_CLOUDAPIKEY;
                const url = `https://sheets.googleapis.com/v4/spreadsheets/${post?.spreadsheetid}/values/Sheet1?key=${apiKey}`;
                const response = await fetch(url);

                if (!response?.ok) {
                    const data = await response.json();
                    if (data?.error?.code === 403) {
                        setPriv(true);
                    }
                    throw new Error(`Error fetching data: ${data?.error?.message || response?.statusText}`);
                }

                const data = await response.json();
                const rows = data?.values || [];
                const cgpaData = rows.slice(1).map(row => row.slice(9, 16));

                const average = cgpaData?.map(row => {
                    const validScores = row
                        .filter(cgpa => cgpa !== "" && cgpa !== null && Number(cgpa) > 0)  
                        .map(Number);
                    const total = validScores.reduce((acc, score) => acc + score, 0);
                    return validScores.length > 0 ? (total / validScores.length).toFixed(2) : "N/A";
                });

                const formattedData = rows.slice(1).map((row, index) => ({
                    Userid: row[0] || "N/A",
                    Fullname: row[1] || "N/A",
                    DOB: row[2] || "N/A",
                    AGE: row[3] || "N/A",
                    COLLEGENAME: row[4] || "N/A",
                    DEGREE: row[5] || "N/A",
                    GENDER: row[6] || "N/A",
                    EMAILID: row[7] || "N/A",
                    PHONE: row[8] || "N/A",
                    CGPA: average[index],
                }));

                setCompanydata(formattedData);
            } catch (err) {
                console.error("Failed to fetch spreadsheet data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSpreadsheet();
    }, [post]);

    const handleDownload = async () => {
        try {
            console.log("In handledownloaded")
            const response = await axios.post("/api/downloadsheet", {
                spreadsheetid: post?.spreadsheetid,
            }, {
                headers: { "Content-Type": "application/json" },
            });

            const blob = new Blob([response.data], { type: 'text/csv' });
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

    return (
        <div className=" bg-gray-100 h-screen overflow-x-auto overflow-y-auto mx-8">
            {loading && (
                <Backdrop open={loading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}

            <div className="overflow-y-auto h-96">
                {!priv ? (
                    <table className="min-w-full table-auto border-collapse bg-white shadow-md">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-4 border-b text-left">USER_ID</th>
                                <th className="py-3 px-4 border-b text-left">Name</th>
                                <th className="py-3 px-4 border-b text-left">Date of Birth</th>
                                <th className="py-3 px-4 border-b text-left">Age</th>
                                <th className="py-3 px-4 border-b text-left">College Name</th>
                                <th className="py-3 px-4 border-b text-left">Degree</th>
                                <th className="py-3 px-4 border-b text-left">Gender</th>
                                <th className="py-3 px-4 border-b text-left">Email id</th>
                                <th className="py-3 px-4 border-b text-left">Phone Number</th>
                                <th className="py-3 px-4 border-b text-left">CGPA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companydata?.map((company, index) => (
                                <tr key={company?.Userid || index} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b">{company?.Userid}</td>
                                    <td className="py-2 px-4 border-b">{company?.Fullname}</td>
                                    <td className="py-2 px-4 border-b">{company?.DOB}</td>
                                    <td className="py-2 px-4 border-b">{company?.AGE}</td>
                                    <td className="py-2 px-4 border-b">{company?.COLLEGENAME}</td>
                                    <td className="py-2 px-4 border-b">{company?.DEGREE}</td>
                                    <td className="py-2 px-4 border-b">{company?.GENDER}</td>
                                    <td className="py-2 px-4 border-b">{company?.EMAILID}</td>
                                    <td className="py-2 px-4 border-b">{company?.PHONE}</td>
                                    <td className="py-2 px-4 border-b">{company?.CGPA}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Spreadsheet is set as private. Please change the restriction by opening the spreadsheet.</p>
                )}
            </div>

            <button
                className="inline-flex items-center px-4 py-2 text-blue-600 font-semibold bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 hover:text-teal-500 transition duration-300 ease-in-out"
                onClick={handleDownload}
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Download Data
            </button>

            <button className="inline-flex items-center px-4 py-2 ml-4 text-blue-600 font-semibold bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 hover:text-teal-500 transition duration-300 ease-in-out">
                <a
                    href={`https://docs.google.com/spreadsheets/d/${post?.spreadsheetid}/edit?gid=0#gid=0`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-row"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Open Spreadsheet
                </a>
            </button>
            {/* <div className="mt-10 p-6 bg-white shadow-md rounded-lg w-full max-w-2xl">
                <label className="block text-gray-700 font-medium mb-2">
                    Broadcast a mail
                </label>
                <textarea
                    value={message}
                    onChange={handleMessageChange}
                    className="w-full p-4 border border-gray-300 rounded-lg resize-none"
                    placeholder="Enter your message here"
                    rows="4"
                />
                <button
                    onClick={handleSendMessage}
                    className="mt-4 px-6 py-2 bg-teal-600 text-white font-semibold rounded hover:bg-teal-700 transition duration-300"
                >
                    Send Message
                </button>
            </div> */}

        </div>
    );
};

export default Recruiterdata;
