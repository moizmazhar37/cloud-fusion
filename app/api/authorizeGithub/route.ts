'use server'
//Authorize Github

import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';


export async function POST(req: any, res: NextApiResponse) {

    const data  = await req.json()
    const code = data.code;

    try {
        const CLIENT_ID = "b55016a7680d8e89d8ba";
        const CLIENT_SECRET = "dc04965d92d7328ac45ee9d07ca28aa9a6dc6d8a";

        const response = await axios({
            method: 'POST',
            url: `https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}`,
            headers: {
                accept: 'application/json'
            }
        });

        const responseData = response.data;

        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
