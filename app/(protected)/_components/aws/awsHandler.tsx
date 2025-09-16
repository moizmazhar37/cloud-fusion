import React from 'react'
import { useState, useEffect, useRef } from 'react'
import AWSSelector from './awsSelector'
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

export default function AWSHandler (){

    const [form, setForm] = useState({
        machineName: '',
        accessKey: '',
        secretKey: '',
        osImage: '',
        region: '',
        pricingModel: '',
        instanceType: '',
        user: '',
        storage: 0
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

        if (form.accessKey === '') {
            Notify({ type: 'error', message: 'Error', description: 'Please enter your access key' })
            return
        }
        if (form.secretKey === '') {
            Notify({ type: 'error', message: 'Error', description: 'Please enter your secret key' })
            return
        }
        if (form.machineName === '') {
            Notify({ type: 'error', message: 'Error', description: 'Please enter your machine name' })
            return
        }
        if (form.osImage === '') {
            Notify({ type: 'error', message: 'Error', description: 'Please select your operating system' })
            return
        }
        if (form.region === '') {
            Notify({ type: 'error', message: 'Error', description: 'Please select your region' })
            return
        }
        if (form.pricingModel === '') {
            Notify({ type: 'error', message: 'Error', description: 'Please select your pricing model' })
            return
        }
        if (form.instanceType === '') {
            Notify({ type: 'error', message: 'Error', description: 'Please select your instance type' })
            return
        }
        if (form.storage === 0 || form.storage === null || form.storage === undefined || form.storage < 8) {
            Notify({ type: 'error', message: 'Error', description: 'Please enter your storage' })
            return
        }



        setPage(2)
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
                process[stepIndex].result = response.description ? response.description : response.message;
                setProcess([...process]);
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


            await sleep(2000);
            return true;
        } catch (error) {
            console.error(`Error during step ${stepIndex} execution:`, error);
            return false;
        }
    };

    const startExecution = async () => {
        document.getElementById('process')?.scrollIntoView({ behavior: "smooth" });

        try {
            const responseStep1 = await executeStep(0, GenerateProcess, "Process Directory Created Successfully");
            if (!responseStep1) { return; }
            console.log(key)
            const responseStep2 = await executeStep(1, () => RunningConfig(directoryName, form.accessKey, form.secretKey, form.region, form.machineName, form.osImage, form.instanceType, "ubuntu", form.storage ,key ), "Environment Configured Successfully");
            if (!responseStep2) { return; }

            const responseStep3 = await executeStep(2, () => GenerateAwsInstance(directoryName, key, securityGroups, outboundrules), "AWS Instance Configurations Generated Successfully");
            if (!responseStep3) { return; }

            const responseStep4 = await executeStep(3, () => EstablishProvider("AWS", directoryName), "AWS Provider Established Successfully");
            if (!responseStep4) { return; }

            const responseStep5 = await executeStep(4, () => GenerateExecutionPlan(directoryName, "terraform plan"), "Plan Generation Successful");
            if (!responseStep5) { return; }

            const responseStep6 = await executeStep(5, () => GenerateExecutionPlan(directoryName, "terraform apply -auto-approve"), "Plan execution Successful");
            if (!responseStep6) { return; }

            const responseStep7 = await executeStep(6, () => GetTerraformData(directoryName, key), "Fetching VM Details");
            if (!responseStep7) { return; }

            const responseStep8 = await executeStep(7, () => CleanUp(directoryName), "Cleaning Up");
            if (!responseStep8) { return; }

            process[8].status = 'completed';
            process[8].success = true;
            process[8].result = "Completed";
            setProcess([...process]);

            const responseFinal = await executeStep(8, async () => {
                const newForm = {
                    userId: currentUser?.id,
                    provider: "AWS",
                    sshKey: savedResponse.sshKey,
                    publicIp: savedResponse.instancePublicIP,
                    privateIp: savedResponse.instancePrivateIP,
                    username: "ubuntu",
                    instanceName: savedResponse.instanceName,
                    vpc: savedResponse.instanceVPC,
                    securityGroup: savedResponse.instanceSecurityGroup,
                    operatingSystem: form.osImage,
                    region: form.region,
                    instanceType: form.instanceType,                  
                };

                const finalResponse = await axios.post('/api/storeInfrastructure', { form: newForm });

                setShowConfetti(true);
                await sleep(8000);
                setShowConfetti(false);

                return {
                    success: finalResponse.status === 200,
                    message: finalResponse.status === 200 ? 'Infrastructure Provisioned Successfully' : 'Infrastructure Provisioning Failed'
                };
            }, "Infrastructure Provisioning Completed Successfully");


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
                <span className='font-bold text-orange-500'> AWS</span>
            </h3>



            <AWSSelector setForm={setForm} form={form} setPage={setPage} page={page} setSecurityGroups={setSecurityGroups} securityGroups={securityGroups} setSecurityGroup={setSecurityGroup} securityGroup={securityGroup} outboundrules={outboundrules} setOutboundRules={setOutboundRules} />




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
                                    <div className='flex flex-row gap-4 items-center flex-end'>
                                        <div className='flex flex-row gap-4 items-center flex-end'>ssh -i "cloudFusion.pem" ubuntu@ec2-{VMDetails.instancePublicIP.replace(".", "-")}.${form.region}.compute.amazonaws.com</div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"
                                            onClick={() => {
                                                navigator.clipboard.writeText(`chmod 600 fusion-key.pem && ssh -i "fusion-key.pem" ubuntu@$ec2-${VMDetails.instancePublicIP.replace(".", "-")}.${form.region}.compute.amazonaws.com`)
                                                notification.open(
                                                    {
                                                        message: "Copied",
                                                        description: "Copied to clipboard",
                                                        type: "success"
                                                    }
                                                )
                                            }}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                        </svg>
                                    </div>
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
