import React from 'react'
import { useState, useEffect, useRef } from 'react'
import AWSSelector from './fusionSelector'
import { SecurityGroup } from '@/app/Interfaces/awsInterfaces'

import LoadingIcon from '../icons/loadingIcon'
import CompletedIcon from '../icons/completedIcon'
import ErrorIcon from '../icons/errorIcon'
import { notification } from 'antd'
import axios from 'axios'
import Confetti from 'react-confetti'
import Notify from '../notify'
import { GenerateProcess, RunningConfig, GenerateAwsInstance, EstablishProvider, GenerateExecutionPlan, GetTerraformData, CleanUp } from '@/app/(protected)/_apis/awsApis'
import { useCurrentUser } from '@/hooks/use-current-user';
import { set } from 'zod'

export default function AWSHandler() {

    const [form, setForm] = useState({
        machineName: '',
        osImage: '',
        instanceType: '',
        storage: 0,
        network: '',
    })

    const [securityGroups, setSecurityGroups] = useState<SecurityGroup[]>([
        {
            name: 'SSH',
            description: 'Secure Shell',
            port: 22
        },
        {
            name: 'HTTP',
            description: 'Hyper Text Transfer Protocol',
            port: 80
        },
        {
            name: 'HTTPS',
            description: 'Hyper Text Transfer Protocol Secure',
            port: 443
        }
    ])
    const [outboundrules, setOutboundRules] = useState<SecurityGroup[]>([
        {
            name: "All Traffic",
            description: "All Traffic",
            port: 0
        }
    ])



    const [securityGroup, setSecurityGroup] = useState<SecurityGroup>({
        name: '',
        description: '',
        port: 0
    })

    const SubmitForm = () => {

        if (form.machineName === '') {
            Notify({ type: 'error', message: 'Error', description: 'Please enter your machine name' })
            return
        }
        if (form.osImage === '') {
            Notify({ type: 'error', message: 'Error', description: 'Please select your operating system' })
            return
        }
        if (form.instanceType === '') {
            Notify({ type: 'error', message: 'Error', description: 'Please select your instance type' })
            return
        }
        if (form.network === '') {
            Notify({ type: 'error', message: 'Error', description: 'Please select your network' })
            return
        }


        startExecution()
    }

    const [page, setPage] = useState(1)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [page])


    let directoryName = ""
    let key = ""


    const awsInfrastuctureProcess = [
        {
            name: 'Generaring Process',
            description: 'Generaring Process',
            status: 'loading',
            succuss: false,
            time: 0,
            processFunction: GenerateProcess,
            result: "Creating Process Directory..."
        },
        {
            name: 'Setting up environment',
            description: 'Setting up environment',
            status: 'not-started',
            succuss: false,
            time: 0,
            processFunction: RunningConfig,
            result: "Environment for Infrastructure Provisioning ..."
        },
        {
            name: "Generating Configurations",
            description: "Generating Configurations",
            status: "not-started",
            success: false,
            time: 0,
            processFunction: GenerateAwsInstance,
            result: "Generating Configurations for AWS Instance..."
        },
        {
            name: "Establishing Provider",
            description: "Establishing Provider",
            status: "not-started",
            success: false,
            time: 0,
            processFunction: EstablishProvider,
            result: "Establishing Connection with AWS..."
        },
        {
            name: "Generating Execution Plan",
            description: "Generating Execution Plan",
            status: "not-started",
            success: false,
            time: 0,
            processFunction: GenerateExecutionPlan,
            result: "Working on Execution Plan... (May take a few minutes)"
        }, {
            name: "Applying Execution Plan",
            description: "Applying Execution Plan",
            status: "not-started",
            success: false,
            time: 0,
            processFunction: GenerateExecutionPlan,
            result: "Applying Execution Plan... (May take a few minutes)"
        },
        {
            name: "Fetching VM Details",
            description: "Completed",
            status: "not-started",
            success: false,
            time: 0,
            processFunction: GenerateExecutionPlan,
            result: ""
        },
        {
            name: "Cleaning Up",
            description: "Cleaning Up",
            status: "not-started",
            success: false,
            time: 0,
            processFunction: GenerateExecutionPlan,
            result: ""
        },
        {
            name: "Completed",
            description: "Completed",
            status: "not-started",
            success: false,
            time: 0,
            processFunction: GenerateExecutionPlan,
            result: ""
        },

    ]

    function formatTerraformExecutionPlan(planOutput: string) {
        const formattedPlan = planOutput.split('\n').map((line: string) => {
            if (line.startsWith('+') || line.startsWith('-') || line.startsWith('#')) {
                return `\x1b[32m${line}\x1b[0m`; // Green color for additions, red for deletions, and blue for comments
            } else {
                return line;
            }
        });

        return formattedPlan.join('\n');
    }


    const [process, setProcess] = useState<any[]>(awsInfrastuctureProcess)
    const [disabled, setDisabled] = useState(false)

    const [VMDetails, setVMDetails] = useState<any>({
        sshKey: '',
        instancePublicIP: '',
        instancePrivateIP: '',
        instanceName: '',
        instanceVPC: '',
        instanceSecurityGroup: '',
        keyInBase64: ''
    })

    const currentUser = useCurrentUser();

    const [showConfetti, setShowConfetti] = useState(false)

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
    const executeStep = async (stepIndex: number, stepFunction: any, successMessage: string) => {
        try {
            process[stepIndex].status = 'loading';
            handleScrollTo(stepIndex);
            setProcess([...process]);

            const response = await stepFunction();
            //set directory name
            if (stepIndex === 0) {
                directoryName = response.directory;
                key = response.key;
            }
            process[stepIndex].status = 'completed';
            process[stepIndex].success = response.success;
            process[stepIndex].result = response.success ? successMessage : response.message;

            setProcess([...process]);

            if (!response.success) {
                return false;
            }

            //Set VM Details
            if (stepIndex === 6) {
                savedResponse = response;
                setVMDetails({
                    sshKey: response.sshKey,
                    instancePublicIP: response.instancePublicIP,
                    instancePrivateIP: response.instancePrivateIP,
                    instanceName: response.instanceName,
                    instanceVPC: response.instanceVPC,
                    instanceSecurityGroup: response.instanceSecurityGroup,
                    keyInBase64: response.keyInBase64
                })
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

        notification.info({ message: 'Provisioning Infrastructure', description: 'Provisioning Infrastructure' });
        try {
            const responseStep1 = await fetch('http://localhost:3001/create-instance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: form.machineName,
                    image: form.osImage,
                    flavor: form.instanceType,
                    network: form.network,
                })
            });
            if (responseStep1.status !== 200) {
                notification.error({ message: 'Error', description: 'An error occurred during infrastructure provisioning' });
            }
            else {
                notification.success({ message: 'Success', description: 'Process Directory Created' });
            }


        } catch (error) {
            console.error('Error during execution:', error);
            Notify({ type: 'error', message: 'Error', description: 'An error occurred during infrastructure provisioning' });
        }
    }


    const DownloadSSHKey = () => {
        var element = document.createElement('a');
        var file = new Blob([VMDetails.sshKey], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "fusion-key.pem";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    const [Images, setImages] = useState([]);
    const [Networks, setNetworks] = useState([]);
    const [InstanceTypes, setInstanceTypes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3001/images', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const data = await response.json();
                setImages(data);
            } catch (error) {
                // Handle errors here
                console.error("Error fetching data:", error);
            }
        };

        const fetchData2 = async () => {
            try {
                const response = await fetch('http://localhost:3001/flavors', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const data = await response.json();
                setInstanceTypes(data);
            } catch (error) {
                // Handle errors here
                console.error("Error fetching data:", error);
            }
        };

        const fetchData3 = async () => {
            try {
                const response = await fetch('http://localhost:3001/networks', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const data = await response.json();
                setNetworks(data);
            } catch (error) {
                // Handle errors here
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
        fetchData2();
        fetchData3();

    }, []);




    return (
        <div className='mt-4'>
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
            {page === 1 &&
                <>
                    <h1 className='text-2xl font-bold text-white'>Create New Infrastructure</h1>
                    <p className='text-gray-300 mt-2'>Start by selecting a cloud provider to deploy your application</p>
                </>
            }
            <h3 className='text-2xl font-bold text-white'>
                <span className='font-bold text-red-500'>Fusion Cloud</span>
            </h3>


            { Images.length !== 0 && InstanceTypes.length !== 0 && Networks.length !== 0 && <AWSSelector setForm={setForm} form={form} setPage={setPage} page={page} setSecurityGroups={setSecurityGroups} securityGroups={securityGroups} setSecurityGroup={setSecurityGroup} securityGroup={securityGroup} outboundrules={outboundrules} setOutboundRules={setOutboundRules} Images={Images} Flavor={InstanceTypes} Network={Networks}/>}




            {page === 2 &&
                <>
                    <h1 className='text-2xl font-bold text-white' id="process">Provisioning Infrastructure</h1>
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

                        {process[8].status === 'completed' && process[8].success &&
                            <div className='flex flex-col gap-4 mt-4 bg-temp2 p-4 rounded border border-temp'>
                                <h1 className='text-2xl font-bold text-white text-center'>Infrastructure Details</h1>
                                <div className={`w-full text-sm text-white  mx-auto flex rounded flex-row gap-4 justify-between border border-temp p-4  align-center items-center`}>
                                    <div>Public IP : {VMDetails.instancePublicIP || 'Not Available'}</div>
                                    <div>Private IP : {VMDetails.instancePrivateIP || 'Not Available'}</div>
                                </div>
                                <div className={`w-full text-sm text-white  mx-auto flex rounded flex-row gap-4 justify-between border border-temp p-4 align-center items-center`}>
                                    <div>Instance Name : {VMDetails.instanceName || 'Not Available'}</div>
                                    <div>VPC : {VMDetails.instanceVPC || 'Not Available'}</div>
                                </div>
                                <div className={`w-full text-sm text-white  mx-auto flex  rounded flex-row gap-4 justify-between border border-temp p-2 pl-4 pr-4 align-center items-center`}>
                                    <div>Security Group : {VMDetails.instanceSecurityGroup || 'Not Available'}</div>
                                    <div className='flex flex-row gap-4 items-center'>
                                        <p>Download SSH Key: </p>
                                        <button className="inline-flex items-center border b-1 border-rose-500 text-white py-2 px-5 focus:outline-none hover:bg-rose-500 rounded text-sm mt-4 md:mt-0 disabled:bg-rose-200 disabled:cursor-not-allowed"
                                            disabled={VMDetails.sshKey === ''}
                                            onClick={DownloadSSHKey}
                                        >Download</button>
                                    </div>
                                </div>
                                <div className={`w-full text-sm text-white  mx-auto flex  rounded flex-row gap-4 justify-between border border-temp p-2 pl-4 pr-4 align-center items-center`}>
                                    <p>Connect your instance: </p>
                                </div>
                            </div>
                        }


                    </div>
                </>
            }

            {
                page === 1 &&
                <div className="flex flex-row gap-4 bg-temp2 flex-end mt-4 rounded float-right">
                    <button className="bg-current text-temp2 py-2 px-4 rounded hover:bg-temp2 hover:text-white hover:border-current hover:border"
                        disabled={disabled}
                        onClick={() => {
                            SubmitForm()
                        }}>
                        Submit
                    </button>
                </div>
            }
        </div >
    )
}
