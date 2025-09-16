'use server'
//Authorize Github

import { db } from "@/lib/db";
import { NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

import axios from 'axios';

export async function POST(req: any, res: NextApiResponse) {

    const data = await req.json()
    const accessToken = data.accessToken;
    try {
        //Get Github Repositories
        const response = await axios({
            method: 'GET',
            url: `https://api.github.com/user/repos`,
            headers: {
                Authorization: `token ${accessToken}`
            }
        });

        const responseData = response.data;
        return NextResponse.json(responseData, { status: 200 });

    }
    catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}





