'use client';

import React from 'react';


export default function Layout({ children,
}: {
    children: React.ReactNode
}) {

    return (
        <>
            <div className='bg-temp2 h-full'>
                <div className='flex h-full'>
                    {children}
                </div>
            </div>
        </>
    )
}





