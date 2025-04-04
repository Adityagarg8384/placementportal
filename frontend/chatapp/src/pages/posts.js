import React, { useState, useEffect } from 'react';
import { useFileContext } from '@/context/Auth';
import Link from 'next/link';

const PostPage = () => {
    const { user } = useFileContext();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch("https://placementportal-hhm9.onrender.com/getallpost", {
                method: "GET",
                credentials: "include",
            });
            if (!response?.ok) {
                throw new Error("Failed to fetch posts");
            }

            const res = await response.json();
            const shuffledPosts = shuffleArray(res.posts);
            setPosts(shuffledPosts);
            setLoading(false);
        } catch (error) {
            setError("Error fetching posts");
            setLoading(false);
        }
    };

    const shuffleArray = (array) => {
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredPosts = posts.filter(post =>
        post.creatername.toLowerCase().includes(searchQuery)
    );

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-semibold text-gray-900 mb-6 text-center">Search Job Posts</h1>

            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by company name"
                className=" w-full mb-8 ml-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {loading && <p className="text-gray-600 text-center">Loading...</p>}
            {error && <p className="text-red-600 text-center">{error}</p>}

            <div className="flex flex-col ml-4 gap-4">
                {filteredPosts?.map(post => (
                    <div
                        key={post._id}
                        className="bg-white p-6 shadow-md rounded-lg w-full cursor-pointer transition-transform transform hover:scale-105"
                    >
                        <Link href={`/post/${post._id}`}>
                            <div className="flex items-center space-x-4">
                                <img
                                    className="w-12 h-12 rounded-full"
                                    src={post?.image}
                                    alt="Company Logo"
                                />
                                <div className="w-full">
                                    <h2 className="text-lg font-semibold text-gray-900">{post?.creatername}</h2>
                                    <p className="text-sm text-gray-500">{post?.message}</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {filteredPosts?.length === 0 && !loading && (
                <p className="text-gray-600 mt-6 text-center">No posts found matching your search criteria.</p>
            )}
        </div>
    );
};

export default PostPage;
