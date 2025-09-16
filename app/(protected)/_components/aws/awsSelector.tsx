
import React from 'react'
import { AWSSelectorProps } from '@/app/Interfaces/awsInterfaces'

export default function AWSSelector ({ setForm, form, page, setSecurityGroups, securityGroups, setSecurityGroup, securityGroup, outboundrules, setOutboundRules }: AWSSelectorProps){

    return (<>
        <div hidden={page !== 1}>
            <p className='text-gray-300 mt-2'>Start by entering your AWS credentials</p>
            <div className='flex flex-row gap-x-4 mt-4 mb-4'>
                <div className='w-1/2 flex flex-col gap-y-4 mt-4 border border-temp p-4 rounded'>
                    <div className='flex flex-col gap-y-2'>
                        <label className='text-white'>Access Key</label>
                        <input type='text' className='p-3 rounded border border-temp bg-temp2 text-white ' placeholder='Enter your access key' onChange={(e) => setForm({ ...form, accessKey: e.target.value })} />
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <label className='text-white'>Secret Key</label>
                        <input type='text' className='p-3 rounded border border-temp bg-temp2 text-white' placeholder='Enter your secret key' onChange={(e) => setForm({ ...form, secretKey: e.target.value })} />
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
                            <option value="" disabled>Select OS</option>
                            <option value='ami-05fb0b8c1424f266b'>Ubuntu 22.04 LTS (64 bit x86)</option>
                            <option value='ami-0748d13ffbc370c2b'>Ubuntu 22.04 LTS (64 bit ARM)</option>
                            <option value='ami-07b36ea9852e986ad'>Ubuntu 20.04 LTS (64 bit x86)</option>
                            <option value='ami-06b74af9fe7907906'>Ubuntu 20.04 LTS (64 bit ARM)</option>
                            <option value='ami-0bddc40b31973ff95'>Ubuntu Pro (64 bit x86)</option>
                            <option value='ami-0c7e203bbcd5a0dc7'>Ubuntu Pro (64 bit ARM)</option>
                        </select>
                    </div>
                </div>
            </div>
            <p className='text-gray-300 mt-4'>Choose Pricing Model and VM Spacifications </p>
            <div className='flex flex-row gap-x-4 mt-4'>
                <div className='w-1/2 flex flex-col gap-y-4 mt-4 border border-temp p-4 rounded'>
                    <div className='flex flex-col gap-y-2'>
                        <label className='text-white'>Pricing Model</label>
                        <select className='p-3 rounded border border-temp bg-temp2 text-white' onChange={(e) => setForm({ ...form, pricingModel: e.target.value })}
                            value={form.pricingModel}
                        >
                            <option value="" disabled>Select Pricing Model</option>
                            <option value='on-demand'>On-Demand</option>
                            <option value='reserved'>Reserved</option>
                            <option value='spot'>Spot</option>
                        </select>
                    </div>

                    <div className='flex flex-col gap-y-2'>
                        <label className='text-white'>Instance Type</label>
                        <select className='p-3 rounded border border-temp bg-temp2 text-white' onChange={(e) => setForm({ ...form, instanceType: e.target.value })}
                            value={form.instanceType}
                        >
                            <option value="" disabled>Select Instance Type</option>
                            <option value='t2.micro'>t2.micro</option>
                            <option value='t2.small'>t2.small</option>
                            <option value='t2.medium'>t2.medium</option>
                            <option value='t2.large'>t2.large</option>
                            <option value='t2.xlarge'>t2.xlarge</option>
                            <option value='t2.2xlarge'>t2.2xlarge</option>
                            <option value='c4.large'>c4.large</option>
                        </select>
                    </div>
                </div>
                <div className='w-1/2 flex flex-col gap-y-4 mt-4 border border-temp p-4 rounded'>
                    <div className='flex flex-col gap-y-2'>
                        <label className='text-white'>Storage</label>
                        <input type='number' className='p-3 rounded border border-temp bg-temp2 text-white' placeholder='Enter your storage' onChange={(e) => setForm({ ...form, storage: parseInt(e.target.value, 10) || 0 })} />
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <label className='text-white'>Region and Availability Zone</label>
                        <select className='p-3 rounded border border-temp bg-temp2 text-white' onChange={(e) => setForm({ ...form, region: e.target.value })}
                            value={form.region}
                        >
                            <option value="" disabled>Select Region</option>
                            <option value='us-east-1'>US East (N. Virginia)</option>
                            <option value='us-east-2'>US East (Ohio)</option>
                            <option value='us-west-1'>US West (N. California)</option>
                            <option value='us-west-2'>US West (Oregon)</option>
                            <option value='af-south-1'>Africa (Cape Town)</option>
                            <option value='ap-east-1'>Asia Pacific (Hong Kong)</option>
                            <option value='ap-south-1'>Asia Pacific (Mumbai)</option>
                            <option value='ap-northeast-3'>Asia Pacific (Osaka-Local)</option>
                            <option value='ap-northeast-2'>Asia Pacific (Seoul)</option>
                            <option value='ap-southeast-1'>Asia Pacific (Singapore)</option>
                            <option value='ap-southeast-2'>Asia Pacific (Sydney)</option>
                            <option value='ap-northeast-1'>Asia Pacific (Tokyo)</option>
                            <option value='ca-central-1'>Canada (Central)</option>
                            <option value='eu-central-1'>Europe (Frankfurt)</option>
                            <option value='eu-west-1'>Europe (Ireland)</option>
                            <option value='eu-west-2'>Europe (London)</option>
                            <option value='eu-south-1'>Europe (Milan)</option>
                            <option value='eu-west-3'>Europe (Paris)</option>
                            <option value='eu-north-1'>Europe (Stockholm)</option>
                            <option value='me-south-1'>Middle East (Bahrain)</option>
                            <option value='sa-east-1'>South America (São Paulo)</option>
                        </select>
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
                        onClick={() => setSecurityGroups([...securityGroups, securityGroup])}
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
                            {securityGroups.map((securityGroup, index) => (
                                <tr key={index} className='bg-temp2 rounded text-white border border-temp'>
                                    <td className='text-white p-1'>{securityGroup.name}</td>
                                    <td className='text-white p-1'>{securityGroup.description}</td>
                                    <td className='text-white p-1'>{securityGroup.port}</td>
                                    <td className='text-white p-1 text-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-orange-500" onClick={() => setSecurityGroups(securityGroups.filter((_, i) => i !== index))}>
                                            <path stroke-linecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            <div className='bg-orange-500 p-2 rounded mt-4 text-white text-center'>
                <h3>Outbound Rules</h3>
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
                        onClick={() => setOutboundRules([...outboundrules, securityGroup])}
                    >
                        Add Rule
                    </button>
                </div>
                <div className='w-full flex flex-col mt-4 border border-temp p-4 rounded items-bottom gap-y-4'>
                    <table className='w-full rounded border border-temp'>
                        <thead>
                            <tr className='rounded bg-orange-200 text-white'>
                                <th className='text-left text-black p-1'>Name</th>
                                <th className='text-left text-black p-1'>Description</th>
                                <th className='text-left text-black p-1'>Port</th>
                                <th className='text-left text-black p-1'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {outboundrules.map((securityGroup, index) => (
                                <tr key={index} className='bg-temp2 rounded text-white border border-temp'>
                                    <td className='text-white p-1'>{securityGroup.name}</td>
                                    <td className='text-white p-1'>{securityGroup.description}</td>
                                    <td className='text-white p-1'>{securityGroup.port}</td>
                                    <td className='text-white p-1 text-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-orange-500" onClick={() => setSecurityGroups(securityGroups.filter((_, i) => i !== index))}>
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

