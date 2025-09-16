

import axios from 'axios';
import { Nunito } from 'next/font/google';
import { useEffect, useState } from 'react';
const nunito = Nunito({ subsets: ['latin'] })

export default function Repositories (){

    const [repos, setRepos] = useState<any>([]);

    const FetchGitHubRepos = async () => {
        const response = await axios.post('/api/githubRepos', { accessToken: localStorage.getItem('accessToken') })
        if (response.data) {
            setRepos(response.data)
        }
    }

    useEffect(() => {
        FetchGitHubRepos()
    }, [])


    return (
        <div className={`flex flex-col justify-center ${nunito.className}`}>
            <h1 className='text-2xl font-bold text-white'>Repositories</h1>

            <div className='grid grid-cols-3 gap-4 mt-4'>
                {repos.map((repo: any, index: number) => (
                    <div className='relative flex flex-col justify-between bg-temp2 p-4 border border-temp rounded shadow-lg' key={index}>
                        <div className='flex flex-row gap-x-2 items-center mb-2'>
                            <p className='text-white'><b>Repo Name:</b> {repo.name}</p>
                        </div>
                        <div className='flex flex-row gap-x-2 items-center mb-2'>
                            <p className='text-white'><b>Repository URL:</b> {repo.html_url}</p>
                        </div>
                        <div className='absolute flex flex-row gap-x-2 items-center mb-2 top-4 right-4'>
                            <p className='text-temp bg-current rounded p-1 text-xs'>
                                {repo.visibility.toUpperCase()}</p>
                        </div>
                        <div className='absolute flex flex-row gap-4 flex-end items-center bottom-4 right-4'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white cursor-pointer hover:text-current" onClick={() => {
                                //open repo in new tab
                                window.open(repo.html_url, '_blank')
                            }
                            }>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}




