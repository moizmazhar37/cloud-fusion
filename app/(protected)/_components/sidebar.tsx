import React from 'react'
import { useCurrentUser } from '@/hooks/use-current-user';

export default function Sidebar({ githubUserData, setGithubUserData, continueWithGithub, page, setPage }: {
    githubUserData: any, setGithubUserData: any,
    continueWithGithub: any,
    page: string, setPage: any
}) {

    const user = useCurrentUser();

    return (
        <div className="bg-black h-full w-1/6 flex flex-col border-r border-temp h-screen">
            <a className="flex title-font font-medium items-center justify-center p-4 text-gray-900 mb-4 md:mb-0 border border-temp border-l-0 border-r-0">
                <img src="/Logo.png" className="w-12 h-12 cursor-pointer" />
                <span className="ml-3 text-xl font-bold text-white  cursor-pointer">CLOUD FUSION</span>
            </a>

            <div>
                <div className="overflow-hidden ">
                    <img src="https://i.postimg.cc/K8Rq5BCD/pexels-pavel-danilyuk-8381916.jpg" alt=""
                        className="object-cover object-top w-full h-24" />
                </div>
                <div
                    className="relative w-32 h-32 mx-auto -mt-16 overflow-hidden border-4 border-white rounded-full">
                    <img src={githubUserData?.avatar_url} alt="" className="object-cover object-top w-full h-36 " />
                </div>
                <div className="flex justify-center ">
                    <div>
                        <h2 className="text-xl text-center mt-2 font-semibold text-gray-300 ">{user?.name}</h2>
                        <span className="text-sm font-medium text-white">{user?.email}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-between h-full">
                <div className='flex flex-col items-center justify-center mt-4 w-full p-3 gap-2'>
                    <div className="flex flex-row w-full gap-x-2 rounded cursor-pointer p-4 pl-6 hover:bg-amber-700 hover:text-white bg-amber-500" onClick={() => setPage('dashboard')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        <a
                            className="text-white">Dashboard</a>
                    </div>
                    <div className="flex flex-row w-full gap-x-2 rounded cursor-pointer p-4 pl-6 hover:bg-rose-800 hover:text-white bg-rose-500" onClick={() => setPage('infrastructure')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <a
                            className="text-white">Create New Infrastructure</a>
                    </div>
                    {/* <div className="flex flex-row w-full gap-x-2 rounded cursor-pointer p-4 pl-6 hover:bg-rose-800 hover:text-white bg-rose-500" onClick={() => setPage('PAT')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <a
                            className="text-white">Check PAT</a>
                    </div> */}
                    <div className="flex flex-row w-full gap-x-2 rounded cursor-pointer p-4 pl-6 hover:bg-emerald-800 hover:text-white bg-emerald-500" onClick={() => setPage('manage')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                        </svg>
                        <a className="text-white">Manage Infrastructure</a>
                    </div>
                    <div className="flex flex-row w-full gap-x-2 rounded cursor-pointer p-4 pl-6 hover:bg-purple-800 hover:text-white bg-purple-500" onClick={() => setPage('deploy')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                        </svg>
                        <a
                            className="text-white">Deploy Application</a>
                    </div>
                    <div className="flex flex-row w-full gap-x-2 rounded cursor-pointer p-4 pl-6 hover:bg-pink-200 hover:text-white bg-emerald-600" onClick={() => setPage('actions')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                        </svg>
                        <a
                            className="text-white">Add CICD Actions</a>
                    </div>
                    {/* <div className="flex flex-row w-full gap-x-2 rounded cursor-pointer p-4 pl-6 hover:bg-pink-200 hover:text-white bg-sky-400" onClick={() => setPage('domain')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                        </svg>
                        <a
                            className="text-white">Add Domain</a>
                    </div> */}
                    <div className="flex flex-row w-full gap-x-2 rounded cursor-pointer p-4 pl-6 hover:bg-pink-200 hover:text-white bg-red-400" onClick={() => setPage('database')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                        </svg>
                        <a
                            className="text-white">Deploy Database</a>
                    </div>

                    <div className="flex flex-row w-full gap-x-2 rounded cursor-pointer p-4 pl-6 hover:bg-teal-800 hover:text-white bg-teal-500" onClick={() => setPage('repositories')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        <a
                            className="text-white">View Repositories</a>
                    </div>

                </div>

                <div className='flex flex-col items-center justify-center mt-4 w-full p-3 gap-2'>

                    {githubUserData ?
                        <div className="flex flex-row w-full gap-x-2 rounded cursor-pointer p-4 pl-6 border border-current bg-temp2 items-center justify-center" onClick={() => continueWithGithub()}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-current">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                            </svg>
                            <p className="text-white text-sm" > Github Connected</p>


                        </div> :
                        <div className='bg-rose-500 w-fit flex flex-row items-center justify-center gap-x-2 px-2 py-1 rounded cursor-pointer' onClick={() => continueWithGithub()}>
                            <img src="/Logo.png" className="w-10 h-10 cursor-pointer" />
                            <p className="text-white">Github Not Connected</p>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
