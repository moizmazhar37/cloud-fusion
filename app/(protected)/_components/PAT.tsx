import React from 'react';
import Image from 'next/image';
import PAT1 from '../../../public/PAT-1.png';
import PAT2 from '../../../public/PAT-2.png';
import PAT3 from '../../../public/PAT-3.png';
import PAT4 from '../../../public/PAT-4.png';

const Dashboard: React.FC = () => {
    return (
        <div>
            <h1 className="text-4xl  mt-10 text-white">Step #1:</h1>
            <div className="flex justify-center mt-10">
                <div className="w-[80%] border border-red-500">
                    <Image src={PAT1} alt="PAT-1" className="w-full" />
                </div>
            </div>
            <h1 className="text-4xl  mt-10 text-white">Step #2:</h1>
            <div className="flex justify-center mt-10">
                <div className="w-[80%] border border-red-500">
                    <Image src={PAT2} alt="PAT-2" className="w-full" />
                </div>
            </div>
            <h1 className="text-4xl  mt-10 text-white">Step #3:</h1>
            <div className="flex justify-center mt-10">
                <div className="w-[80%] border border-red-500">
                    <Image src={PAT3} alt="PAT-3" className="w-full" />
                </div>
            </div>
            <h1 className="text-4xl  mt-10 text-white">Step #4:</h1>
            <div className="flex justify-center mt-10">
                <div className="w-[80%] border border-red-500">
                    <Image src={PAT4} alt="PAT-4" className="w-full" />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
