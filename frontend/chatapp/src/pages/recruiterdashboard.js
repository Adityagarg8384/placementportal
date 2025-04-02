import { useFileContext } from '@/context/Auth';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const CompanyList = () => {
  const router = useRouter();
  const { user, post, updatePost } = useFileContext();
  const [data, setData] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      if (user && user?.post && user?.post?.length > 0) {
        try {
          const responses = await Promise.all(
            user?.post?.map(id => fetch(`http://localhost:3000/getpost/${id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            }))
          );          

          const results = await Promise.all(
            responses?.map(response => response?.ok ? response.json() : Promise.reject("Failed to fetch"))
          );
          setData(results);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      }
    };

    if (user) {
      fetchPosts();
    }
  }, [user]);

  const isOpportunityOpen = (registrationDate) => {
    const currentDate = new Date();
    const regDate = new Date(registrationDate);
    return currentDate <= regDate;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date?.getDate();
    const month = date?.toLocaleString('default', { month: 'short' });
    const year = date?.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleClick = (id, company) => {
    if (id) {
      updatePost(company)
      router.push(`/recruiterpost/${id}`);
    }
  };

  return (
    <div className="container mx-auto  p-6">
      <h1 className="text-4xl font-bold ml-4 sm:ml-0 mb-6 text-center text-gray-800">Company Placement Opportunities</h1>

      <div className="space-y-4 ml-4 sm:ml-4">
        {data?.map((company, index) => (
          <div
            key={index}
            onClick={() => handleClick(company?._id, company)}
            className={`group relative w-full h-full p-4 border rounded-md cursor-pointer shadow-sm transition-all duration-700 ${
              isOpportunityOpen(company?.Registrationdate) ? 'bg-green-100' : 'bg-red-100'
            } hover:bg-gray-800 hover:text-white`}
          >
            <div className="transition-opacity duration-500 group-hover:opacity-0">
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">{company?.creatername}</h2>
              <p className="text-gray-700">
                <strong>Registration Date:</strong> {formatDate(company?.Registrationdate)}
              </p>
              <p
                className={`text-lg font-bold mt-2 ${
                  isOpportunityOpen(company?.Registrationdate) ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {isOpportunityOpen(company?.Registrationdate) ? 'Opportunity Open' : 'Opportunity Closed'}
              </p>
            </div>

            <div className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <p className="text-white text-2xl">See Details</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyList;
