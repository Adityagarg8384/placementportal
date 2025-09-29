'use client';

import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { FiLogOut, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { useFileContext } from '@/context/Auth';
import Link from 'next/link';

const Layout = ({ children }) => {
    const router = useRouter();
    const { user, role, updateUser, updatePost, updateRole } = useFileContext();
    const [profilelink, setProfilelink] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const defaultProfilePic = '/path/to/default/image.jpg'; 
        setProfilelink(user?.profilepic || defaultProfilePic);
    }, [user, role]);

    const logout = async () => {
        try {
            const response = await fetch("https://placementportal-hhm9.onrender.com/logout", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: "include",
            });
            const data = await response?.json();
            localStorage.removeItem("user-chat");
            updateUser(null);
            updatePost(null);
            updateRole(null);
            localStorage.removeItem('role-data');
            router.push('/login');
        } catch (err) {
            console.log(err);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(prevState => !prevState);
    };

    return (
        <div className="flex h-screen">
            <nav className={`sidebar bg-gray-800 text-white fixed sm:fixed w-64 py-7 px-2  h-full flex flex-col justify-between transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} 
            style={{ zIndex: 50, overflowY: "auto" }} >
                <div>
                    <h1 className="text-2xl font-semibold text-center">Dashboard</h1>
                    <div className="flex items-center justify-center mt-4 mb-4">
                        <Link href="/profile" className="flex items-center">
                            <img
                                src={profilelink}
                                alt="User Profile"
                                className="w-20 h-20 profile-image"
                            />
                        </Link>
                    </div>

                    <ul className="mt-10">
                        <li className="mb-4">
                            {role == "student" ?
                                <Link href="/posts" className="nav-item text-white p-3 block rounded">
                                    Home
                                </Link> :
                                <Link href="/recruiterdashboard" className="nav-item text-white p-3 block rounded">
                                    Home
                                </Link>
                            }
                        </li>
                        <li className="mb-4">
                            <Link href="/profile" className="nav-item text-white p-3 block rounded">
                                Profile
                            </Link>
                        </li>
                        <li className="mb-4">
                            <Link href="/chat" className="nav-item text-white p-3 block rounded">
                                Chat
                            </Link>
                        </li>
                        <li className='mb-4'>
                            <Link href="/temp" className="nav-item text-white p-3 block rounded">
                                Video Call
                            </Link>
                        </li>
                        {role === "recruiter" && (
                            <>
                                <li className="mb-4">
                                    <Link href="/createpost" className="nav-item text-white p-3 block rounded">
                                        Create Post
                                    </Link>
                                </li>
                            </>
                        )}
                        <li className="mb-4">
                            <Link href="/query" className="nav-item text-white p-3 block rounded">
                                Query
                            </Link>
                        </li>
                        <li className="mb-4">
                            <Link href="/contact" className="nav-item text-white p-3 block rounded">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="mb-4">
                    <button
                        onClick={logout}
                        className="text-white flex-row justify-center bg-gray-800 hover:bg-gray-900 p-4 block rounded w-full text-left flex items-center text-xl"
                    >
                        <FiLogOut className="mr-3 text-2xl" />
                        Logout
                    </button>
                </div>
            </nav>

            <div
                onClick={toggleSidebar}
                className={`flex items-center mr-2 bg-opacity-90 justify-center bg-gray-200 text-white h-full cursor-pointer fixed top-1/2 left-0 transform -translate-y-1/2 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
                style={{ zIndex: 10 }}
            >
                {isSidebarOpen ? (
                    <FiArrowLeft className="w-8 h-8 text-black" />
                ) : (
                    <FiArrowRight className="w-8 h-8 text-black" />
                )}
            </div>

            <div className={`flex-1 bg-gray-100 h-full transition-all duration-300 ${isSidebarOpen ? 'sm:ml-64' : 'sm:ml-0'}`}>
                {children}
            </div>

            <ToastContainer />
        </div>
    );
};

export default Layout;
