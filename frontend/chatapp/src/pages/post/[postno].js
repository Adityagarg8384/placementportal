import React from 'react';
import { useRouter } from 'next/router';
import { useFileContext } from '@/context/Auth';
import { Pagedetails } from '@/component/pagedetails';


const Pages = () => {
    const router = useRouter();
    const postid = router?.query?.postno;

    const user = useFileContext();

    return (
        <div className="flex bg-gray-100 item-center justify-center ">
            <Pagedetails postid={postid}/>
        </div>
    );
};

export default Pages; 