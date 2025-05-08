import React, { useEffect, useState } from "react";
import { useFileContext } from '@/context/Auth';
import { Backdrop } from '@mui/material';
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import Select from "react-select";
import toast, { Toaster } from 'react-hot-toast';
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();


const RegistrationForm = () => {
    const { user, updateUser } = useFileContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")

    const batch = [2025, 2026, 2027]
    const branch = ["CSE", "IT", "ECE", "EE", "ME"]
    
    const batcharray = [
        { value: 2025, label: 2025 },
        { value: 2026, label: 2026 },
        { value: 2027, label: 2027 }
    ]
    const brancharray = [
        { value: "CSE", label: "CSE" },
        { value: "IT", label: "IT" },
        { value: "ECE", label: "ECE" },
        { value: "EE", label: "EE" },
        { value: "ME", label: "ME" }
    ]

    const [data, setData] = useState({
        userid: "",
        creatername: "",
        placeofposting: "",
        message: "",
        image: "",
        batch: [],
        Ctc: "",
        CGPA: "",
        category: "",
        Backlogs: "",
        Registrationdate: "",
        Jobdescription: "",
        Branch: [],
        spreadsheetid: "",
        Role:"",
    });

    useEffect(() => {
        if (user) {
            setData(prevData => ({ ...prevData, userid: user?._id }));
        }
    }, [user]);

    const handleclick = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const r = await axios.post("/api/createsheet", { name: data?.creatername }, {
                headers: {
                    "Content-Type": "application/json",
                }
            })
            // if
            if (r?.status != 200) {
                setError(r?.message)
                // errortoast(r?.message)
                return;
            }

            data.spreadsheetid = r?.data?.data;
            await new Promise((resolve) => {
                setData(prevData => {
                    resolve(); // Resolving after state update
                    return { ...prevData, spreadsheetid: r.data.data }; // Corrected assignment
                });
            });
            const response = await fetch("https://placementportal-hhm9.onrender.com/createpost", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: "include",
            })
            const res = await response.json();
            if (res?.error || response?.status !== 200) {
                setError(res?.error || "Failed to create post")
            } else {
                const response2 = await fetch(`https://placementportal-hhm9.onrender.com/updaterecruiter/${user?._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ post: res?.post?._id }),
                })

                const res2 = await response2.json();

                if (res2?.status != 200) {
                    setError("Error in updating recruiter data")
                    return;
                }
                toast.success("Submitted Successfully");
                setError("")
                setData(prevData => ({
                    ...prevData,
                    creatername: "",
                    placeofposting: "",
                    message: "",
                    image: "",
                    batch: [],
                    Ctc: "",
                    CGPA: "",
                    category: "",
                    Backlogs: "",
                    Registrationdate: "",
                    Jobdescription: "",
                    Branch: [],
                    spreadsheetid: "",
                    Role:""
                }));

                updateUser(res2?.data);
            }
        }
        catch (err) {
            console.log(err);
            setError("Error in creating post")
        }
        finally {
            setLoading(false);
        }
    };

    function handlebatchChange(e) {
        const selectedValues = e.map((option) => option.value);
        setData(prevData => ({ ...prevData, batch: selectedValues }));
    }

    function handlebranchChange(e) {
        const selectedValues = e.map((option) => option.value)
        setData(prevData => ({ ...prevData, Branch: selectedValues }));
    }

    useEffect(() => {
        // console.log(user);
    }, [user]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            {loading ?
                <Backdrop  sx={{
                    color: '#fff', 
                    zIndex: (theme) => theme.zIndex.drawer + 1, 
                }}
                open={loading}>
                    <CircularProgress color="inherit" />
                </Backdrop> : <></>
            }
            <Toaster />
            <div className="bg-white shadow-lg rounded-lg p-10 max-w-5xl w-full h-full m-10">
                <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">JOB Form</h2>
                {error?.length != 0 && <p className="text-red-500 text-l mt-1">{error}</p>}
                <form className="grid grid-cols-2 gap-6">

                    <div className="col-span-2">
                        <label className="block mb-2 text-gray-700">Company Name</label>
                        <input
                            type="text"
                            placeholder="ABC"
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            value={data.creatername}
                            onChange={(e) => setData(prevData => ({ ...prevData, creatername: e.target.value }))}
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1 w-full sm:w-auto">
                        <label className="block mb-2 text-gray-700">Place of Posting</label>
                        <input
                            type="text"
                            placeholder="Location"
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            value={data.placeofposting}
                            onChange={(e) => setData(prevData => ({ ...prevData, placeofposting: e.target.value }))}
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1 w-full sm:w-auto">
                        <label className="block mb-2 text-gray-700">
                            Batch
                        </label>
                        <Select
                            className="w-[60%]"
                            id="d"
                            value={data?.batch?.map((value) => ({ value, label: value }))}
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            isMulti
                            options={batcharray}
                            onChange={handlebatchChange}
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1 w-full sm:w-auto">
                        <label className="block mb-2 text-gray-700">
                            Branch
                        </label>
                        <Select
                            className="w-[60%]"
                            id="d"
                            value={data?.Branch?.map((value) => ({ value, label: value }))}
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            isMulti
                            options={brancharray}
                            onChange={handlebranchChange}
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1 w-full sm:w-auto">
                        <label className="block mb-2 text-gray-700">Registration Date</label>
                        <input
                            type="date"
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            value={data.Registrationdate}
                            onChange={(e) => setData(prevData => ({ ...prevData, Registrationdate: e.target.value }))}
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1 w-full sm:w-auto">
                        <label className="block mb-2 text-gray-700">CTC/Stipend</label>
                        <input
                            type="number"
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            value={data.Ctc}
                            onChange={(e) => setData(prevData => ({ ...prevData, Ctc: e.target.value }))}
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1 w-full sm:w-auto">
                        <label className="block mb-2 text-gray-700">CGPA</label>
                        <input
                            type="number"
                            step="0.2"
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            value={data.CGPA}
                            onChange={(e) => setData(prevData => ({ ...prevData, CGPA: e.target.value }))}
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1 w-full sm:w-auto">
                        <label className="block mb-2 text-gray-700">Category</label>
                        <select
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            name="category"
                            id="category"
                            value={data.category}
                            onChange={(e) => setData(prevData => ({ ...prevData, category: e.target.value }))}
                        >
                            <option>Select</option>
                            <option>Tech</option>
                            <option>Non-Tech</option>
                            <option>Core</option>
                        </select>
                    </div>

                    <div className="col-span-2 sm:col-span-1 w-full sm:w-auto">
                        <label className="block mb-2 text-gray-700">Backlogs</label>
                        <input
                            type="number"
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            value={data.Backlogs}
                            onChange={(e) => setData(prevData => ({ ...prevData, Backlogs: e.target.value }))}
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-2 w-full sm:w-auto">
                        <label className="block mb-2 text-gray-700">Role</label>
                        <input
                            type="text"
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            value={data.Role}
                            onChange={(e) => setData(prevData => ({ ...prevData, Role: e.target.value }))}
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-2 w-full sm:w-auto">
                        <label className="block mb-2 text-gray-700">Job Description</label>
                        <textarea
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            value={data.Jobdescription}
                            onChange={(e) => setData(prevData => ({ ...prevData, Jobdescription: e.target.value }))}
                        />
                    </div>


                    <div className="col-span-2 mt-6">
                        <button
                            type="submit"
                            className=" w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
                            onClick={handleclick}
                        >
                            Next Step
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;
