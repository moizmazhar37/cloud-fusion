'use server'

import { db } from "@/lib/db";
import { NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function POST(req: any, res: NextApiResponse) {

    const data = await req.json()
    const formData = data.infrastructureId; 
    try{

        const infraId = formData.infrastructureId
        const infrastructure = await db.userInfrastructure.findUnique({
            where: { id: formData }
        });

        if (!infrastructure) {
            console.log('Infrastructure not found');
            NextResponse.json({ error: 'Infrastructure not found' }, { status: 404 });
            return
        }
        //now delete the infrastructure

        const deletedInfrastructure = await db.userInfrastructure.delete({
            where: { id: formData }
        });

        if (!deletedInfrastructure) {
            console.log('Failed to delete infrastructure');
            NextResponse.json({ error: 'Failed to delete infrastructure' }, { status: 500 });
            return
        }

        return NextResponse.json({ message: 'Infrastructure deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}