import { useEffect, useRef, useState } from 'react'

import { CleanUp, GenerateExecutionPlan, GenerateProcess } from '@/app/(protected)/_apis/awsApis'
import { useCurrentUser } from '@/hooks/use-current-user'
import CompletedIcon from '../icons/completedIcon'
import ErrorIcon from '../icons/errorIcon'
import LoadingIcon from '../icons/loadingIcon'
import Notify from '../notify'

import { DigitalOceanDropdowns, DigitalOceanImages, DigitalOceanRegions, awsInfrastuctureProcess } from '@/app/utils/digitalOceanToggles'
import { notification } from 'antd'
import axios from 'axios'
import Confetti from 'react-confetti'
import { EstablishProvider, GenerateDigitalOceanInstance, GetDOData, RunningConfig } from '@/app/(protected)/_apis/digitalOceanApis'
import { SecurityGroup } from '@/app/Interfaces/awsInterfaces'
import { GenerateAzureInstance, GenerateAzureVar, GetAzureData } from '../../_apis/azureApis'

export default function DigitalOceanHandler() {
    const [form, setForm] = useState({
        region: '',
        subscription_id : '',
        client_id : '',
        client_secret : '',
        tenant_id : '',
        size : '',
        image : '',
        username: "adminuser",
        vpcAddress: '',
        subnetAddress: '',
    })

    const SubmitForm = () => {  
        if (form.region === '' || form.subscription_id === '' || form.client_id === '' || form.client_secret === '' || form.tenant_id === '' || form.size === '' || form.image === '' || form.username === '' || form.vpcAddress === '' || form.subnetAddress === '') {
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

            const responseStep2 = await executeStep(1, () => EstablishProvider('Azure', directoryName), "Provider Established Successfully");
            if (!responseStep2) { return; }
            setProcess([...process]);

            const responseStep3 = await executeStep(2, () => GenerateAzureVar(directoryName , form.region, key, form.subscription_id, form.client_id, form.client_secret, form.tenant_id, form.size, form.image, form.username), "Configurations Generated Successfully");
            if (!responseStep3) { return; }
            setProcess([...process]);

            const responseStep4 = await executeStep(3, () => GenerateAzureInstance(directoryName, key, form.vpcAddress, form.subnetAddress, securityGroups), "Azure Instance Created Successfully");
            if (!responseStep4) { return; }
            setProcess([...process]);

            const responseStep5 = await executeStep(4, () => GenerateExecutionPlan(directoryName, "terraform plan"), "Plan Generation Successful");
            if (!responseStep5) { return; }

            setProcess([...process]);

            const responseStep6 = await executeStep(5, () => GenerateExecutionPlan(directoryName, "terraform apply -auto-approve"), "Plan execution Successful");
            if (!responseStep6) { return; }

            setProcess([...process]);

            const responseStep7 = await executeStep(6, () => GetAzureData(directoryName, key), "Fetched VM Details Successfully");
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
                    provider: "Azure",
                    sshKey: savedResponse.sshKey,
                    publicIp: savedResponse.instancePublicIP,
                    privateIp: savedResponse.instancePrivateIP,
                    username: form.username,
                    instanceName: savedResponse.instanceName,
                    vpc: savedResponse.instanceVPC,
                    securityGroup: savedResponse.instanceSecurityGroup,
                    operatingSystem: form.image,
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

    const [securityGroup, setSecurityGroup] = useState<SecurityGroup>({
        name: '',
        description: '',
        port: 0
    })

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
                <span className='font-bold text-teal-500'>Azure</span>
            </h3>

            <DoSelector setForm={setForm} form={form} setPage={setPage} page={page} setSecurityGroups={setSecurityGroups} setSecurityGroup={setSecurityGroup} securityGroup={securityGroup} securityGroups={securityGroups} />

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
                                        <div className='flex flex-row gap-4 items-center flex-end'>ssh -i "cloudFusion.pem" {form.username}@{VMDetails.instancePublicIP}</div>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"
                                            onClick={() => {
                                                navigator.clipboard.writeText(`chmod 600 fusion-key.pem && ssh -i "fusion-key.pem" ${form.username}root@${VMDetails.instancePublicIP}`) 
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



function DoSelector({ setForm, form, setPage, page , setSecurityGroups,  setSecurityGroup, securityGroup, securityGroups}: { setForm: any, form: any, setPage: any, page: any , setSecurityGroups: any, setSecurityGroup: any, securityGroup: any, securityGroups: any }) {
    return (
        <>
            <div hidden={page !== 1}>
                <p className='text-gray-300 mt-2'>Start by entering your Azure credentials</p>
                <div className='flex flex-row gap-x-4 mt-4 mb-4'>
                    <div className='w-1/2 flex flex-col gap-y-4 mt-4 border border-temp p-4 rounded'>
                        <div className='flex flex-col gap-y-2'>
                            <label className='text-white'>Subscription ID</label>
                            <input type='text' className='p-3 rounded border border-temp bg-temp2 text-white' placeholder='Enter your subscription id' onChange={(e) => setForm({ ...form, subscription_id: e.target.value })} />
                        </div>
                        <div className='flex flex-col gap-y-2'>
                            <label className='text-white'>Client ID</label>
                            <input type='text' className='p-3 rounded border border-temp bg-temp2 text-white' placeholder='Enter your client id' onChange={(e) => setForm({ ...form, client_id: e.target.value })} />
                        </div>

                    </div>
                    <div className='w-1/2 flex flex-col gap-y-4 mt-4 border border-temp p-4 rounded'>
                        <div className='flex flex-col gap-y-2'>
                            <label className='text-white'>Client Secret</label>
                            <input type='text' className='p-3 rounded border border-temp bg-temp2 text-white' placeholder='Enter your client secret' onChange={(e) => setForm({ ...form, client_secret: e.target.value })} />
                        </div>
                        <div className='flex flex-col gap-y-2'>
                            <label className='text-white'>Tenant ID</label>
                            <input type='text' className='p-3 rounded border border-temp bg-temp2 text-white' placeholder='Enter your tenant id' onChange={(e) => setForm({ ...form, tenant_id: e.target.value })} />
                        </div>
                    </div>
                </div>
                <p className='text-gray-300 mt-4'>Choose Configuration</p>
                <div className='flex flex-row gap-x-4 mt-4 mb-4'>
                    <div className='w-1/2 flex flex-col gap-y-4 mt-4 border border-temp p-4 rounded'>
                        <div className='flex flex-col gap-y-2'>
                            <label className='text-white'>Choose Region </label>
                            <select className='p-3 rounded border border-temp bg-temp2 text-white' onChange={(e) => setForm({ ...form, region: e.target.value })}
                                value={form.region}
                            >
                                <option value="" disabled>Select Region</option>
                                <option value="eastus" >East US</option>
                                <option value="westus">West US</option>
                                <option value="centralus">Central US</option>
                                <option value="southcentralus">South Central US</option>
                                <option value="eastus2">East US 2</option>
                                <option value="westus2">West US 2</option>
                                <option value="westcentralus">West Central US</option>
                                <option value="centraluseuap">Central US EUAP</option>
                                <option value="northcentralus">North Central US</option>
                                <option value="southcentralus">South Central US</option>
                                <option value="westcentralus">West Central US</option>
                            </select>
                        </div>
                        <div className='flex flex-col gap-y-2'>
                            <label className='text-white'>Selecting OS Image</label>
                            <select className='p-3 rounded border border-temp bg-temp2 text-white' onChange={(e) => setForm({ ...form, image: e.target.value })}
                                value={form.image}
                            >
                                <option value="" disabled>Select OS Image</option>
                                <option value="22_04-lts" >Ubuntu 22.04 LTS</option>
                                <option value="20_04-lts">Ubuntu 20.04 LTS</option>
                                <option value="18_04-lts">Ubuntu 18.04 LTS</option>
                                <option value="16_04-lts">Ubuntu 16.04 LTS</option>
                                <option value="20_10">Ubuntu 20.10</option>
                                <option value="21_04">Ubuntu 21.04</option>
                            </select>
                        </div>
                    </div>
                    <div className='w-1/2 flex flex-col gap-y-4 mt-4 border border-temp p-4 rounded'>
                        <div className='flex flex-col gap-y-2'>
                            <label className='text-white'>Selecting Size</label>
                            <select className='p-3 rounded border border-temp bg-temp2 text-white' onChange={(e) => setForm({ ...form, size: e.target.value })}
                                value={form.size}
                            >
                                <option value="" disabled>Select Instance Type</option>
                                <option value="Standard_F2" >Standard_F2</option>
                                <option value="Standard_D2s_v3">Standard_D2s_v3 [2 vCPUs, 8 GB RAM]</option>
                                <option value="Standard_D4s_v3">Standard_D4s_v3 [4 vCPUs, 16 GB RAM]</option>
                                <option value="Standard_D8s_v3">Standard_D8s_v3 [8 vCPUs, 32 GB RAM]</option>
                                <option value="Standard_D16s_v3">Standard_D16s_v3 [16 vCPUs, 64 GB RAM]</option>
                                <option value="Standard_D32s_v3">Standard_D32s_v3 [32 vCPUs, 128 GB RAM]</option>
                            </select>
                        </div>

                        <label className='text-white'>Enter Username </label>
                        <input type='text' className='p-3 rounded border border-temp bg-temp2 text-white' placeholder='Enter your username' onChange={(e) => setForm({ ...form, username: e.target.value })} value={form.username} />
                    </div>
                    <div className='w-1/2 flex flex-col gap-y-4 mt-4 border border-temp p-4 rounded'>
                        <div className='flex flex-col gap-y-2'>
                            <label className='text-white'>VPC Address</label>
                            <input type='text' className='p-3 rounded border border-temp bg-temp2 text-white' placeholder='Enter your VPC address' onChange={(e) => setForm({ ...form, vpcAddress: e.target.value })} />
                        </div>
                        <div className='flex flex-col gap-y-2'>
                            <label className='text-white'>Subnet Address</label>
                            <input type='text' className='p-3 rounded border border-temp bg-temp2 text-white' placeholder='Enter your subnet address' onChange={(e) => setForm({ ...form, subnetAddress: e.target.value })} />
                        </div>
                    </div>
                </div>


                <p className='text-gray-300 mt-4'>Ensure your security groups for Incoming and Outgoing traffic</p>
            <div className='bg-orange-500 p-2 rounded mt-4 text-white text-center'>
                <h3>Inbound Rules</h3>
            </div>
            <div className='w-full flex flex-row mt-4 border border-temp p-4 rounded items-bottom gap-x-4'>
                <div className='w-full flex flex-col gap-y-2'>
                    <label htmlFor='securityGroupName' className='text-white'>Security Group Name</label>
                    <input
                        type='text'
                        id='securityGroupName'
                        className='p-3 rounded border border-temp bg-temp2 text-white'
                        placeholder='Enter your security group name'
                        onChange={(e) => setSecurityGroup({ ...securityGroup, name: e.target.value })}
                    />
                    <div className='w-full flex flex-col gap-y-2'>
                        <label htmlFor='description' className='text-white'>Description</label>
                        <input
                            type='text'
                            id='description'
                            className='p-3 rounded border border-temp bg-temp2 text-white'
                            placeholder='Enter your description'
                            onChange={(e) => setSecurityGroup({ ...securityGroup, description: e.target.value })}
                        />
                    </div>
                    <div className='w-full flex flex-col gap-y-2'>
                        <label htmlFor='port' className='text-white'>Port</label>
                        <input
                            type='number'
                            id='port'
                            className='p-3 rounded border border-temp bg-temp2 text-white'
                            placeholder='Enter your port'
                            onChange={(e) => setSecurityGroup({ ...securityGroup, port: parseInt(e.target.value, 10) || 0 })}
                        />
                    </div>
                    <button

                        className='w-full border border-orange-500 bg-temp2 text-white py-3 px-4 rounded hover:bg-orange-200 hover:text-black float-bottom h-1/2 mt-8'
                        onClick={() =>  setSecurityGroups([...securityGroups, securityGroup])}
                    >
                        Add Rule
                    </button>
                </div>
                <div className='w-full flex flex-col mt-4 border border-temp p-4 rounded items-bottom gap-y-4'>
                    <table className='w-full rounded border border-temp p-1'>
                        <thead>
                            <tr className='rounded bg-orange-200 text-white'>
                                <th className='text-left text-black p-1'>Name</th>
                                <th className='text-left text-black p-1'>Description</th>
                                <th className='text-left text-black p-1'>Port</th>
                                <th className='text-left text-black p-1'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {securityGroups.map(({ name, description, port }: SecurityGroup, index: number) => (
                                <tr key={index} className='bg-temp2 rounded text-white border border-temp'>
                                    <td className='text-white p-1'>{name}</td>
                                    <td className='text-white p-1'>{description}</td>
                                    <td className='text-white p-1'>{port}</td>
                                    <td className='text-white p-1 text-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-orange-500" onClick={() => setSecurityGroups(securityGroups.filter((_item: any, i: number) => i !== index))}>
                                            <path stroke-linecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            </div>

        </>
    )
}
