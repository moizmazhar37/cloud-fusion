'use client'
import React from 'react'
import { Nunito } from 'next/font/google';
const nunito = Nunito({ subsets: ['latin'] })
import Confetti from 'react-confetti'
import axios from 'axios'
import { useEffect } from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { DeployServices } from '../_apis/deployApis';
import Notify from '../_components/notify';

export default function domain() {

    const [mongoDbForm, setMongoDbForm] = React.useState({
        username: '',
        password: ''
    })
    const [mySqlForm, setMySqlForm] = React.useState({
        password: ''
    })
    const [postgreSqlForm, setPostgreSqlForm] = React.useState({
        username: '',
        password: ''
    })
    const [mariaDbForm, setMariaDbForm] = React.useState({
        rootpassword: '',
        database: '',
        username: '',
        password: ''
    })
    const [redisForm, setRedisForm] = React.useState({
        password: ''
    })

    const [showConfetti, setShowConfetti] = React.useState(false)

    const [selectedDatabase, setSelectedDatabase] = React.useState('')

    const [loading, setLoading] = React.useState(false)
    const [infrastructures, setInfrastructures] = React.useState<any>([])
    const [selectedInfra, setSelectedInfra] = React.useState<any>('');

    const Deploy = async () => {
        setLoading(true)

        const publicip = infrastructures[selectedInfra].publicIp
        const machineusername = infrastructures[selectedInfra].username;
        const sshKey = infrastructures[selectedInfra].sshKey;
        const GetServiceName = (name: string) => {
            if (name === 'MongoDB') {
                return 'MONGODB'
            }
            if (name === 'MySQL') {
                return 'MYSQL'
            }
            if (name === 'PostgreSQL') {
                return 'POSTGRES'
            }
            if (name === 'MariaDB') {
                return 'MARIADB'
            }
            if (name === 'Redis') {
                return 'REDIS'
            }
            return ''
        }
        let config = {}
        const GetConfig = (name: string) => {
            if (name === 'MongoDB') {
                config = {
                    username: mongoDbForm.username,
                    password: mongoDbForm.password
                }
                return config
            }
            if (name === 'MySQL') {
                config = {
                    password: mySqlForm.password
                }
                return config
            }
            if (name === 'PostgreSQL') {
                config = {
                    username: postgreSqlForm.username,
                    password: postgreSqlForm.password
                }
                return config
            }
            if (name === 'MariaDB') {
                config = {
                    rootpassword: mariaDbForm.rootpassword,
                    database: mariaDbForm.database,
                    username: mariaDbForm.username,
                    password: mariaDbForm.password
                }
                return config
            }
            if (name === 'Redis') {
                config = {
                    password: redisForm.password
                }
                return config
            }
        }
        const response = await DeployServices(publicip, '22', machineusername, sshKey, GetConfig(selectedDatabase), GetServiceName(selectedDatabase));
        if (response.success) {
            setTimeout(() => {
                setLoading(false)
                setShowConfetti(true)
                setSelectedDatabase('')
                setTimeout(() => {
                    setShowConfetti(false)
                }, 10000)
            }, 2000)
            Notify({ type: 'success', message: 'Success', description: "Successfully deployed" })
        }
        else {
            setLoading(false)
            Notify({ type: 'error', message: 'Error', description: "Error while deploying" })
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
        getInfrastructures();
    }, [])


    return (
        <>
            {loading ? (
                <div className='h-screen w-full flex justify-center items-center'>
                    <div className='bg-white p-8 rounded shadow-lg'>
                        <h1 className='text-2xl font-bold text-black'>Deploying</h1>
                        <p className='text-gray-500'>Please wait while we deploy your database</p>
                    </div>
                </div>
            ) : (
                <div className={`flex flex-col justify-center ${nunito.className}`}>
                    {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

                    <h1 className='text-2xl font-bold text-white mt-4' >Add Database to your Infrastructure</h1>
                    <p className='text-gray-500'>Add your domain name to your application</p>

                    {selectedDatabase === '' && (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {Databases.map((database, index) => (
                                <div key={index} className={`p-4 rounded shadow-lg h-[13rem] flex flex-col justify-between border-2 border-${database.color} overflow-hidden cursor-pointer`} onClick={() => setSelectedDatabase(database.name)}>
                                    <h1 className={`text-2xl font-bold text-${database.color}`}>{database.name}</h1>
                                    <div className='text-white mt-4 text-lg'>
                                        {database.description}
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <img src={`${database.image}`} alt="image" width={90} height={90} />
                                        <button className={`bg-white text-${database.color} font-bold px-4 py-2 rounded mt-4 hover:bg-${database.color}-200 hover:text-white transition duration-300`}> Deploy {database.name} </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}


                    {selectedDatabase === 'MongoDB' && (
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

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                                <input type="text" placeholder='Username' className='px-4 py-2 rounded text-white border border-temp bg-temp font-bold' value={mongoDbForm.username} onChange={(e) => setMongoDbForm({ ...mongoDbForm, username: e.target.value })} />
                                <input type="text" placeholder='Password' className='px-4 py-2 rounded text-white border border-temp bg-temp font-bold' value={mongoDbForm.password} onChange={(e) => setMongoDbForm({ ...mongoDbForm, password: e.target.value })} />
                            </div>
                            <div className='flex justify-end flex-end items-end gap-4'>
                                <button className='bg-green-500 text-white font-bold px-4 py-2 rounded mt-4 hover:bg-red-600 transition duration-300' onClick={Deploy}>Deploy</button>
                                <button className='w-24 bg-rose-500 text-white font-bold px-4 py-2 rounded mt-4 hover:bg-gray-600 transition duration-300' onClick={() => setSelectedDatabase('')}>Back</button>
                            </div>
                        </div>
                    )}

                    {selectedDatabase === 'MySQL' && (
                        <div className='mt-8'>
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

                            <h1 className='text-2xl font-bold text-white mt-4' >MySQL</h1>
                            <p className='text-gray-500'>Add your MySQL credentials</p>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                                <input type="text" placeholder='Password' className='px-4 py-2 rounded text-white border border-temp bg-temp font-bold' value={mySqlForm.password} onChange={(e) => setMySqlForm({ ...mySqlForm, password: e.target.value })} />
                            </div>
                            <div className='flex justify-end flex-end items-end gap-2'>
                                <button className='bg-blue-500 text-white font-bold px-4 py-2 rounded mt-4 hover:bg-red-600 transition duration-300' onClick={Deploy}>Deploy</button>
                                <button className='w-24 bg-rose-500 text-white font-bold px-4 py-2 rounded mt-4 hover:bg-gray-600 transition duration-300' onClick={() => setSelectedDatabase('')}>Back</button>
                            </div>
                        </div>
                    )}

                    {selectedDatabase === 'PostgreSQL' && (
                        <div className='mt-8'>
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
                            <h1 className='text-2xl font-bold text-white mt-4' >PostgreSQL</h1>
                            <p className='text-gray-500'>Add your PostgreSQL credentials</p>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                                <input type="text" placeholder='Username' className='px-4 py-2 rounded text-white border border-temp bg-temp font-bold' value={postgreSqlForm.username} onChange={(e) => setPostgreSqlForm({ ...postgreSqlForm, username: e.target.value })} />
                                <input type="text" placeholder='Password' className='px-4 py-2 rounded text-white border border-temp bg-temp font-bold' value={postgreSqlForm.password} onChange={(e) => setPostgreSqlForm({ ...postgreSqlForm, password: e.target.value })} />
                            </div>
                            <div className='flex justify-end flex-end items-end gap-2'>
                                <button className='bg-yellow-500 text-white font-bold px-4 py-2 rounded mt-4 hover:bg-red-600 transition duration-300' onClick={Deploy}>Deploy</button>
                                <button className='w-24 bg-rose-500 text-white font-bold px-4 py-2 rounded mt-4 hover:bg-gray-600 transition duration-300' onClick={() => setSelectedDatabase('')}>Back</button>
                            </div>
                        </div>
                    )}

                    {selectedDatabase === 'MariaDB' && (
                        <div className='mt-8'>
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
                            <h1 className='text-2xl font-bold text-white mt-4' >MariaDB</h1>
                            <p className='text-gray-500'>Add your MariaDB credentials</p>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                                <input type="text" placeholder='Root Password' className='px-4 py-2 rounded text-white border border-temp bg-temp font-bold' value={mariaDbForm.rootpassword} onChange={(e) => setMariaDbForm({ ...mariaDbForm, rootpassword: e.target.value })} />
                                <input type="text" placeholder='Database' className='px-4 py-2 rounded text-white border border-temp bg-temp font-bold' value={mariaDbForm.database} onChange={(e) => setMariaDbForm({ ...mariaDbForm, database: e.target.value })} />
                                <input type="text" placeholder='Username' className='px-4 py-2 rounded text-white border border-temp bg-temp font-bold' value={mariaDbForm.username} onChange={(e) => setMariaDbForm({ ...mariaDbForm, username: e.target.value })} />
                                <input type="text" placeholder='Password' className='px-4 py-2 rounded text-white border border-temp bg-temp font-bold' value={mariaDbForm.password} onChange={(e) => setMariaDbForm({ ...mariaDbForm, password: e.target.value })} />
                            </div>
                            <div className='flex justify-end flex-end items-end gap-2'>
                                <button className='bg-orange-500 text-white font-bold px-4 py-2 rounded mt-4 hover:bg-red-600 transition duration-300' onClick={Deploy}>Deploy</button>
                                <button className='w-24 bg-rose-500 text-white font-bold px-4 py-2 rounded mt-4 hover:bg-gray-600 transition duration-300' onClick={() => setSelectedDatabase('')}>Back</button>
                            </div>
                        </div>
                    )}

                    {selectedDatabase === 'Redis' && (
                        <div className='mt-8'>
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

                            <h1 className='text-2xl font-bold text-white mt-4' >Redis</h1>
                            <p className='text-gray-500'>Add your Redis credentials</p>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                                <input type="text" placeholder='Password' className='px-4 py-2 rounded text-white border border-temp bg-temp font-bold' value={redisForm.password} onChange={(e) => setRedisForm({ ...redisForm, password: e.target.value })} />
                            </div>
                            <div className='flex justify-end flex-end items-end gap-2'>
                                <button className='bg-red-500 text-white font-bold px-4 py-2 rounded mt-4 hover:bg-red-600 transition duration-300' onClick={Deploy}>Deploy</button>
                                <button className='w-24 bg-rose-500 text-white font-bold px-4 py-2 rounded mt-4 hover:bg-gray-600 transition duration-300' onClick={() => setSelectedDatabase('')}>Back</button>
                            </div>
                        </div>
                    )}


                </div>
            )}
        </>

    )
}


const Databases = [
    {
        name: 'MongoDB',
        description: 'MongoDB is a general purpose, document-based, distributed database built for modern application developers and for the cloud era.',
        image: '/mongo.svg',
        color: 'green-500'
    },
    {
        name: 'MySQL',
        description: 'MySQL is an open-source relational database management system.',
        image: '/mysql.svg',
        color: 'blue-500'
    },
    {
        name: 'PostgreSQL',
        description: 'PostgreSQL is a powerful, open source object-relational database system with over 30 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance.',
        image: '/postgresql.svg',
        color: 'yellow-500'
    },
    {
        name: 'MariaDB',
        description: 'MariaDB is a community-developed, commercially supported fork of the MySQL relational database management system, intended to remain free and open-source software under the GNU.',
        image: '/mariadb.svg',
        color: 'orange-500'
    },
    {
        name: 'Redis',
        description: 'Redis is an open-source, in-memory data structure store, used as a database, cache, and message broker.',
        image: '/redis.svg',
        color: 'red-500'
    },
]



