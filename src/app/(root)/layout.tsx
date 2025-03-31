import Navbar from '@/components/global/Navbar/Navbar'
import AppSidebar from '@/components/global/Sidebar/Sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

type Props = {
    children: React.ReactNode

}

const Layout = ({ children }: Props) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Navbar />
                <div className='p-4'>
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default Layout