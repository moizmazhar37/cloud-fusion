'use server'
//Authorize Github

import { db } from "@/lib/db";
import { NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function POST(req: any, res: NextApiResponse) {

    const data = await req.json()
    const formData = data.form;
    try {

        const userId = formData.userId;
        const provider = formData.provider;
        const sshKey = formData.sshKey;
        const publicIp = formData.publicIp;
        const privateIp = formData.privateIp;
        const username = formData.username;
        const instanceName = formData.instanceName;
        const instanceVPC = formData.vpc;
        const instanceSecurityGroup = formData.securityGroup;

        // Check if the user exists
        const user = await db.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            NextResponse.json({ error: 'User not found' }, { status: 404 });
            return
        }

        // Create infrastructure
        const infrastructure = await db.userInfrastructure.create({
            data: {
                userId,
                provider,
                sshKey,
                publicIp,
                privateIp,
                username,
                instanceName,
                vpc: instanceVPC,
                securityGroup: instanceSecurityGroup,
                operatingSystem: formData.operatingSystem,
                region: formData.region,
                instanceType: formData.instanceType,                
            }
        });

        if (!infrastructure) {
            console.log('Failed to create infrastructure');
            NextResponse.json({ error: 'Failed to create infrastructure' }, { status: 500 });
            return
        }

        return NextResponse.json({ message: 'Infrastructure created successfully' }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
