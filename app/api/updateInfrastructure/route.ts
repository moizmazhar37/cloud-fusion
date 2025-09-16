'use server'

import { db } from "@/lib/db";
import { NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export async function POST(req: any, res: NextApiResponse) {

    const data = await req.json()
    const formData = data.form;
    try {

        const infraId = formData.infrastructureId
        const newPackages = formData.newPackages

        const infrastructure = await db.userInfrastructure.findUnique({
            where: { id: infraId }
        });

        if (!infrastructure) {
            console.log('Infrastructure not found');
            NextResponse.json({ error: 'Infrastructure not found' }, { status: 404 });
            return
        }

        let packages = infrastructure.packages
        if (packages === null) {
            packages = []
        }

        newPackages.forEach((pkg: any) => {
            packages.push(pkg)
        })


        const updatedInfrastructure = await db.userInfrastructure.update({
            where: { id: infraId },
            data: {
                packages: packages
            }
        });

        if (!updatedInfrastructure) {
            console.log('Failed to update infrastructure');
            NextResponse.json({ error: 'Failed to update infrastructure' }, { status: 500 });
            return
        }

        return NextResponse.json({ message: 'Infrastructure updated successfully' }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
