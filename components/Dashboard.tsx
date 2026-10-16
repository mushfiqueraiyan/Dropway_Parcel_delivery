import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import Link from 'next/link'
import React from 'react'

const Dashboard = async() => {

    const session = await auth.api.getSession({
        headers: await headers(),
    })

    const rider = session?.user.role === "rider";
    const admin = session?.user.role === 'admin';

  return (
    <div>
        {
            admin ? <><Link href={"/admin/dashboard"}>Dashboard</Link>
         </> : <>
         {
            rider ? <><Link href={"/admin/dashboard"}>Rider Hub</Link></> : <></>
         }
         </>
        }
    </div>
  )
}

export default Dashboard