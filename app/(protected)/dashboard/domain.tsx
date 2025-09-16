'use client'
import { useCurrentUser } from '@/hooks/use-current-user';
import axios from 'axios';
import { Nunito } from 'next/font/google';
import React, { useEffect } from 'react';
import Confetti from 'react-confetti';
import Notify from '../_components/notify';
import { ReverseProxy } from '../_apis/deployApis';
const nunito = Nunito({ subsets: ['latin'] })



export default function domain() {

    const [loading, setLoading] = React.useState(false)
    const [infrastructures, setInfrastructures] = React.useState<any>([])
    const [selectedInfra, setSelectedInfra] = React.useState<any>('');
    const user = useCurrentUser();
    const [showConfetti, setShowConfetti] = React.useState(false);


    const getInfrastructures = async () => {
        const response = await axios.post('/api/getInfrastructures', { userId: user?.id });
        if (response.data.infrastructures) {
            setInfrastructures(response.data.infrastructures);
        }
    };

    useEffect(() => {
        getInfrastructures();
    }, [])

    const [formData, setFormData] = React.useState({
        domain: '',
        port: 0,
    })

    const Configure = async () => {
        if (selectedInfra === '') {
            Notify({ type: 'error', message: 'Select Infrastructure' , description: 'Select Infrastructure' })
            return
        }
        if (formData.domain === '' || formData.port === 0) {
            Notify({ type: 'error', message: 'Add Domain and Port' , description: 'Add Domain and Port' })
            return
        }

        const response = await ReverseProxy(infrastructures[selectedInfra].publicIp, '22', 'root', infrastructures[selectedInfra].sshKey, formData.port, formData.domain);
        console.log(response)
    }


    return (
        <div>
            <div className={`flex flex-col justify-center ${nunito.className}`}>
                {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

                <h1 className='text-2xl font-bold text-white mt-4' >Configure Domain</h1>
                <p className='text-gray-500'> Configure your domain to point to your server</p>

                <div className='mt-8'>
                    <h1 className='text-2xl font-bold text-white mt-4' >MongoDB</h1>
                    <p className='text-gray-500'>Add your MongoDB credentials</p>

                    {infrastructures.length === 0 && <p className='text-white'>No Infrastructures</p>}
                    {infrastructures.length > 0 && <p className='text-white font-bold text-xl mt-4'>Select Infrastructure</p>}
                    {infrastructures.length > 0 &&
                        <div className='flex flex-row gap-4 items-center mt-4 '>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 w-full'>
                                {infrastructures.map((infra: any, index: number) => (
                                    <div key={index} className={`p-4 rounded shadow-lg h-[8rem] flex flex-col justify-between border-2 border-green-500 overflow-hidden cursor-pointer ${selectedInfra === index && 'border-2 border-yellow-500'}`} onClick={() => setSelectedInfra(index)}>
                                        <h1 className={`text-2xl font-bold text-green-500`}>{infra.provider + ' - ' + infra.instanceName}</h1>
                                        <div className='text-white mt-4 text-lg'>
                                            {infra.publicIp}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                </div>

                <div className='mt-8'>
                    <h1 className='text-2xl font-bold text-white mt-4' >Domain</h1>
                    <p className='text-gray-500'>Add your domain and port</p>

                    <div className='flex flex-col gap-4 mt-4'>
                        <input type="text" placeholder='Domain' className='p-4 border text-white border-temp bg-temp2 text-bold rounded' value={formData.domain} onChange={(e) => setFormData({ ...formData, domain: e.target.value })} />
                        <input type="number" placeholder='Port' className='p-4 border text-white border-temp bg-temp2 text-bold rounded' value={formData.port} onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })} />
                    </div>
                </div>

                <div className='mt-8 flex flex-row gap-4 flex-end items-end justify-end'>
                    <button className='bg-green-500 p-4 text-white rounded font-bold w-36 text-center' onClick={Configure}>Configure</button>
                </div>


            </div>



        </div>
    )
}
