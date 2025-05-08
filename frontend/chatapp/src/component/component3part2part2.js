import React, { useState, useEffect, useRef } from 'react'
import { IoIosSend } from "react-icons/io";
import { useConversation } from "../zustand/Conversation";
import { useFileContext } from '@/context/Auth';
import { extractTime } from './utils';
import { io } from "socket.io-client";
import toast, { Toaster } from 'react-hot-toast';
import { useSocket } from '@/context/Socket';


// const socket = io("http://localhost:3000");

const Component3part2part2 = () => {
    const {socket}= useSocket()
    const { selectedConversation } = useConversation();
    const [message, setMessage] = useState([]);
    const [text, setText] = useState("");
    const { user,role } = useFileContext();

    const scrollLast = useRef();

    useEffect(() => {

        console.log("Selected Conversation", selectedConversation)
        setTimeout(() => {
            scrollLast?.current?.scrollIntoView({ behavior: "smooth" });
        }, 100)
    }, [message])

    const receive = async () => {
        try {
            if (!selectedConversation || !selectedConversation?._id) {
                throw new Error("Selected conversation is invalid");
            }

            const response = await fetch(`https://placementportal-hhm9.onrender.com/receive/${selectedConversation?._id}`, {
                method: "GET",
                credentials: "include",
            });

            if (!response?.ok) {
                await fetch(`https://placementportal-hhm9.onrender.com/send/${selectedConversation?._id}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    credentials: "include",
                    body: JSON.stringify({ message: "Hi" })
                });
                throw new Error(`HTTP error! status: ${response?.status}`);
            }

            const res = await response?.json();
            setMessage(res);
        } catch (error) {
            // const e= error?.json();
            console.log(error);
            console.error("Failed to fetch messages:", error);
        }
    };
    
    const recruiterreceive= async()=>{
        try {
            if (!selectedConversation || !selectedConversation?._id) {
                throw new Error("Selected conversation is invalid");
            }

            const response = await fetch(`https://placementportal-hhm9.onrender.com/receiverecruitermessage/${selectedConversation?._id}`, {
                method: "GET",
                credentials: "include",
            });

            if (!response?.ok) {
                await fetch(`https://placementportal-hhm9.onrender.com/sendrecruitermessage/${selectedConversation?._id}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    credentials: "include",
                    body: JSON.stringify({ message: "Hi" })
                });
                throw new Error(`HTTP error! status: ${response?.status}`);
            }

            const res = await response?.json();
            setMessage(res);
        } catch (error) {
            // const e= error?.json();
            console.log(error);
            console.error("Failed to fetch messages:", error);
        }
    }

    useEffect(() => {
        if (selectedConversation) {

            if(role== "recruiter"){
                recruiterreceive();
            }
            else if(role=="student" && selectedConversation?.companyname){
                recruiterreceive();
            }
            else{
                receive();
            }  
            // Placeholder for future image fetch functions
            // getReceiverImage();
            // getSenderImage();
        }
    }, [selectedConversation]);

    useEffect(() => {
        socket.emit("register", user?._id);
        socket.on("private message", (msg) => {
            setMessage((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            socket.off("private message");
        };
    }, []);

    const handleSubmit = async () => {
        try {
            const response = await fetch(`https://placementportal-hhm9.onrender.com/send/${selectedConversation?._id}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({ message: text })
            });
            const data = await response.json();

            socket.emit("private message", {
                senderid: user?._id,
                recipientId: selectedConversation?._id,
                message: text
            });

            setMessage((prevMessages) => [...prevMessages, data?.message]);
            setText(""); 
        } catch (err) {
            console.error(err);
        }
    }

    const handleRecruiterSubmit= async()=>{
        try{
            const response = await fetch(`https://placementportal-hhm9.onrender.com/sendrecruitermessage/${selectedConversation?._id}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({ message: text })
            });
            const data = await response.json();

            socket.emit("private message", {
                senderid: user?._id,
                recipientId: selectedConversation?._id,
                message: text
            });

            setMessage((prevMessages) => [...prevMessages, data?.message]);
            setText(""); 
        }
        catch(err){

        }
    }

    return (
        <div className='flex-grow flex flex-col bg-[#2a2b2d]'>
            <div className='flex-grow flex flex-col-reverse justify-start p-2 gap-y-2 bg-[#2a2b2d] overflow-auto' style={{ maxHeight: '70vh' }}>
                <div className='flex flex-col p-2 gap-y-2'>
                    {message?.length === 0 ? (
                        <div className='text-white flex flex-row justify-center text-xl'>
                            Send a message to start the conversation
                        </div>
                    ) : (
                        message?.map((item, index) => (
                            <div key={index} ref={scrollLast}>
                                {item?.receiverid === selectedConversation?._id ? (
                                    <div className='flex flex-col'>
                                        <div className='flex flex-row justify-end items-center'>
                                            <div className='text-white bg-blue-700 px-4 py-2 rounded-3xl'>
                                                {item?.message}
                                            </div>
                                            {user?.profilepic && (
                                                <img src={user?.profilepic} alt="Receiver" className='h-8 w-8 rounded-full ml-2' />
                                            )}
                                        </div>
                                        <div className='flex flex-row justify-end text-white'>
                                            {extractTime(item?.createdAt)}
                                        </div>
                                    </div>
                                ) : (
                                    <div className='flex flex-col'>
                                        <div className='flex flex-row justify-start items-center'>
                                            {selectedConversation?.profilepic && (
                                                <img src={selectedConversation?.profilepic} alt="Sender" className='h-8 w-8 rounded-full mr-2' />
                                            )}
                                            <div className='text-white bg-[#303135] px-4 py-2 rounded-3xl'>
                                                {item?.message}
                                            </div>
                                        </div>
                                        <div className='flex flex-row justify-start text-white'>
                                            {extractTime(item?.createdAt)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div className='w-full  py-4 bg-[#2a2b2d] flex flex-row justify-center items-center mt-auto'>
                <input
                    placeholder={selectedConversation?.companyname ?"You are not allowed to send Message": "Send Message" }
                    className='rounded-full w-8/12 sm:w-6/12 p-3 bg-[#212631] text-white border-2 border-[#575757]'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {

                            if(role== "recruiter"){
                                handleRecruiterSubmit();
                            }
                            else if(role=="student" && selectedConversation?.companyname){
                                handleRecruiterSubmit();
                            }
                            else{
                                handleSubmit();
                            }  
                           
                        }
                    }}
                    disabled={selectedConversation?.companyname}
                />
                <button
                    className='top-0 right-0 mt-2 hover:bg-[#303135]'
                    onClick={handleSubmit}
                >
                    <IoIosSend className='text-white w-6 h-6' />
                </button>
            </div>

        </div>
    );
}

export default Component3part2part2;
