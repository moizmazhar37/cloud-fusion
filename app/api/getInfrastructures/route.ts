'use server'
//Authorize Github

import { db } from "@/lib/db";
import { NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function POST(req: any, res: NextApiResponse) {

    const data = await req.json()
    try {

        const userId = data.userId;

        if (!userId) {
            console.log('User not found');
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const infrastructures = await db.userInfrastructure.findMany({
            where: { userId }
        });

        if (!infrastructures) {
            console.log('No infrastructures found');
            return NextResponse.json({ error: 'No infrastructures found' }, { status: 404 });
        }

        return NextResponse.json({ infrastructures }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
