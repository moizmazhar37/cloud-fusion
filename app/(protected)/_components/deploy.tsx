'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Nunito } from 'next/font/google'
import axios from 'axios'
import { useCurrentUser } from '@/hooks/use-current-user'
import Notify from './notify'
import { CloneRepo, BuildRun, RunCommand, InstallDocker, CopyDockerContent, RunDockerCommand } from '../_apis/deployApis'
import CompletedIcon from '../_components/icons/completedIcon';
import ErrorIcon from '../_components/icons/errorIcon';
import LoadingIcon from '../_components/icons/loadingIcon';
import Confetti from 'react-confetti'


const nunito = Nunito({ subsets: ['latin'] })

export default function deploy({ githubUserData }: any) {

    const [form, setForm] = useState({
        framework: '',
        port: 3000,
        repository: '',
        branch: 'main',
        installCommand: 'npm install',
        buildCommand: 'npm run build',
        nodeVersion: 18,
        infrastrucutre: '',
    })

    const [repos, setRepos] = useState<any>([]);
    const [infrastructures, setInfrastructures] = useState<any>([]);

    const FetchGitHubRepos = async () => {
        const response = await axios.post('/api/githubRepos', { accessToken: localStorage.getItem('accessToken') })
        if (response.data) {
            setRepos(response.data)
        }
    }

    const user = useCurrentUser();

    const getInfrastructures = async () => {
        const response = await axios.post('/api/getInfrastructures', { userId: user?.id });
        if (response.data.infrastructures) {
            setInfrastructures(response.data.infrastructures);
        }
    };

    useEffect(() => {
        FetchGitHubRepos()
        getInfrastructures();
    }, [])


    const installationProcess = [
        {
            name: 'Generating Required Information and Establishing Connection',
            description: 'Generating Required Information and Establishing Connection',
            status: 'loading',
            success: false,
            time: 0,
            result: "Establishing Connection ...."
        },
        {
            name: 'Building and Running Application',
            description: 'Building and Running Application',
            status: 'not-started',
            success: false,
            time: 0,
            result: "Building and Running Application ...."
        },
        {
            name: 'Running Command',
            description: 'Running Command',
            status: 'not-started',
            success: false,
            time: 0,
            result: "Running Command ...."
        },
    ]

    interface ProcessProps {
        name: string,
        description: string,
        status: string,
        success: boolean,
        time: number,
        result: string
    }

    const [process, setProcess] = useState<ProcessProps[]>(installationProcess)

    const [scrollToIndex, setScrollToIndex] = useState<number | null>(0);
    const targetRef = useRef(null);

    const handleScrollTo = (index: number) => {
        setScrollToIndex(index);
        if (targetRef.current) {
            (targetRef.current as HTMLElement).scrollIntoView({ behavior: 'smooth' });
        }
    };

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));



    const executeStep = async (stepIndex: number, stepFunction: any, successMessage: string) => {
        try {
            process[stepIndex].status = 'loading';
            handleScrollTo(stepIndex);
            setProcess([...process]);

            const response = await stepFunction();


            process[stepIndex].status = 'completed';
            process[stepIndex].success = response.success;
            process[stepIndex].result = response.success ? successMessage : response.message;

            setProcess([...process]);

            if (!response.success) {
                return false;
            }

            await sleep(1000);

            return true;
        } catch (error) {
            console.error(`Error during step ${stepIndex} execution:`, error);
            return false;
        }
    };


    const startExecution = async () => {
        setDeploying(true);
        document.getElementById('process')?.scrollIntoView({ behavior: "smooth" });


        const publicip = infrastructures[form.infrastrucutre].publicIp
        const username = infrastructures[form.infrastrucutre].username;
        const sshKey = infrastructures[form.infrastrucutre].sshKey;
        const patToken = user ? user.PATToken : ""
        //'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';

        try {
            const responseStep1 = await executeStep(0, () => CloneRepo(publicip, '22', username, sshKey, form.repository, githubUserData.login, patToken), "SSH Keys Extracted");
            if (!responseStep1) {
                return;
            }

            const responseStep2 = await executeStep(1, () => BuildRun(form.framework, publicip, '22', username, sshKey, form.repository, form.installCommand, form.buildCommand, form.nodeVersion, form.port), "Build and Run Completed");
            if (!responseStep2) {
                return;
            }

            const responseStep3 = await executeStep(2, () => RunCommand(form.framework, publicip, '22', form.port, username, sshKey, form.repository), "Command Executed");
            if (!responseStep3) {
                return;
            }
            setShowConfetti(true);
            await sleep(8000);
            setShowConfetti(false);

        } catch (error) {
            console.error('Error during execution:', error);
            Notify({ type: 'error', message: 'Error', description: 'An error occurred during the execution' });
        }

        await sleep(10000);
        setDeploying(false);
    }

    const [Deploying, setDeploying] = useState(false);

    const [dockerForm, setDockerForm] = useState({
        dockerFileContentBase64: '',
        dockerFileName: '',
        dockerrunCommand: ''
    })
    const UploadDockerFile = async (e: any) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const filename = file.name;
            const dockerrunCommand = `sudo docker-compose -f ${filename} up -d`
            setDockerForm({
                dockerFileContentBase64: reader.result as string,
                dockerFileName: file.name,
                dockerrunCommand: dockerrunCommand
            })
        }
    }

    const dockerInstallationProcess = [
        {
            name: 'Generating Required Information and Establishing Connection',
            description: 'Generating Required Information and Establishing Connection',
            status: 'loading',
            success: false,
            time: 0,
            result: "Establishing Connection ...."
        },
        {
            name: 'Copying Docker Content',
            description: 'Copying Docker Content',
            status: 'not-started',
            success: false,
            time: 0,
            result: "Copying Docker Content ...."
        },
        {
            name: 'Running Docker Command',
            description: 'Running Docker Command',
            status: 'not-started',
            success: false,
            time: 0,
            result: "Running Docker Command ...."
        },
        {
            name: "Completed",
            description: "Completed",
            status: "not-started",
            success: false,
            time: 0,
            result: ""
        },

    ]
    const [showConfetti, setShowConfetti] = useState(false)

    const DockerExecution = async () => {
        setProcess(dockerInstallationProcess);
        setDeploying(true);
        document.getElementById('process')?.scrollIntoView({ behavior: "smooth" });

        if (dockerForm.dockerFileName === '' || dockerForm.dockerFileContentBase64 === '') {
            Notify({ type: 'error', message: 'Error', description: 'All fields are required' });
            setDeploying(false);
            return;
        }

        const publicip = infrastructures[form.infrastrucutre].publicIp
        const username = infrastructures[form.infrastrucutre].username;
        const sshKey = infrastructures[form.infrastrucutre].sshKey;
        try {
            const responseStep1 = await executeStep(0, () => InstallDocker(publicip, '22', username, sshKey , dockerForm.dockerFileName), "SSH Keys Extracted");
            if (!responseStep1) {
                return;
            }

            const responseStep2 = await executeStep(1, () => CopyDockerContent(publicip, '22', username, sshKey, dockerForm.dockerFileContentBase64, dockerForm.dockerFileName), "Docker Installed");
            if (!responseStep2) {
                return;
            }

            const responseStep3 = await executeStep(2, () => RunDockerCommand(publicip, '22', username, sshKey, dockerForm.dockerrunCommand), "Docker Command Executed");
            if (!responseStep3) {
                return;
            }
            setShowConfetti(true);
            await sleep(8000);
            setShowConfetti(false);


        } catch (error) {
            console.error('Error during execution:', error);
            Notify({ type: 'error', message: 'Error', description: 'An error occurred during the execution' });
        }

        await sleep(10000);
        setDeploying(false);
    }




    return (
        <>
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

            {Deploying ?
                <div className='flex flex-col gap-4 items-center mt-4 w-full'>
                    <h1 className='w-full text-2xl font-bold text-white' id="process"> Deploying and Automating CICD Pipeline</h1>
                    <div className='w-full flex flex-col gap-4 mt-4'>
                        {process.map((process, index) => {
                            if (process.status === 'loading' || process.status === 'completed') {
                                return (
                                    <div className='flex flex-col border border-temp p-4 rounded shadow-lg overflow-hidden' id={index.toString()} key={index}
                                        ref={scrollToIndex === index ? targetRef : null}
                                    >
                                        <div className='flex flex-row gap-x-4 bg-temp2 items-center justify-between border-b border-temp pb-3'>
                                            <div className='flex flex-row gap-y-2 items-center gap-x-4 flex-start'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 text-white">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                                                </svg>
                                                <p className='text-gray-300'>{process.name}</p>
                                            </div>
                                            {process.status === 'loading' && <LoadingIcon />}
                                            {process.status === 'completed' && process.success && <CompletedIcon />}
                                            {process.status === 'completed' && !process.success && <ErrorIcon />}
                                        </div>
                                        <p className={`p-2 text-sm leading-relaxed whitespace-pre-wrap ${process.status === 'loading' ? ('text-gray-300') : process.success ? ('text-green-500') : ('text-red-500')}`}>{process.result}</p>
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>
                :
                (form.framework === '' || form.framework !== 'Docker') ? (
                    <div className={`flex flex-col justify-center ${nunito.className}`}>
                        <h1 className='text-2xl font-bold text-white'>Deploy and Setup Reverse Proxy</h1>
                        <p className='text-white'>Deploy and setup reverse proxy for your infrastructure</p>

                        <div className='flex gap-3 mt-4'>
                            <div className='w-full flex flex-col gap-3'>
                                <h1 className='text-white font-semibold text-md'>Select Framework</h1>
                                <div className='w-full grid grid-cols-3 gap-3'>
                                    {Frameworks.map((framework, index) => (
                                        <div key={index} className={`w-full flex flex-col items-center gap-3 p-3 rounded border border-temp bg-${form.framework === framework.name ? 'rose-500' : 'temp2'} cursor-pointer`} onClick={() => setForm({ ...form, framework: framework.name })}>
                                            <img src={framework.logo} className='w-12 h-12' />
                                            <p className='text-white'>{framework.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='flex gap-8 mt-4'>
                            <div className='w-1/2 flex flex-col gap-4'>
                                <h1 className='text-white font-semibold text-md'>Select Repository</h1>
                                <select className='w-full p-3 rounded border border-temp bg-temp2 text-white' value={form.repository} onChange={(e) => setForm({ ...form, repository: e.target.value })}>
                                    <option disabled>Select Repository</option>
                                    {repos.map((repo: any, index: number) => (
                                        <option key={index} value={repo.name}>{repo.name}</option>
                                    ))}
                                </select>

                                <h1 className='text-white font-semibold text-md'>Select Branch</h1>
                                <input type="text" className='w-full p-3 rounded border border-temp bg-temp2 text-white' placeholder='Select Branch' value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} />


                                <h1 className='text-white font-semibold text-md'>Enter Port</h1>
                                <input type="number" className='w-full p-3 rounded border border-temp bg-temp2 text-white' placeholder='Enter Port' value={form.port} onChange={(e) => setForm({ ...form, port: parseInt(e.target.value) })} />

                            </div>

                            <div className='w-1/2 flex flex-col gap-4'>


                                <h1 className='text-white font-semibold text-md'>Select Infrastructure</h1>
                                <select className='w-full p-3 rounded border border-temp bg-temp2 text-white' value={form.infrastrucutre} onChange={(e) => setForm({ ...form, infrastrucutre: e.target.value })}>
                                    <option>Select Infrastructure</option>
                                    {infrastructures.map((infra: any, index: number) => (
                                        <option key={index} value={index}>{infra.provider + ' - ' + infra.instanceName}</option>
                                    ))}
                                </select>

                                <h1 className='text-white font-semibold text-md'>Enter Install Command</h1>
                                <input type="text" className='w-full p-3 rounded border border-temp bg-temp2 text-white' placeholder='Enter Install Command' value={form.installCommand} onChange={(e) => setForm({ ...form, installCommand: e.target.value })} />

                                <h1 className='text-white font-semibold text-md'>Enter Build Command</h1>
                                <input type="text" className='w-full p-3 rounded border border-temp bg-temp2 text-white' placeholder='Enter Build Command' value={form.buildCommand} onChange={(e) => setForm({ ...form, buildCommand: e.target.value })} />

                                <h1 className='text-white font-semibold text-md'>Select Node Version</h1>
                                <select className='w-full p-3 rounded border border-temp bg-temp2 text-white' value={form.nodeVersion} onChange={(e) => setForm({ ...form, nodeVersion: parseInt(e.target.value) })}>
                                    <option>Select Node Version</option>
                                    <option value='12'>12</option>
                                    <option value='14'>14</option>
                                    <option value='16'>16</option>
                                    <option value='18'>18</option>
                                    <option value='20'>20</option>
                                </select>
                            </div>
                        </div>

                        <div className='flex flex-row justify-end mt-8'>
                            <button className='bg-rose-500 text-white p-3 rounded w-1/6 font-semibold hover:bg-rose-600
                    ' onClick={startExecution}>Deploy</button>
                        </div>
                    </div>
                ) : (

                    <div className={`flex flex-col justify-center ${nunito.className}`}>
                        <h1 className='text-2xl font-bold text-white'>Deploy and Setup Reverse Proxy</h1>
                        <p className='text-white'>Deploy and setup reverse proxy for your infrastructure</p>

                        <div className='flex gap-3 mt-4'>
                            <div className='w-full flex flex-col gap-3'>
                                <h1 className='text-white font-semibold text-md'>Select Framework</h1>
                                <div className='w-full grid grid-cols-3 gap-3'>
                                    {Frameworks.map((framework, index) => (
                                        <div key={index} className={`w-full flex flex-col items-center gap-3 p-3 rounded border border-temp bg-${form.framework === framework.name ? 'rose-500' : 'temp2'} cursor-pointer`} onClick={() => setForm({ ...form, framework: framework.name })}>
                                            <img src={framework.logo} className='w-12 h-12' />
                                            <p className='text-white'>{framework.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className='flex gap-8 mt-4'>
                            <div className='w-1/2 flex flex-col gap-4'>
                                <h1 className='text-white font-semibold text-md'>Upload Docker File</h1>
                                <input type="file" className='w-full p-2 rounded border border-temp bg-temp2 text-white' onChange={UploadDockerFile} />

                                <h1 className='text-white font-semibold text-md'>Docker File Name</h1>
                                <input type="text" className='w-full p-3 rounded border border-temp bg-temp2 text-white' placeholder='Docker File Name' value={dockerForm.dockerFileName} onChange={(e) => setDockerForm({ ...dockerForm, dockerFileName: e.target.value })} />
                            </div>
                            <div className='w-1/2 flex flex-col gap-4'>
                                <h1 className='text-white font-semibold text-md'>Select Infrastructure</h1>
                                <select className='w-full p-3 rounded border border-temp bg-temp2 text-white' value={form.infrastrucutre} onChange={(e) => setForm({ ...form, infrastrucutre: e.target.value })}>
                                    <option>Select Infrastructure</option>
                                    {infrastructures.map((infra: any, index: number) => (
                                        <option key={index} value={index}>{infra.provider + ' - ' + infra.instanceName}</option>
                                    ))}
                                </select>
                                <h1 className='text-white font-semibold text-md'>Docker Run Command</h1>
                                <input type="text" className='w-full p-3 rounded border border-temp bg-temp2 text-white' placeholder='Docker Run Command' value={dockerForm.dockerrunCommand} onChange={(e) => setDockerForm({ ...dockerForm, dockerrunCommand: e.target.value })} />
                                <div className='flex flex-row justify-end mt-8'>
                                    <button className='bg-rose-500 text-white p-3 rounded w-1/6 font-semibold hover:bg-rose-600' onClick={DockerExecution}>Deploy</button>
                                </div>

                            </div>
                        </div>


                    </div>
                )}

        </>
    )
}


const Frameworks = [
    {
        name: 'Next JS',
        logo: '/nextjs.svg'
    },
    {
        name: 'React JS',
        logo: '/react.svg'
    },
    {
        name: 'Node JS',
        logo: '/nodejs.svg'
    },
    {
        name: 'Vite JS',
        logo: '/vitejs.svg'
    },
    {
        name: 'Vue JS',
        logo: '/vue.svg'
    },
    {
        name: 'Angular Js',
        logo: '/angular.svg'
    },
    {
        name: 'Svelte JS',
        logo: '/svelte.svg'
    },
    {
        name: 'Python',
        logo: '/python-4.svg'
    },
    {
        name: 'Docker',
        logo: '/docker-4.svg'
    }
]
