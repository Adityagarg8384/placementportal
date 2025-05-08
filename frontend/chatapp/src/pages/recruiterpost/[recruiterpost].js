import React, { useState } from 'react';
import Recruiterdata from '@/component/recruiterdata';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

const CompanyList = () => {
  const router = useRouter();
  const recruiterpostid = router?.query?.recruiterpost;

  const [data, setData] = useState();

  useEffect(() => {
    const m = async (req, res) => {
      try {
        const response = await fetch(`https://placementportal-hhm9.onrender.com/getpost/${recruiterpostid}`, {
          method: "GET",
          withCredentials: true,
        })
        const res = await response.json();

        setData(res);
        localStorage.setItem("post-data", JSON.stringify(res))
        updatePost(newPostData);
      }
      catch (err) {
        console.log(err);
      }
    }


    if (recruiterpostid) {
      m();
    }


    console.log(recruiterpostid);
  }, [recruiterpostid]);

  const [filter, setFilter] = useState({
    branch: '',
    batch: '',
    category: '',
  });

  const [message, setMessage] = useState('');

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    const to = "adityagarg8384@gmail.com"; 
    const subject = encodeURIComponent("Hi"); 
    const body = encodeURIComponent(message); 

    const mailtoLink = `mailto:${to}?subject=${subject}&body=${body}`;

    window.open(mailtoLink, '_blank');
  };

  return (
    <div className="container h-full w-screen flex flex-col flex-grow bg-gray-100 overflow-x-hidden overflow-y-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">Company Placement Dashboard</h1>

      <div className="w-full">
        <div className="flex flex-col sm:flex-row justify-between ml-10 sm:ml-8 sm:space-y-0 sm:space-x-8 w-full">
          <div className="flex flex-row sm:flex-row items-start w-full sm:w-1/2">
            <h3
              className="text-xl font-semibold w-full sm:w-2/5 p-1"
              style={{ color: "#2c2c2c" }}
            >
              Company Name:
            </h3>
            {data &&
              <div className="w-full sm:w-3/5 flex justify-center items-center">
                <p
                  className="text-xl break-words w-full p-1 bg-gray-100"
                >
                  {data?.creatername}
                </p>

              </div>
            }
          </div>

          <div className="flex flex-row sm:flex-row items-start w-full sm:w-1/2">
            <h3
              className="text-xl font-semibold w-full sm:w-2/5 p-1"
              style={{ color: "#2c2c2c" }}
            >
              Place of Positing:
            </h3>
            {data &&
              <div className=" w-full sm:w-3/5 flex justify-center items-center">
                <p
                  className="text-xl break-words w-full p-1 bg-gray-100 "
                >
                  {data?.placeofposting}
                </p>
              </div>
            }
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between ml-10 sm:ml-8 sm:space-y-0 sm:space-x-8 w-full">
          <div className="flex flex-row sm:flex-row items-start w-full sm:w-1/2">
            <h3
              className="text-xl font-semibold w-full sm:w-2/5 p-1"
              style={{ color: "#2c2c2c" }}
            >
              Batch:
            </h3>
            {data &&
              <div className=" w-full sm:w-3/5 flex justify-center items-center">
                <p
                  className="text-xl break-words w-full bg-gray-100"
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {data?.batch?.map((item, index) => (
                      <p key={index} style={{ margin: '5px' }}>
                        {item}
                      </p>
                    ))}
                  </div>
                </p>

              </div>
            }
          </div>


          <div className="flex flex-row sm:flex-row items-start w-full sm:w-1/2">
            <h3
              className="text-xl font-semibold w-full sm:w-2/5 p-1"
              style={{ color: "#2c2c2c" }}
            >
              CTC/Stipend:
            </h3>
            {data &&
              <div className=" w-full sm:w-3/5 flex justify-center items-center">
                <p
                  className="text-xl break-words w-full p-1 bg-gray-100 "
                >
                  {data?.Ctc}
                </p>
              </div>
            }
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between ml-10 sm:ml-8 sm:space-y-0 sm:space-x-8 w-full">
          <div className="flex flex-row sm:flex-row items-start w-full sm:w-1/2">
            <h3
              className="text-xl font-semibold w-full sm:w-2/5 p-1"
              style={{ color: "#2c2c2c" }}
            >
              CGPA:
            </h3>
            {data &&
              <div className="w-full sm:w-3/5 flex justify-center items-center">
                <p
                  className="text-xl break-words w-full bg-gray-100"
                >
                  {data?.CGPA}
                </p>

              </div>
            }
          </div>

          <div className="flex flex-row sm:flex-row items-start w-full sm:w-1/2">
            <h3
              className="text-xl font-semibold w-full sm:w-2/5 p-1"
              style={{ color: "#2c2c2c" }}
            >
              Category:
            </h3>
            {data &&
              <div className=" w-full sm:w-3/5 flex justify-center items-center">
                <p
                  className="text-xl break-words w-full bg-gray-100 "
                >
                  {data?.category}
                </p>
              </div>
            }
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between ml-10 sm:ml-8 sm:space-y-0 sm:space-x-8 w-full">
          <div className="flex flex-row sm:flex-row items-start w-full sm:w-1/2">
            <h3
              className="text-xl font-semibold w-full sm:w-2/5 p-1"
              style={{ color: "#2c2c2c" }}
            >
              Backlogs:
            </h3>
            {data &&
              <div className=" w-full sm:w-3/5 flex justify-center items-center">
                <p
                  className="text-xl break-words w-full  bg-gray-100"
                >
                  {data?.Backlogs}
                  0
                </p>

              </div>
            }
          </div>

          <div className="flex flex-row sm:flex-row items-start w-full sm:w-1/2">
            <h3
              className="text-xl font-semibold w-full sm:w-2/5 p-1"
              style={{ color: "#2c2c2c" }}
            >
              Branch:
            </h3>
            {data &&
              <div className="w-full sm:w-3/5 flex justify-center items-center">
                <p
                  className="text-xl break-words w-full bg-gray-100 "
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {data?.Branch?.map((item, index) => (
                      <p key={index} style={{ margin: '5px' }}>
                        {item}
                      </p>
                    ))}
                  </div>
                </p>
              </div>
            }
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between ml-10 sm:ml-8 sm:space-y-0 sm:space-x-8 w-full">
          <div className="flex flex-row sm:flex-row items-start w-full sm:w-1/2">
            <h3
              className="text-xl font-semibold w-full sm:w-2/5 p-1"
              style={{ color: "#2c2c2c" }}
            >
              Role:
            </h3>
            {data &&
              <div className="w-full sm:w-3/5 flex justify-center items-center">
                <p
                  className="text-xl break-words w-full bg-gray-100"
                >
                  {data?.Role}
                </p>

              </div>
            }
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between ml-10 sm:ml-8 sm:space-y-0 sm:space-x-8 w-full">
          <div className="flex flex-col sm:flex-row items-start w-full sm:w-1/2">
            <h3
              className="text-xl font-semibold w-full sm:w-2/5 p-1"
              style={{ color: "#2c2c2c" }}
            >
              Job Description:
            </h3>
            {data &&
              <div className="w-full sm:w-3/5 flex justify-center items-center">
                <p
                  className="text-xl break-words w-full bg-gray-100"
                >
                  {data?.Jobdescription}
                </p>

              </div>
            }
          </div>
        </div>
      </div>


      <div className="mx-2 sm:mx2">
        <Recruiterdata recruiterpostid={recruiterpostid} filter={filter} />
      </div>

      <div className="mt-6 h-full">
        <label className="block text-gray-700 font-medium mb-2">Broadcast a mail</label>
        <textarea
          value={message}
          onChange={handleMessageChange}
          className="w-full p-4 border border-gray-300 rounded-md shadow-sm"
          rows="4"
          placeholder="Write your message here..."
        ></textarea>
      </div>
      <button
        onClick={handleSendMessage} 
        className="mt-4 bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Send Message
      </button>
    </div>
  );
};

export default CompanyList;
