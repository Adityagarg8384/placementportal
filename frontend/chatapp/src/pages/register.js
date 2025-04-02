import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useFileContext } from '@/context/Auth';
import { motion } from 'framer-motion';

export const Register = () => {
    const { user, updateUser, role, updateRole } = useFileContext();
    const router = useRouter();
    const [isOn, setIsOn] = useState(false);

    const [errors, setErrors] = useState({ fullname: '', username: '', password: '' });
    const [errormessage, setErrormessage] = useState("")

    const [data, setData] = useState({
        fullname: "",
        username: "",
        password: "",
        student: true,
    });

    useEffect(() => {
        setData((prevData) => ({
            ...prevData,
            student: !isOn ? true : false,
        }));
    }, [isOn]);

    const toggleSwitch = () => {
        setIsOn(!isOn);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!data.fullname) newErrors.fullname = 'Fullname is required';
        if (!data.username) newErrors.username = 'Username is required';
        if (data?.password?.length < 6) newErrors.password = 'Password must be at least 6 characters long';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; 
    };

    const Submitform = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            const response = await fetch("http://localhost:3000/signup", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: "include",
            });
            const res = await response.json();
            if (res?.status === 400) {
                setErrormessage(res?.message);
            } else {
                const role = data?.student ? "student" : "recruiter";
                localStorage.setItem("role-data", role);
                updateRole(role);
                localStorage.setItem("user-chat", JSON.stringify(res.user));
                updateUser(res.user);
                if(role=="student"){
                    router.push("/posts")
                }
                else{
                    router.push("/recruiterdashboard")
                }
                // router.push('/');
            }
        } catch (err) {
            setErrormessage("Registration Failed. Try again");
        }
    };

    return (
        <div className="Head flex flex-col sm:flex-row h-screen w-full" >
            <div className="hidden sm:flex flex-col justify-center items-center w-full sm:w-1/3 bg-gray-800 px-4 py-8">
                <div className=" font-bold text-white" style={{ fontSize: '3rem', transform: 'translateY(-50px)' }}>
                    Hello!
                </div>
                <div className=" text-l font-light text-white" style={{ transform: 'translateY(-50px)' }}>
                    Enter your personal details and
                </div>
                <div className=" text-l font-light text-white" style={{ transform: 'translateY(-50px)' }}>
                    Start your journey with us
                </div>
                <div className="w-full flex justify-center">
                    <Link className="w-full flex justify-center" href="/login">
                        <div className="p-3 border-2 border-gray-400 w-6/12 flex justify-center items-center text-lg font-normal text-white hover:bg-gray-900 transition duration-300"
                            style={{ borderRadius: "25px" }}>
                            Signin
                        </div>
                    </Link>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100 w-full sm:w-2/3">
                
                <form onSubmit={Submitform} className="w-full sm:w-[350px] mx-auto">
                    <div className="flex flex-row justify-center items-center">
                        <h1 className="text-gray-800 font-bold mb-8 text-center" style={{ fontSize: '3rem' }}>Create Account</h1>
                    </div>
                    <div className='flex items-center justify-center mb-5'>
                        <div className={`relative flex h-15 w-24 sm:h-15 sm:w-24 cursor-pointer rounded-full border border-gray-400
                        ${isOn ? "bg-black" : "bg-white"}`} onClick={toggleSwitch}>
                            <motion.div
                                className="h-10 w-10 rounded-full bg-blue-500 shadow-md transition-all duration-300 ease-in-out"
                                style={{ translateX: isOn ? "translateX(135%)" : "translateY(0%)" }}
                                animate={{ transform: `translateX(${isOn ? "135%" : "0%"})` }}
                                transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                            />
                            <span
                                className={`absolute left-2 top-2 text-black font-semibold transition-opacity duration-300 ${isOn ? 'opacity-0' : 'opacity-100'}`}
                            >
                                Student
                            </span>
                            <span
                                className={`absolute right-2 top-2 text-white font-semibold transition-opacity duration-300 ${isOn ? 'opacity-100' : 'opacity-0'}`}
                            >
                                Recruiter
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-between mb-4">
                        <input
                            type="text"
                            placeholder="Fullname"
                            name="fullname"
                            value={data?.fullname}
                            onChange={handleChange}
                            className=" p-2.5 text-base w-2/3 mx-auto sm:w-full text-black bg-gray-200 rounded-md"
                        />
                        {errors?.fullname && <p className="text-red-500 text-sm mt-1">{errors?.fullname}</p>}
                    </div>


                    <div className="flex flex-col items-center justify-between mb-4">
                        <input
                            type='text'
                            placeholder="Username"
                            name="username"
                            value={data?.username}
                            onChange={handleChange}
                            className=" p-2.5 text-base w-2/3 sm:w-full mx-auto rounded-md text-black bg-gray-200"
                        />
                        {errors?.username && <p className="text-red-500 text-sm mt-1">{errors?.username}</p>}
                    </div>


                    <div className="flex flex-col items-center justify-between mb-4">
                        <input
                            type='password'
                            placeholder="Password"
                            name="password"
                            value={data?.password}
                            onChange={handleChange}
                            className="p-2.5 w-2/3 sm:w-full mx-auto text-base text-black bg-gray-200 rounded-md"
                        />
                        {errors?.password && <p className="text-red-500 text-sm mt-1">{errors?.password}</p>}
                        {errormessage?.length != 0 && <p className="text-red-500 text-sm mb-2">{errormessage}</p>}
                    </div>
                    

                    <div className="flex flex-col justify-between mb-4">
                        <button
                            type='submit'
                            className="text-white cursor-pointer text-base w-2/3 sm:w-3/5 mt-6 mx-auto py-3 rounded-lg"
                            style={{ backgroundColor: '#007bff' }}
                        >
                            Sign Up
                        </button>
                    </div>
                    
                </form>
                <div className="flex justify-end w-full sm:hidden mt-4">
                    <Link className="w-full flex justify-center" href="/login">
                        <div
                            className="p-3 border-2 border-gray-400 w-6/12 flex justify-center items-center text-lg font-normal text-black hover:bg-gray-300 transition duration-300"
                            style={{ borderRadius: "25px" }}
                        >
                            SignIn
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
