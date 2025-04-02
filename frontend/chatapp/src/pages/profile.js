import React, { useEffect, useState } from 'react';
import { useFileContext } from '@/context/Auth';
import ProfilePageFriend from '@/component/profilepagefriend';
import ProfilePagePost from '@/component/profilepagepost';
import ProfileDescription from '@/component/profiledescription';
import Recruiterprofile from '@/component/recruiterprofile';
import toast from 'react-hot-toast';
import StudentProfileBottom from '@/component/studentprofilebottom';
import RecruiterProfileBottom from '@/component/recruiterprofilebottom';

export const Profile = () => {
    const { user, role } = useFileContext();
    const [showFullText, setShowFullText] = useState(false);
    const [displayState, setDisplayState] = useState(0);

    const toggleTextVisibility = () => {
        setShowFullText(!showFullText);
    };
    useEffect(() => {
    }, [user])

    return (
        <div className="Head min-h-screen w-full flex flex-col items-start bg-gray-100 justify-start">

            <div className="flex flex-col items-center m-5 p-6 rounded-lg shadow-lg w-full max-w-5xl mx-auto" style={{ backgroundColor: '#f7f7f7' }}>

                {user ? (
                    <img src={user?.profilepic} alt="User Profile" style={{ width: '150px', height: '150px' }} />
                ) : (
                    <p>Loading...</p>
                )}

                <div className="w-full">
                    {role == "student" ?
                        <div className="flex flex-col">
                            <ProfileDescription user={user} />
                            <StudentProfileBottom />
                        </div> :
                        <div className="flex flex-col">
                            <Recruiterprofile />
                            <RecruiterProfileBottom/>
                        </div>
                    }
                </div>
            </div>

        </div >
    );
}

export default Profile;
