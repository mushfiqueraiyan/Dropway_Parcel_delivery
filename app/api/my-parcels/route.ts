import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma';

export async function GET(){


   try{
 const session = await auth.api.getSession({
        headers: await headers(),
    })

    if(!session){
        return NextResponse.json({message: "Unauthorized please login"},{status: 401});
    }


    const userId = session.user.id;

    const myParcels = await prisma.parcel.findMany(
        {
            where: {
                userId
            },
            select:{
                id: true,
                title: true,
                weight: true,
                location: true,
                district: true,
                upazila: true,
                tracking: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: "desc",
            }
        }
    )
    return NextResponse.json({myParcels});
   }
   catch(err){
        return NextResponse.json({message: err}, {status: 500});
   }


}