import React, { useEffect } from 'react';
import { toast } from 'react-toastify'; 

export const Errortoast = ({ data }) => {
    useEffect(() => {
        if (data) {
            toast.error(data, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }, [data]); 

    return null; 
};
