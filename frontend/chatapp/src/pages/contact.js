// src/pages/Contact.js

import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Contact = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Contact Us</h1>
            <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
                <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-green-500 text-2xl" />
                    <div>
                        <strong>Address:</strong><br />
                        New TnP Building, Near Guest House,<br />
                        Netaji Subhas University of Technology (NSUT)
                    </div>
                </div>
                <div>
                    <h2 className="text-lg font-semibold">Rajesh Rawat</h2>
                    <div className="flex items-center space-x-2">
                        <FaPhoneAlt className="text-blue-500 text-lg" />
                        <div>
                            <strong>Mobile:</strong> +91 9205475078, +91 9810472670
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <FaEnvelope className="text-orange-500 text-lg" />
                        <div>
                            <strong>Email:</strong> <a href="mailto:rajesh.rawat@nsut.ac.in" className="text-blue-600 hover:underline">rajesh.rawat@nsut.ac.in</a>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-lg font-semibold">Dr. MPS Bhatia</h2>
                    <div className="flex items-center space-x-2">
                        <FaPhoneAlt className="text-blue-500 text-lg" />
                        <div>
                            <strong>Mobile:</strong> +91 9818192294
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
