'use client';

import axios from 'axios';
import { use, useEffect, useState } from 'react';
import { Navbar } from '../_components/navbar';
import Dashboard from '@/app/(protected)/_components/dashboard';
import PAT from '@/app/(protected)/_components/PAT';
import Infrastructure from '@/app/(protected)/_components/infrastructureHandler';
import Sidebar from '@/app/(protected)/_components/sidebar';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useRef } from 'react';
import Repositories from '../_components/repositories';
import Deploy from '../_components/deploy';
import Confetti from 'react-confetti';
import Database from '@/app/(protected)/dashboard/database';
import Domain from '@/app/(protected)/dashboard/domain';

export default function page() {
    const [page, setPage] = useState('')
    const GetParams = () => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const slug = urlParams.get('search');
        if (slug) {
            setPage(slug)
        }
        else {
            setPage('dashboard')
        }
        return slug;
    }

    useEffect(() => {
        GetParams()
    }, [])

    const [sidebarHandler, setSidebarHandler] = useState(true)

    const [infrastructure, setinfrastructure] = useState<string>('')



    const GITHUB_CLIENT_ID = "b55016a7680d8e89d8ba"
    const [reRender, setReRender] = useState(false)

    const getAccessToken = async (code: any) => {
        const response = await axios.post('/api/authorizeGithub', { code })
        if (response.data) {
            localStorage.setItem('accessToken', response.data.access_token)
            setReRender(!reRender)
            getGithubUserData()
        }
    }

    useEffect(() => {
        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)
        const code = urlParams.get('code')
        if (code && !localStorage.getItem('accessToken')) {
            getAccessToken(code)
        }
    })


    function continueWithGithub() {
        localStorage.clear();
        const githubUrl = 'https://github.com/login/oauth/authorize?client_id=' + GITHUB_CLIENT_ID;
        window.location.assign(githubUrl);
    }

    const [githubUserData, setGithubUserData] = useState<any>(null)
    const getGithubUserData = async () => {
        const Response = await axios.post("/api/githubData", { accessToken: localStorage.getItem('accessToken') })
        setGithubUserData(Response.data)

    }

    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            getGithubUserData()
        }
    }, [])




    return (
        <>
            {sidebarHandler && <Sidebar githubUserData={githubUserData} setGithubUserData={setGithubUserData} continueWithGithub={continueWithGithub} page={page} setPage={setPage} />}
            <div className='flex-1'>
                <Navbar sidebarHandler={sidebarHandler} setSidebarHandler={setSidebarHandler} />
                <div className='p-4 h-[90vh] overflow-y-scroll overflow-x-hidden'>
                    {page === 'dashboard' && <Dashboard setPage={setPage} />}
                    {/* {page === 'PAT' && <PAT />} */}
                    {page === 'infrastructure' &&
                        <Infrastructure
                            infrastructure={infrastructure}
                            setinfrastructure={setinfrastructure}
                        />}
                    {page === 'deploy' && <Deploy githubUserData={githubUserData} />}
                    {page === 'manage' && <Manage />}
                    {page === 'repositories' && <Repositories />}
                    {page === 'actions' && <Actions githubUserData={githubUserData} />}
                    {page === 'domain' && <Domain />}
                    {page === 'database' && <Database />}
                </div>
            </div>
        </>
    );
}
import { Nunito } from 'next/font/google';
import Notify from '../_components/notify';
import CompletedIcon from '../_components/icons/completedIcon';
import ErrorIcon from '../_components/icons/errorIcon';
import LoadingIcon from '../_components/icons/loadingIcon';
import { CleanUp } from '../_apis/awsApis';
const nunito = Nunito({ subsets: ['latin'] })
import { ConfigureAnsible, GenerateAnsiblePlaybook, RunAnsiblePlaybook } from '../_apis/packages';
import { AcceptCollaboration, AddCollaborator, AddPipeline, AddSecret } from '../_apis/pipelineApis';
import { get } from 'http';


const Actions = ({ githubUserData }: any) => {

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

    const [selectedRepo, setSelectedRepo] = useState<any>(null)

    const [brancheName, setBranch] = useState<string>("")
    const [applyOn, setApplyOn] = useState<any>(['push'])


    const [repoName, setRepoName] = useState<string>("")
    const [installationCommand, setInstallationCommand] = useState<string>("npm install")
    const [buildCommand, setBuildCommand] = useState<string>("npm run build")
    const [selectedInfra, setSelectedInfra] = useState<any>(null)

    const [generateCICD, setGenerateCICD] = useState(false)
    const [selectedFramework, setSelectedFramework] = useState('')

    const [exectingCICD, setExecutingCICD] = useState(false)

    const generationProcess = [
        {
            name: 'Adding Fusion as a Collaborator',
            description: 'Adding Fusion as a collaborator to the repository',
            status: 'loading',
            succuss: false,
            time: 0,
            result: "Adding Fusion as a collaborator to the repository..."
        },
        {
            name: 'Verifying Repository and Collaborator',
            description: 'Verifying the repository and the collaborator',
            status: 'not-started',
            succuss: false,
            time: 0,
            result: "Verifying the repository and the collaborator..."
        },
        {
            name: 'Adding VM Instance details to the repository secrets',
            description: 'Adding VM Instance details to the repository secrets',
            status: 'not-started',
            succuss: false,
            time: 0,
            result: "Adding VM Instance details to the repository secrets..."
        },
        {
            name: 'Adding Pipeline',
            description: 'Adding pipeline to the repository',
            status: 'not-started',
            succuss: false,
            time: 0,
            result: "Adding pipeline to the repository..."
        }
    ]

    const [scrollToIndex, setScrollToIndex] = useState<number | null>(0);
    const targetRef = useRef(null);

    const handleScrollTo = (index: number) => {
        setScrollToIndex(index);
        if (targetRef.current) {
            (targetRef.current as HTMLElement).scrollIntoView({ behavior: 'smooth' });
        }
    };

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    let savedResponse: any = null;

    interface ProcessProps {
        name?: string,
        description?: string,
        status?: string,
        success?: boolean,
        time?: number,
        result?: string
    }

    const [process, setProcess] = useState<ProcessProps[]>(generationProcess)

    const executeStep = async (stepIndex: number, stepFunction: any, successMessage: string) => {
        try {

            process[stepIndex].status = 'loading';
            handleScrollTo(stepIndex);
            setProcess([...process]);

            const response = await stepFunction();

            process[stepIndex].status = 'completed';
            process[stepIndex].success = response.success;
            process[stepIndex].result = response.success ? successMessage : response.message;
            if (response === undefined) {
                process[stepIndex].status = 'completed';
                process[stepIndex].success = false;
                process[stepIndex].result = "An error occurred during infrastructure provisioning";
                setProcess([...process]);
                return false;
            }

            setProcess([...process]);

            if (!response.success) {
                return false;
            }

            await sleep(2000);
            return true;
        } catch (error) {
            console.error(`Error during step ${stepIndex} execution:`, error);
            return false;
        }
    };

    const [showConfetti, setShowConfetti] = useState(false);

    const startExecution = async () => {
        document.getElementById('process')?.scrollIntoView({ behavior: "smooth" });
        const SecretNames = [
            'SSH_HOST',
            'SSH_KEY',
            'SSH_USERNAME'
        ]

        const cleanedSSHKey = infrastructures[selectedInfra].sshKey

        const SecretValues = [
            infrastructures[selectedInfra].publicIp,
            cleanedSSHKey,
            infrastructures[selectedInfra].username
        ]

        if (!selectedRepo) {
            Notify({ type: 'error', message: 'Error', description: 'Please select a repository' });
            return;
        }

        if (!selectedInfra) {
            Notify({ type: 'error', message: 'Error', description: 'Please select an infrastructure' });
            return;
        }
        //if length of secret names and secret values is 0

        if (SecretNames.length !== SecretValues.length) {
            Notify({ type: 'error', message: 'Error', description: 'Length of secretNames and secretValues is not equal' });
            return;
        }

        if (SecretNames.length === 0) {
            Notify({ type: 'error', message: 'Error', description: 'Please provide secret names and secret values' });
            return;
        }


        try {
            const yaml = GetYAMLFileContent();
            const responseStep1 = await executeStep(0, () => AddCollaborator(githubUserData.login, selectedRepo), "Fusion added as a collaborator");
            if (!responseStep1) { return; }

            const responseStep3 = await executeStep(1, AcceptCollaboration, "Repository and Collaborator Verified");
            if (!responseStep3) { return; }

            const responseStep2 = await executeStep(2, () => AddSecret(githubUserData.login, selectedRepo, SecretNames, SecretValues), "VM Instance details added to the repository secrets");
            if (!responseStep2) { return; }


            const responseStep4 = await executeStep(3, () => AddPipeline(githubUserData.login, selectedRepo, yaml), "Pipeline Added to the repository")
            if (!responseStep4) { return; }
            setProcess([...process]);

            Notify({ type: 'success', message: 'Success', description: 'CICD Pipeline has been successfully added to the repository' });

            setShowConfetti(true);
            await sleep(8000);
            setShowConfetti(false);



        } catch (error) {
            console.error('Error during execution:', error);
            Notify({ type: 'error', message: 'Error', description: 'An error occurred during infrastructure provisioning' });
        }
    }

    //GetGeneratedYaml 
    const GetYAMLFileContent = () => {
        let content = ""
        content = generateCICDStarter(applyOn, brancheName)
        content += generateNextJsCICD(repoName, installationCommand, buildCommand).split('$={{').join('${{');
        return content
    }

    const [infrastructures, setInfrastructures] = useState<any>([]);
    const user = useCurrentUser();

    const getInfrastructures = async () => {
        const response = await axios.post('/api/getInfrastructures', { userId: user?.id });
        if (response.data.infrastructures) {
            setInfrastructures(response.data.infrastructures);
        }
    };

    useEffect(() => {
        getInfrastructures();
    }, [])


    return (
        <div className={`flex flex-col justify-center ${nunito.className}`}>
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

            <h1 className='text-2xl font-bold text-white'>Add CICD Pipeline</h1>
            <p className='text-white'>  Automate your software development process with continuous integration and continuous deployment</p>

            <div className='flex flex-row gap-4 mt-4 w-full'>
                <div className='flex flex-col w-1/2 flex-start'>

                    <div className='flex flex-row gap-4 items-center mt-4 flex-wrap'>
                        {Frameworks.map((framework, index) => (
                            <div className={`flex flex-row gap-x-2 items-center
                         bg-${selectedFramework === framework.name ? 'rose-500' : 'temp2'}
                         p-2 rounded border border-temp shadow-lg cursor-pointer hover:bg-temp3 hover:text-white`} key={index} onClick={() => setSelectedFramework(framework.name)}>
                                <img src={framework.logo} className='w-6 h-6' />
                                <p className='text-white'>{framework.name}</p>
                            </div>
                        ))}
                    </div>

                    <div className='flex flex-row gap-4 items-center mt-4 '>
                        <p className='text-white w-1/2'>Select a Repository</p>
                        <select className='bg-temp2 border border-temp p-2 rounded text-white pr-4 w-full' onChange={(e) => {
                            setSelectedRepo(e.target.value)
                            setRepoName(e.target.value)
                        }}>
                            <option value="" disabled selected>Select a Repository</option>
                            {repos.map((repo: any, index: number) => (
                                <option key={index} value={repo.name}>{repo.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className='flex flex-row gap-4 items-center mt-4 '>
                        <p className='text-white w-1/2'>Select Infrastructure</p>
                        <select className='w-full p-2 rounded border border-temp bg-temp2 text-white' onChange={(e) => setSelectedInfra(e.target.value)} value={selectedInfra}>
                            <option>Select Infrastructure</option>
                            {infrastructures.map((infra: any, index: number) => (
                                <option key={index} value={index}>{infra.provider + ' - ' + infra.instanceName}</option>
                            ))}
                        </select>
                    </div>

                    <div className='flex flex-row gap-4 items-center mt-4 '>
                        <p className='text-white w-1/2'>Select a Branch</p>
                        <input type="text" className='bg-temp2 border border-temp p-2 rounded text-white w-full'
                            placeholder='Enter Branch Name *main/master*'
                            onChange={(e) => setBranch(e.target.value)} />
                    </div>

                    <div className='flex flex-row gap-4 items-center mt-4 '>
                        <p className='text-white w-1/2'>Apply On</p>
                        <div className='w-full flex flex-end gap-x-2 items-center'>
                            <div className={`w-full flex flex-row gap-x-2 items-center bg-${applyOn.includes('push') ? 'rose-500' : 'temp2'} cursor-pointer p-2 rounded border border-temp shadow-lg`} onClick={() => {
                                if (applyOn.includes('push')) {
                                    //pop
                                    setApplyOn(applyOn.filter((item: any) => item !== 'push'))
                                }
                                else {
                                    setApplyOn([...applyOn, 'push'])
                                }
                            }}>
                                <p className='text-white'>Push</p>
                            </div>
                            <div className={`w-full flex flex-row gap-x-2 items-center bg-${applyOn.includes('pull_request') ? 'rose-500' : 'temp2'} cursor-pointer p-2 rounded border border-temp shadow-lg`} onClick={() => {
                                if (applyOn.includes('pull_request')) {
                                    setApplyOn(applyOn.filter((item: any) => item !== 'pull_request'))
                                }
                                else {
                                    setApplyOn([...applyOn, 'pull_request'])
                                }
                            }}>
                                <p className='text-white'>Pull Request</p>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-row gap-4 items-center mt-4 '>
                        <p className='text-white w-1/2'>Installation Command</p>
                        <input type="text" className='bg-temp2 border border-temp p-2 rounded text-white w-full'
                            placeholder='Enter Installation Command'
                            value={installationCommand}
                            onChange={(e) => setInstallationCommand(e.target.value)} />
                    </div>

                    <div className='flex flex-row gap-4 items-center mt-4 '>
                        <p className='text-white w-1/2'>Build Command</p>
                        <input type="text" className='bg-temp2 border border-temp p-2 rounded text-white w-full'
                            placeholder='Enter Build Command'
                            value={buildCommand}
                            onChange={(e) => setBuildCommand(e.target.value)} />
                    </div>

                    <div className='flex flex-row gap-4 items-center mt-4 '>
                        <button
                            className="flex gap-2 items-center border b-1 border-rose-500 bg-rose-500 text-white py-2 px-8 focus:outline-none hover:bg-temp2 rounded text-md ml-auto disabled:bg-rose-200 disabled:cursor-not-allowed"
                            onClick={() => {
                                setGenerateCICD(true);
                                setExecutingCICD(false);
                            }}
                        >
                            Generate CICD
                        </button>
                        <button
                            className="flex gap-2 items-center border b-1 border-rose-500 bg-rose-500 text-white py-2 px-8 focus:outline-none hover:bg-temp2 rounded text-md"
                            onClick={() => {
                                setExecutingCICD(true)
                                startExecution()
                            }}
                        >
                            Execute
                        </button>

                    </div>



                </div>

                {generateCICD &&
                    <div className='flex flex-col gap-4 items-center mt-4 w-1/2'>
                        <p className='text-white w-full text-center bg-orange-500 p-2 rounded'>CICD Preview</p>
                        <div className='bg-temp2 p-4 rounded border border-temp w-full'>
                            <pre className='text-white text-sm'>{generateCICDStarter(applyOn, brancheName)}</pre>
                            <pre className='text-white text-sm'>{generateNextJsCICD(repoName, installationCommand, buildCommand).split('$={{').join('${{')}</pre>
                        </div>

                    </div>
                }

            </div>
            {exectingCICD &&
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
            }
        </div>

    );
}

function generateCICDStarter(applyOn: any, branch: string) {
    return `
name: Build & Deploy
on:
${applyOn.includes('push') ? '  push:\n    branches:\n      - ' + branch + '' : ''}
${applyOn.includes('pull_request') ? '  pull_request:\n    branches:\n      - ' + branch + '\n' : ''}
`;
}

function generateNextJsCICD(repoName: string, installationCommand: string, buildCommand: string) {
    return `
jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Node Setup
      uses: actions/setup-node@v3
      with:
        node-version: 18
    
    - name: Install Dependencies
      run: ${installationCommand}

    - name: Build Files
      run: ${buildCommand}
         
    - name: Copy Files via SSH
      uses: appleboy/scp-action@v0.1.4
      with:
        host: $={{ secrets.SSH_HOST }}
        key: $={{ secrets.SSH_KEY }}
        username: $={{ secrets.SSH_USERNAME }}
        source: ./
        target: ~/${repoName}/
        rm: true

    - name: SSH into the remote server and execute script
      uses: appleboy/ssh-action@v0.1.6
      with:
        host: $={{ secrets.SSH_HOST }}
        username: $={{ secrets.SSH_USERNAME }}
        key: $={{ secrets.SSH_KEY }}
        script: |
            cd ~/${repoName}
            export NVM_DIR="$HOME/.nvm"
            [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
            nvm use 18
            npm install pm2 -g
            pm2 restart ${repoName}`
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
        name: 'Node JS',
        logo: '/nodejs.svg'
    }
]



/*-------------------------------------------------------------------------------------------------------------------------*/


const Manage = () => {
    const [infrastructures, setInfrastructures] = useState<any>([]);

    const user = useCurrentUser();

    const getInfrastructures = async () => {
        const response = await axios.post('/api/getInfrastructures', { userId: user?.id });
        if (response.data.infrastructures) {
            setInfrastructures(response.data.infrastructures);
        }
    };

    useEffect(() => {
        getInfrastructures();
    }, []);

    const CopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const DownloadSSHKey = (key: string) => {
        const element = document.createElement("a");
        const file = new Blob([key], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "fusion-key.pem";
        document.body.appendChild(element);
        element.click();
    };

    const [manage, setManage] = useState(true)
    const [infrastructureIndex, setInfrastructureIndex] = useState(0)
    const [selectedPackages, setSelectedPackages] = useState([
    ])


    let directoryName = ""


    const installationProcess = [
        {
            name: 'Extracting SSH Keys',
            description: 'Extracting SSH Keys from the infrastructure',
            status: 'loading',
            success: false,
            time: 0,
            result: "Creating Process Directory..."
        },
        {
            name: 'Establishing Connection',
            description: 'Establish connection to the infrastructure',
            status: "not-started",
            success: false,
            time: 0,
            result: "Connecting to the infrastructure..."
        },
        {
            name: 'Installing Packages',
            description: 'Installing selected packages and services',
            status: "not-started",
            success: false,
            time: 0,
            result: "Installing packages and services..."
        },
        {
            name: "Cleaning Up",
            description: "Cleaning Up",
            status: "not-started",
            success: false,
            time: 0,
            result: ""
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

            if (stepIndex === 0) {
                directoryName = response.folderName;
            }

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
        document.getElementById('process')?.scrollIntoView({ behavior: "smooth" });
        //        setDisabled(true);

        const publicip = infrastructures[infrastructureIndex].publicIp
        const username = infrastructures[infrastructureIndex].username;
        const sshKey = infrastructures[infrastructureIndex].sshKey;


        try {
            const responseStep1 = await executeStep(0, () => ConfigureAnsible(publicip, username, sshKey), "SSH Keys Extracted");
            if (!responseStep1) {
                return;
            }

            const responseStep2 = await executeStep(1, () => GenerateAnsiblePlaybook(directoryName, selectedPackages), "Connection Established");
            if (!responseStep2) {
                return;
            }

            const responseStep3 = await executeStep(2, () => RunAnsiblePlaybook(directoryName), "Packages Installed");
            if (!responseStep3) {
                return;
            }

            const responseStep4 = await executeStep(3, () => CleanUp(directoryName), "Cleaning Up");
            if (!responseStep4) { return; }

            process[4].status = 'completed';
            process[4].success = true;
            process[4].result = "Completed";
            setProcess([...process]);

            await sleep(1000);


            const newForm = {
                infrastructureId: infrastructures[infrastructureIndex].id,
                newPackages: selectedPackages
            };

            const finalResponse = await axios.post('/api/updateInfrastructure', { form: newForm });

            if (finalResponse.data.error) {
                console.error('Error during execution:', finalResponse.data.error);
                Notify({ type: 'error', message: 'Error', description: 'An error occurred during the execution' });
                return;
            }

            Notify({ type: 'success', message: 'Installation Completed', description: 'Packages and services have been installed' });


        } catch (error) {
            console.error('Error during execution:', error);
            Notify({ type: 'error', message: 'Error', description: 'An error occurred during the execution' });
        }
    }

    const [installationProcessInProgress, setInstallationProcessInProgress] = useState(false);




    return (
        <>
            {!installationProcessInProgress ?
                <div className={`flex flex-col justify-center ${nunito.className}`}>
                    {manage ?
                        <>
                            <h1 className='text-2xl font-bold text-white'>Manage Infrastructures </h1>
                            <div className='flex flex-col gap-y-4 mt-4'>
                                {infrastructures.map((infrastructure: any, index: number) => (
                                    <InfrastructureCard
                                        key={index}
                                        infrastructure={infrastructure}
                                        onCopyPublicIP={() => CopyToClipboard(infrastructure.publicIp)}
                                        onCopyPrivateIP={() => CopyToClipboard(infrastructure.privateIp)}
                                        onDownloadSSHKey={() => DownloadSSHKey(infrastructure.sshKey)}
                                        manage={manage}
                                        setManage={setManage}
                                        infrastructureIndex={infrastructureIndex}
                                        setInfrastructureIndex={setInfrastructureIndex}
                                        index={index}
                                        getInfrastructures={getInfrastructures}
                                    />
                                ))}
                            </div>
                        </>
                        :
                        <div className='flex flex-col gap-y-4 mt-4'>
                            <h1 className='text-2xl font-bold text-white'>Manage Packages and Services</h1>
                            <div className='grid grid-cols-8 gap-4'>
                                {Packages.map((pkg, index) => (
                                    (infrastructures[infrastructureIndex].packages &&
                                        !infrastructures[infrastructureIndex].packages.includes(pkg.name)) && (
                                        <PackageCard
                                            key={index}
                                            package={pkg}
                                            selectedPackages={selectedPackages}
                                            setSelectedPackages={setSelectedPackages}
                                        />
                                    )
                                ))}
                            </div>

                            <div className='flex flex-row gap-4 items-center mt-4'>
                                <button
                                    className="flex gap-2 items-center border b-1 border-rose-500 bg-rose-500 text-white py-2 px-8 focus:outline-none hover:bg-temp2 rounded text-md ml-auto disabled:bg-rose-200 disabled:cursor-not-allowed"
                                    onClick={() => {
                                        startExecution();
                                        setInstallationProcessInProgress(true);
                                    }}
                                    disabled={selectedPackages.length === 0}
                                >
                                    Install Packages
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white cursor-pointer">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>

                                </button>
                            </div>
                            <h1 className='text-2xl font-bold text-white'>Packages and Services Already Installed</h1>
                            <div className='grid grid-cols-8 gap-4'>
                                {Packages.map((pkg, index) => (
                                    <>
                                        {infrastructures.map((infrastructure: any, index: number) => (
                                            <>
                                                {infrastructureIndex !== undefined &&
                                                    infrastructure.packages &&
                                                    infrastructure.packages.includes(pkg.name) &&
                                                    <PackageCard key={index} package={pkg} />
                                                }
                                            </>
                                        ))}
                                    </>
                                ))}
                            </div>
                        </div>
                    }
                </div>
                :
                <>
                    <h1 className='text-2xl font-bold text-white' id="process"> Installation Process</h1>
                    <div className='flex flex-col gap-4 mt-4'>
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
                                        <p className={`p-2 text-sm leading-relaxed whitespace-pre-wrap 
                                    ${process.status === 'loading' ? ('text-gray-300') : process.success ? ('text-green-500') : ('text-red-500')}
                                    `}>{process.result}</p>
                                    </div>
                                )
                            }
                        })}

                        {process[4].status === 'completed' &&
                            <div className='flex flex-col justify-between bg-temp2'>
                                <div className='grid grid-cols-4 gap-x-2'>
                                    {infrastructures[infrastructureIndex].packages.map((pkg: any, index: number) => (
                                        <div className='flex flex-row justify-between gap-x-2 items-center bg-temp2 p-3 border border-temp rounded' key={index}>
                                            <p className='text-white'><b>{pkg}</b></p>
                                            <p className='text-yellow-500'><b>Installed</b></p>
                                        </div>
                                    ))}
                                    {selectedPackages.map((pkg: any, index: number) => (
                                        <div className='flex flex-row justify-between gap-x-2 items-center bg-temp2 p-3 border border-temp rounded' key={index}>
                                            <p className='text-white'><b>{pkg}</b></p>
                                            <p className='text-green-500'><b>Installed Now </b></p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        }


                        <div className='flex flex-row gap-4 items-center mt-4'>
                            <button
                                className="flex gap-2 items-center border b-1 border-rose-500 bg-rose-500 text-white py-2 px-8 focus:outline-none hover:bg-temp2 rounded text-md ml-auto disabled:bg-rose-200 disabled:cursor-not-allowed"
                                onClick={() => {
                                    setInstallationProcessInProgress(false);
                                    setManage(true);
                                }}
                            >
                                Go Back
                            </button>
                        </div>

                    </div>


                </>
            }
        </>

    );
};

interface InfrastructureCardProps {
    index: number,
    infrastructure: any,
    onCopyPublicIP: () => void,
    onCopyPrivateIP: () => void,
    onDownloadSSHKey: () => void,
    manage: boolean,
    setManage: React.Dispatch<React.SetStateAction<boolean>>,
    infrastructureIndex: number,
    setInfrastructureIndex: React.Dispatch<React.SetStateAction<number>>,
    getInfrastructures: () => void
}

const InfrastructureCard = ({ index, infrastructure, onCopyPublicIP, onCopyPrivateIP, onDownloadSSHKey, manage, setManage, infrastructureIndex, setInfrastructureIndex , getInfrastructures }: InfrastructureCardProps) => {
    return (
        <div className='flex flex-col justify-between bg-temp2 p-4 border border-temp rounded shadow-lg'>
            <div className='flex flex-row gap-x-2 items-center mb-2 mt-2'>
                <div className={`p-2 w-40 text-center rounded text-center bg-${infrastructure.provider === 'AWS' ? 'orange-500' : infrastructure.provider === 'Azure' ? 'blue-200' : infrastructure.provider === 'Digital Ocean' ? 'blue-500' : infrastructure.provider === 'Private' ? 'red-500' : 'green'} border border-${infrastructure.provider === 'AWS' ? 'orange-500' : infrastructure.provider === 'Azure' ? 'blue-200' : infrastructure.provider === 'Digital Ocean' ? 'blue-500' : infrastructure.provider === 'Private' ? 'red-500' : 'green'}`}>
                    <p className='text-white'>{infrastructure.provider}</p>
                </div>
                <div className='flex flex-row flex-start gap-x-2 items-center bg-temp2 p-2 rounded border border-white shadow-lg'>
                    <p className='text-white'>Machine Name:</p>
                    <p className='text-white'>{infrastructure.instanceName}</p>
                </div>
            </div>

            <div className='grid grid-cols-2 gap-x-2'>
                <div className='flex flex-row justify-between gap-x-2 items-center bg-temp2 p-2  border border-temp shadow-lg border-b-0'>
                    <p className='text-white'><b>Public IP:</b> {infrastructure.publicIp}</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white cursor-pointer hover:text-current" onClick={onCopyPublicIP}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                </div>
                <div className='flex flex-row justify-between gap-x-2 items-center bg-temp2 p-2  border border-temp shadow-lg border-b-0'>
                    <p className='text-white'><b>Private IP:</b>{infrastructure.privateIp}</p>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white cursor-pointer hover:text-current" onClick={onCopyPrivateIP}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                </div>
            </div>

            <div className='grid grid-cols-2 gap-x-2'>
                <div className='flex flex-row justify-between gap-x-2 items-center bg-temp2 p-2  border border-temp shadow-lg border-b-0'>
                    <p className='text-white'><b>User:</b> {infrastructure.username}</p>
                </div>
                <div className='flex flex-row justify-between gap-x-2 items-center bg-temp2 p-2  border border-temp shadow-lg border-b-0'>
                    <p className='text-white'><b>Instance Type:</b> {infrastructure.instanceType}</p>
                </div>
            </div>

            <div className='grid grid-cols-2 gap-x-2'>
                <div className='flex flex-row justify-between gap-x-2 items-center bg-temp2 p-2  border border-temp shadow-lg border-b-0'>
                    <p className='text-white'><b>Region:</b> {infrastructure.region}</p>
                </div>
                <div className='flex flex-row justify-between gap-x-2 items-center bg-temp2 p-2  border border-temp shadow-lg border-b-0'>
                    <p className='text-white'><b>Operating System:</b> {infrastructure.operatingSystem}</p>
                </div>
            </div>

            <div className='grid grid-cols-2 gap-x-2'>
                <div className='flex flex-row justify-between gap-x-2 items-center bg-temp2 p-2  border border-temp shadow-lg'>
                    <p className='text-white'><b>Security Group:</b> {infrastructure.securityGroup}</p>
                </div>
                <div className='flex flex-row justify-between gap-x-2 items-center bg-temp2 p-2  border border-temp shadow-lg'>
                    <p className='text-white'><b>VPC:</b> {infrastructure.vpc}</p>
                </div>
            </div>


            <div className='flex flex-col gap-4 items-center mt-4'>
                <div className={`w-full text-sm text-white mx-auto flex rounded flex-row gap-4 justify-between border border-temp p-2 pl-4 pr-4 align-center items-center`}>
                    <div className='flex flex-row gap-4 items-center flex-end'>
                        {infrastructure.provider === 'AWS' &&
                            <>
                                <div className='flex flex-row gap-4 items-center flex-end'>ssh -i "cloudFusion.pem" ubuntu@ec2-{infrastructure.publicIp.replace(".", "-")}.${infrastructure.region}.compute.amazonaws.com</div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"
                                    onClick={() => {
                                        navigator.clipboard.writeText(`chmod 600 fusion-key.pem && ssh -i "fusion-key.pem" ubuntu@ec2-${infrastructure.publicIp.replace(".", "-")}.${infrastructure.region}.compute.amazonaws.com`)
                                        Notify({ type: 'success', message: 'Copied to clipboard', description: 'SSH command copied to clipboard' })
                                    }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                </svg>
                            </>
                        }
                        {infrastructure.provider === 'Digital Ocean' &&
                            <>
                                <div className='flex flex-row gap-4 items-center flex-end'>ssh -i "fusion-key.pem" root@{infrastructure.publicIp}</div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"
                                    onClick={() => {
                                        navigator.clipboard.writeText(`ssh -i "fusion-key.pem" root@${infrastructure.publicIp}`)
                                        Notify({ type: 'success', message: 'Copied to clipboard', description: 'SSH command copied to clipboard' })
                                    }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                </svg>
                            </>
                        }
                    </div>                    <div className='flex flex-row gap-4 items-center'>
                        <p>Download SSH Key: </p>
                        <button
                            className="inline-flex items-center border b-1 border-rose-500 text-white py-2 px-5 focus:outline-none hover:bg-rose-500 rounded text-sm mt-4 md:mt-0 disabled:bg-rose-200 disabled:cursor-not-allowed"
                            disabled={infrastructure.sshKey === ''}
                            onClick={onDownloadSSHKey}
                        >
                            Download
                        </button>
                    </div>
                </div>
            </div>

            <div className='flex flex-row gap-4 items-center mt-4 flex-end '>
                <button className="flex items-center border b-1 border-rose-500 text-white py-2 px-5 focus:outline-none hover:bg-rose-500 rounded text-sm mt-4 md:mt-0 disabled:bg-rose-200 disabled:cursor-not-allowed"
                    onClick={() => {
                        setManage(!manage)
                        setInfrastructureIndex(index)
                    }}
                >
                    Manage
                </button>
                <button
                    className="flex items-center border b-1 border-rose-500 bg-rose-500 text-white py-2 px-5 focus:outline-none hover:bg-rose-200 rounded text-sm mt-4 md:mt-0 disabled:bg-rose-200 disabled:cursor-not-allowed"
                    onClick={() => {
                        axios.post('/api/deleteInfrastructure', { infrastructureId: infrastructure.id })
                            .then(() => {
                                //GET INFRASTRUCTURES AGAIN
                                getInfrastructures();
                                Notify({ type: 'success', message: 'Infrastructure Deleted', description: 'Infrastructure has been deleted' })
                            })
                            .catch(() => {
                                Notify({ type: 'error', message: 'Failed to delete infrastructure', description: 'Failed to delete infrastructure' })
                            })
                    }}
                >
                    Delete
                </button>
            </div>



        </div >
    );
};

const PackageCard = ({ package: pkg, selectedPackages, setSelectedPackages }: any) => {
    const isSelected = selectedPackages && selectedPackages.length !== 0 && selectedPackages.includes(pkg.name);

    const borderClass = isSelected ? 'border-rose-500' : 'border-temp';

    return (
        <div
            className={`flex flex-col justify-between bg-temp2 border cursor-pointer ${borderClass}`}
            onClick={() => {
                if (selectedPackages.includes(pkg.name)) {
                    setSelectedPackages(selectedPackages.filter((item: any) => item !== pkg.name));
                } else {
                    setSelectedPackages([...selectedPackages, pkg.name]);
                }
            }}
        >
            <div className='relative flex flex-row gap-4 items-center justify-center p-1'>
                <img
                    src={`/packages/${pkg.logo}`}
                    width={75}
                    height={75}
                    alt="package-logo"
                />
                {isSelected && (
                    <div className='absolute top-1 right-2'>
                        <CompletedIcon />
                    </div>
                )}
            </div>
        </div>
    );
};



//Packages and Services, for ansible
const Packages = [
    {
        name: 'nginx',
        description: 'Nginx is a web server which can also be used as a reverse proxy, load balancer, mail proxy and HTTP cache.',
        selected: false,
        logo: '/nginx.svg',
        color: 'green-500'
    },
    {
        name: 'nodejs',
        description: 'Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser.',
        selected: false,
        logo: '/nodejs.svg',
        color: 'green-500'
    },
    {
        name: 'docker',
        description: 'Docker is a set of platform as a service products that use OS-level virtualization to deliver software in packages called containers.',
        selected: false,
        logo: '/docker.svg',
        color: 'blue-500'
    },
    {
        name: 'python',
        description: 'Python is an interpreted high level programming language for general-purpose programming.',
        selected: false,
        logo: '/python.svg',
        color: 'yellow-500'
    },
    {
        name: 'postgresql',
        description: 'PostgreSQL is a powerful, open source object-relational database system with over 30 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance.',
        selected: false,
        logo: '/postgresql.svg',
        color: 'blue-500'
    },
    {
        name: 'git',
        description: 'Git is a distributed version-control system for tracking changes in source code during software development.',
        selected: false,
        logo: '/git.svg',
        color: 'red-500'
    },
    {
        name: 'ruby',
        description: 'Ruby is an interpreted, high-level, general-purpose programming language.',
        selected: false,
        logo: '/ruby.svg',
        color: 'red-500'
    },
    {
        name: 'redis',
        description: 'Redis is an open source, in-memory data structure store, used as a database, cache, and message broker.',
        selected: false,
        logo: '/redis.svg',
        color: 'red-500'
    },
    {
        name: 'java',
        description: 'Java is a class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible.',
        selected: false,
        logo: '/java.svg',
        color: 'yellow-500'
    },
    {
        name: 'kubernetes',
        description: 'Kubernetes is an open-source container-orchestration system for automating computer application deployment, scaling, and management.',
        selected: false,
        logo: '/kubernetes.svg',
        color: 'blue-500'
    },
    {
        name: 'yarn',
        description: 'Yarn is a package manager that doubles down as project manager.',
        selected: false,
        logo: '/yarn.svg',
        color: 'blue-500'
    },
    {
        name: 'npm',
        description: 'NPM is the package manager for JavaScript and the world’s largest software registry.',
        selected: false,
        logo: '/nvm.svg',
        color: 'green-500'
    },
    {
        name: "php",
        description: "PHP is a popular general-purpose scripting language that is especially suited to web development.",
        selected: false,
        logo: '/php.svg',
        color: 'blue-500'
    },
    {
        name: "laravel",
        description: "Laravel is a free, open-source PHP web framework, intended for the development of web applications following the model–view–controller architectural pattern.",
        selected: false,
        logo: '/laravel.svg',
        color: 'red-500'
    },
    {
        name: "composer",
        description: "Composer is an application-level package manager for the PHP programming language that provides a standard format for managing dependencies of PHP software and required libraries.",
        selected: false,
        logo: '/composer.svg',
        color: 'green-500'
    },
    {
        name: "go",
        description: "Go is a statically typed, compiled programming language designed at Google.",
        selected: false,
        logo: '/go.svg',
        color: 'blue-500'
    },
    {
        name: 'awscli',
        description: 'The AWS Command Line Interface (CLI) is a unified tool to manage your AWS services.',
        selected: false,
        logo: '/aws.svg',
        color: 'yellow-500'
    },

]
