import AWSHandler from './aws/awsHandler'
import FusionCloud from './fusioncloud/fusioncloud'
import CloudProviders from './provider'
import AzureHandler from './azure/azureHandler'

export default function Infrastructure({
    infrastructure,
    setinfrastructure,
}: {
    infrastructure: string,
    setinfrastructure: any,
}) {

    useEffect(() => {
        setinfrastructure('')
        window.scrollTo(0, 0)
    }, [])


    return (
        <div className='p-2 h-screen scroll'>

            {infrastructure === '' ?
                <>
                    <div className='flex flex-row mt-4 justify-between gap-4 w-full'>
                        <CloudProviders infrastructure={infrastructure} setinfrastructure={setinfrastructure} infrastructureName='AWS' color='orange' logo='/aws-svgrepo-com.svg' description='Amazon Web Services (AWS) is a preferred choice for deploying applications due to its unmatched scalability, global infrastructure, and extensive service portfolio. Offering top-notch security, cost-effectiveness, and seamless integration, AWS empowers developers to build and deploy applications with ease, ensuring reliability, innovation, and a robust community for support.' />
                        <CloudProviders infrastructure={infrastructure} setinfrastructure={setinfrastructure} infrastructureName='Digital Ocean' color='blue' logo='/digitalocean.svg' description='DigitalOcean is a cloud infrastructure provider that offers a range of services to help you deploy, manage, and scale applications. With a focus on simplicity and ease of use, DigitalOcean provides a user-friendly interface and a wide range of tutorials and documentation to help you get started with your projects.' />
                    </div>
                    <div className='flex flex-row mt-4 justify-between gap-4 w-full'>
                        <CloudProviders infrastructure={infrastructure} setinfrastructure={setinfrastructure} infrastructureName='Azure' color='blue' logo='/azure.svg' description='Microsoft Azure is a cloud computing platform that offers a wide range of services to help you build, deploy, and manage applications. With a focus on security, compliance, and privacy, Azure provides a range of tools and services to help you build and manage applications with ease.' />
                        <CloudProviders infrastructure={infrastructure} setinfrastructure={setinfrastructure} infrastructureName='FusionCloud' color='rose' logo='/openstack.svg' description='FusionCloud is a private cloud platform that offers a range of services to help you build, deploy, and manage applications. With a focus on security, compliance, and privacy, FusionCloud provides a range of tools and services to help you build and manage applications with ease.' />
                    </div>
                </>
                :
                <>
                    {infrastructure === 'AWS' &&
                        <AWSHandler />
                    }
                    {infrastructure === 'Digital Ocean' &&
                        <DOHandler />
                    }
                    {infrastructure === 'Azure' &&
                        <AzureHandler />
                    }
                    {infrastructure === 'FusionCloud' &&
                        <FusionCloud />
                    }
                </>
            }
        </div>
    )
}

import { useEffect, useRef, useState } from 'react'

import { CleanUp, GenerateExecutionPlan, GenerateProcess } from '@/app/(protected)/_apis/awsApis'
import { useCurrentUser } from '@/hooks/use-current-user'
import CompletedIcon from './icons/completedIcon'
import ErrorIcon from './icons/errorIcon'
import LoadingIcon from './icons/loadingIcon'
import Notify from './notify'

import { DigitalOceanDropdowns, DigitalOceanImages, DigitalOceanRegions, awsInfrastuctureProcess } from '@/app/utils/digitalOceanToggles'
import { notification } from 'antd'
import axios from 'axios'
import Confetti from 'react-confetti'
import { EstablishProvider, GenerateDigitalOceanInstance, GetDOData, RunningConfig } from '@/app/(protected)/_apis/digitalOceanApis'

function DOHandler() {

    const [form, setForm] = useState({
        machineName: '',
        region: '',
        token: '',
        size: '',
        storage: 0,
        osImage: '',
        backups: false,
        monitoring: false,
    })

    const SubmitForm = () => {  
        if (form.token === '' || form.region === '' || form.machineName === '' || form.osImage === '' || form.storage === 0 || form.size === '' ) {
            Notify({ type: 'error', message: 'Error', description: 'Please fill all the fields' });
            return;
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

            if (stepIndex === 0) {
                directoryName = response.directory;
                key = response.key;
            }
            process[stepIndex].status = 'completed';
            process[stepIndex].success = response.success;
            process[stepIndex].result = response.success ? successMessage : response.message;

            setProcess([...process]);
            console.log('Response:', response);

            if (!response.success) {
                process[stepIndex].result = response.description ? response.description : response.message;
                setProcess([...process]);
                return false;
            }

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
        //validate form
        document.getElementById('process')?.scrollIntoView({ behavior: "smooth" });
        setDisabled(true);

        try {
            const responseStep1 = await executeStep(0, GenerateProcess, "Process Directory Created Successfully");
            if (!responseStep1) { return; }
            setProcess([...process]);
            const responseStep2 = await executeStep(1, () => EstablishProvider('DigitalOcean', directoryName), "Provider Established Successfully");
            if (!responseStep2) { return; }

            setProcess([...process]);
            const responseStep3 = await executeStep(2, () => RunningConfig(directoryName, key, form.token, form.region, form.machineName,  form.size, form.storage, form.osImage, form.backups, form.monitoring), "Configurations Generated Successfully");
            if (!responseStep3) { return; }

            setProcess([...process]);

            const responseStep4 = await executeStep(3, () => GenerateDigitalOceanInstance(directoryName, key), "Digital Ocean Instance Created Successfully");
            if (!responseStep4) { return; }

            setProcess([...process]);

            const responseStep5 = await executeStep(4, () => GenerateExecutionPlan(directoryName, "terraform plan"), "Plan Generation Successful");
            if (!responseStep5) { return; }

            setProcess([...process]);

            const responseStep6 = await executeStep(5, () => GenerateExecutionPlan(directoryName, "terraform apply -auto-approve"), "Plan execution Successful");
            if (!responseStep6) { return; }

            setProcess([...process]);

            const responseStep7 = await executeStep(6, () => GetDOData(directoryName, key), "Fetched VM Details Successfully");
            if (!responseStep7) { return; }

            setProcess([...process]);

            const responseStep8 = await executeStep(7, () => CleanUp(directoryName), "Cleaning Up");
            if (!responseStep8) { return; }

            setProcess([...process]);

            process[8].status = 'completed';
            process[8].success = true;
            process[8].result = "Completed";
            setProcess([...process]);

            const responseFinal = await executeStep(8, async () => {
                const newForm = {
                    userId: currentUser?.id,
                    provider: "Digital Ocean",
                    sshKey: savedResponse.sshKey,
                    publicIp: savedResponse.instancePublicIP,
                    privateIp: savedResponse.instancePrivateIP,
                    username: "root",
                    instanceName: savedResponse.instanceName,
                    vpc: savedResponse.instanceVPC,
                    securityGroup: savedResponse.instanceSecurityGroup,
                    operatingSystem: form.osImage,
                    region: form.region,
                    instanceType: form.size,
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
            <h3 className='text-2xl font-bold text-white mt-3'>
                <span className='font-bold text-blue-500'>Digital Ocean</span>
            </h3>

            <DoSelector setForm={setForm} form={form} setPage={setPage} page={page} />

            {page === 2 &&
                <>
                    <h1 className='text-2xl font-bold text-white' id="process">Provisioning Infrastructure</h1>
                    <div className='flex flex-col gap-4 mt-4 w-full overflow-hidden'>
                        {process.map((process: any, index: number) => {
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
                                        <div className='flex flex-row gap-4 items-center flex-end'>ssh -i "cloudFusion.pem" root@{VMDetails.instancePublicIP}</div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"
                                            onClick={() => {
                                                navigator.clipboard.writeText(`chmod 600 fusion-key.pem && ssh -i "fusion-key.pem" root@${VMDetails.instancePublicIP}`) 
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



function DoSelector({ setForm, form, setPage, page }: { setForm: any, form: any, setPage: any, page: any }) {
    return (
        <>
            <div hidden={page !== 1}>
                <p className='text-gray-300 mt-2'>Start by entering your AWS credentials</p>
                <div className='flex flex-row gap-x-4 mt-4 mb-4'>
                    <div className='w-1/2 flex flex-col gap-y-4 mt-4 border border-temp p-4 rounded'>
                        <div className='flex flex-col gap-y-2'>
                            <label className='text-white'>Digital Ocean Token</label>
                            <input type='text' className='p-3 rounded border border-temp bg-temp2 text-white ' placeholder='Enter your digital ocean token' onChange={(e) => setForm({ ...form, token: e.target.value })} autoComplete='on' />
                        </div>
                        <div className='flex flex-col gap-y-2'>
                            <label className='text-white'>Region</label>
                            <select className='p-3 rounded border border-temp bg-temp2 text-white' onChange={(e) => setForm({ ...form, region: e.target.value })}
                                value={form.region}
                            >
                                <option value="" disabled>Select Region</option>
                                {Object.keys(DigitalOceanRegions).map((regionKey: string, index: number) => {
                                    return <option key={index} value={regionKey}>{(DigitalOceanRegions as any)[regionKey]}</option>
                                })}
                            </select>
                        </div>

                    </div>
                    <div className='w-1/2 flex flex-col gap-y-4 mt-4 border border-temp p-4 rounded'>
                        <div className='flex flex-col gap-y-2'>
                            <label className='text-white'>Machine Name</label>
                            <input type='text' className='p-3 rounded border border-temp bg-temp2 text-white' placeholder='Enter your machine name' onChange={(e) => setForm({ ...form, machineName: e.target.value })} />
                        </div>
                        <div className='flex flex-col gap-y-2'>
                            <label className='text-white'>Selecting Operating System</label>
                            <select className='p-3 rounded border border-temp bg-temp2 text-white' onChange={(e) => setForm({ ...form, osImage: e.target.value })}
                                value={form.osImage}
                            >
                                <option value="" disabled>Select Operating System</option>
                                {DigitalOceanImages.map((image: string, index: number) => {
                                    return <option key={index} value={image}>{image}</option>
                                })}
                            </select>
                        </div>
                    </div>
                </div>
                <p className='text-gray-300 mt-4'>Choose Storage and VM Spacifications </p>
                <div className='flex flex-row gap-x-4 mt-4 mb-4'>
                    <div className='w-1/2 flex flex-col gap-y-4 mt-4 border border-temp p-4 rounded'>
                        <div className='flex flex-col gap-y-2'>
                            <label className='text-white'>Storage (GB)</label>
                            <input type='number' className='p-3 rounded border border-temp bg-temp2 text-white' placeholder='Enter your storage' onChange={(e) => setForm({ ...form, storage: e.target.value })} />
                        </div>
                    </div>
                    <div className='w-1/2 flex flex-col gap-y-4 mt-4 border border-temp p-4 rounded'>
                        <div className='flex flex-col gap-y-2'>
                            <label className='text-white'>Selecting Pricing Model</label>
                            <select className='p-3 rounded border border-temp bg-temp2 text-white' onChange={(e) => setForm({ ...form, pricingModel: e.target.value })}
                                value={form.pricingModel}
                            >
                                <option value="">Select Pricing Model</option>
                                <option value="Basic" >Basic</option>
                                <option value="Premium Intel">Premium Intel</option>
                                <option value="Premium AMD">Premium AMD</option>
                            </select>
                        </div>

                        <label className='text-white'>Selecting Instance Type</label>
                        <select className='p-3 rounded border border-temp bg-temp2 text-white' onChange={(e) => setForm({ ...form, size: e.target.value })}
                            value={form.size}
                        >
                            <option value="" disabled>Select Instance Type</option>
                            {form.pricingModel && Object.keys((DigitalOceanDropdowns as any)[form.pricingModel]).map((instanceType: string, index: number) => {
                                return <option key={index} value={(DigitalOceanDropdowns as any)[form.pricingModel][instanceType]}>{instanceType}</option>
                            })}
                        </select>
                    </div>
                </div>
                <p className='text-gray-300 mt-4'>Choose Backup and Monitoring</p>
                <div className='flex flex-row gap-x-4 mt-4 mb-4'>
                    <div className={`w-full flex flex-col gap-y-4 mt-4 border border-temp p-4 rounded cursor-pointer
                    ${form.backups ? 'bg-rose-500' : 'bg-temp2'}`}
                        onClick={() => setForm({ ...form, backups: !form.backups })}>
                        <div className='flex flex-col gap-y-2 text-white text-center'>Monitoring</div>
                    </div>
                    <div className={`w-full flex flex-col gap-y-4 mt-4 border border-temp p-4 rounded cursor-pointer
                    ${form.monitoring ? 'bg-rose-500' : 'bg-temp2'}
                    `} onClick={() => setForm({ ...form, monitoring: !form.monitoring })}>
                        <div className='flex flex-col gap-y-2 text-white text-center'>Backup</div>
                    </div>
                </div>
            </div>

        </>
    )
}
