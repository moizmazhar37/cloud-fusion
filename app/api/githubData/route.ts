'use server'
//Authorize Github

import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';


export async function POST(req: any, res: NextApiResponse) {

    try{
        const data  = await req.json()
        const access_token = data.accessToken
        console.log(access_token);
        const response = await axios({
            method: 'GET',
            url: `https://api.github.com/user`,
            headers: {
                Authorization: `token ${access_token}`
            }
        });

        const responseData = response.data;
        return NextResponse.json(responseData, { status: 200 });    
    }
    catch(error){
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


