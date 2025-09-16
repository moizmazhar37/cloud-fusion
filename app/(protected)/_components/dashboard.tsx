import React from 'react'
import { useCurrentUser } from '@/hooks/use-current-user';

export default function Dashboard( { setPage }: { setPage: any }) {

    const user = useCurrentUser();

    return (
        <div className='flex flex-col gap-y-4'>
            <div className='flex flex-row gap-x-4'>
                <div className='flex-1 p-4 rounded shadow-lg'>
                    <h1 className='text-2xl text-white font-bold'>Welcome to Cloud Fusion</h1>
                    <p className='text-gray-500'>Welcome {user?.name} to Cloud Fusion, a platform to deploy and manage your applications</p>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='bg-rose-500 p-4 rounded shadow-lg h-[12rem] flex flex-col justify-between' onClick={() => setPage('infrastructure')}>
                    <h1 className='text-2xl font-bold text-white'>Step 1: Create New Infrastructure</h1>
                    <div className='text-white mt-4 text-lg'>
                        We offer infrastructure provisioning for AWS, Azure, Digital Ocean and our own Cloud Fusion.
                        We use terraform and ansible to provision the infrastructures.
                    </div>
                    <div className='flex justify-end'>
                        <button className='bg-white text-rose-500 font-bold px-4 py-2 rounded mt-4 hover:bg-amber-200 hover:text-white transition duration-300'>Create Infrastructure</button>
                    </div>
                </div>
                <div className='bg-emerald-500 p-4 rounded shadow-lg h-[12rem] flex flex-col justify-between' onClick={() => setPage('manage')}>
                    <h1 className='text-2xl font-bold text-white'>Step 2: Install Dependencies</h1>
                    <div className='text-white mt-4 text-lg'>
                        We offer dependency installation for your application. You can install your dependencies using npm, pip, composer etc.
                    </div>
                    <div className='flex justify-end'>
                        <button className='bg-white text-emerald-500 font-bold px-4 py-2 rounded mt-4 hover:bg-rose-200 hover:text-white transition duration-300'>Install Dependencies</button>
                    </div>
                </div>
                <div className='bg-teal-500 p-4 rounded shadow-lg h-[12rem] flex flex-col justify-between' onClick={() => setPage('deploy')}>
                    <h1 className='text-2xl font-bold text-white'>Step 3: Deploy Application</h1>
                    <div className='text-white mt-4 text-lg'>
                        Deploy your application using our platform. We offer deployment for NodeJS, NextJS, ReactJS, Django, Docker etc.
                    </div>
                    <div className='flex justify-end'>
                        <button className='bg-white text-teal-500 font-bold px-4 py-2 rounded mt-4 hover:bg-emerald-200 hover:text-white transition duration-300'>Deploy Application</button>
                    </div>
                </div>  
                <div className='bg-pink-600 p-4 rounded shadow-lg h-[12rem] flex flex-col justify-between' onClick={() => setPage('actions')}>
                    <h1 className='text-2xl font-bold text-white'>Step 4: Do the DevOps</h1>
                    <div className='text-white mt-4 text-lg'>
                        We offer management of your application. You can manage your application using our platform.

                    </div>
                    <div className='flex justify-end'>
                        <button className='bg-white text-pink-600 font-bold px-4 py-2 rounded mt-4 hover:bg-blue-200 hover:text-white transition duration-300'>Add Pipeline</button>
                    </div>
                </div>
                {/* <div className='bg-sky-600 p-4 rounded shadow-lg h-[12rem] flex flex-col justify-between' onClick={() => setPage('domain')}>
                    <h1 className='text-2xl font-bold text-white'>Step 5: Configure Domain Name</h1>
                    <div className='text-white mt-4 text-lg'>
                        Configure your domain name using our platform. We offer domain name configuration for your application.
                    </div>
                    <div className='flex justify-end'>
                        <button className='bg-white text-sky-600 font-bold px-4 py-2 rounded mt-4 hover:bg-blue-200 hover:text-white transition duration-300'>Configure Domain Name</button>
                    </div>
                </div> */}
                <div className='bg-red-400 p-4 rounded shadow-lg h-[12rem] flex flex-col justify-between' onClick={() => setPage('database')}>
                    <h1 className='text-2xl font-bold text-white'>Step 5: Deploy a Database</h1>
                    <div className='text-white mt-4 text-lg'>
                        Deploy a database for your application. We offer database deployment for MySQL, PostgreSQL, MongoDB etc.
                    </div>
                    <div className='flex justify-end'>
                        <button className='bg-white text-red-400 font-bold px-4 py-2 rounded mt-4 hover:bg-blue-200 hover:text-white transition duration-300'>Deploy Database</button>
                    </div>
                </div>
                <div className='bg-sky-600 p-4 rounded shadow-lg h-[12rem] flex flex-col justify-between' onClick={() => setPage('repositories')}>
                    <h1 className='text-2xl font-bold text-white'>Step 6: Manage Repositories</h1>
                    <div className='text-white mt-4 text-lg'>
                        Manage your repositories using our platform. You can add, remove, update your repositories.
                    </div>
                    <div className='flex justify-end'>
                        <button className='bg-white text-sky-600 font-bold px-4 py-2 rounded mt-4 hover:bg-blue-200 hover:text-white transition duration-300'>Manage Repositories</button>
                    </div>
                </div>



            </div>


        </div>
    )
}


