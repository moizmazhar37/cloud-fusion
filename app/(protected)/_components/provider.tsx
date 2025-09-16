import React from 'react'
import { Nunito } from 'next/font/google';

const nunito = Nunito({ subsets: ['latin'] })

export default function CloudProviders({
    infrastructure,
    setinfrastructure,
    infrastructureName,
    color,
    logo,
    description,
}: {
    infrastructure: string,
    setinfrastructure: any,
    infrastructureName: string,
    color: string,
    logo: string,
    description: string
}) {


    return (
        <div className={`w-1/2 p-4 h-72 flex flex-col justify-between rounded 
                      ${infrastructureName === "AWS" ? "bg-orange-500" :
                        infrastructureName === "Digital Ocean" ? "bg-blue-500" :
                        infrastructureName === "Azure" ? "bg-blue-500" :
                        infrastructureName === "FusionCloud" ? "bg-rose-500" : ""}`}
            onClick={() => setinfrastructure(infrastructureName)}>
            <div className={`flex flex-row items-center flex-wrap flex-start gap-4 ${nunito.className}`}>
                <img src={logo}
                    width={65}
                    height={65}
                    alt="aws-logo"
                />
                <h3 className={`text-2xl text-temp2 font-medium title-font mb-2 font-sans`}>
                    {infrastructureName}
                </h3>
            </div>
            <p className="leading-relaxed text-temp2 text-base">
                {description}
            </p>
            <button className={`flex items-center mt-3 border-0 py-2 px-4 focus:outline-none hover:bg-${color}-300 rounded text-sm w-fit
                ${infrastructure === infrastructureName ? (
                    'text-white bg-${color}-300'
                ) : (
                    'text-${color}-300 bg-${color}-300'
                )}
                                `}>
                {infrastructure === infrastructureName ?
                    <span>Selected</span>
                    :
                    <span>Select</span>
                }
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-4 h-4 ml-2 ${infrastructure === "AWS" ? ('hidden') : ('text-${color}-500')}`}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M5 12h14"></path>
                    <path d="M12 5l7 7-7 7"></path>
                </svg>
            </button>
        </div>
    )
}