/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/components/ui/button';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import React from 'react'

type User = {
    name: string
    email: string
    avatar: string
}

const NavFooter = ({ user }: { user: User }) => {

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <div className='flex flex-col gap-y-6 items-start group-data-[collapsible=icon]:hidden'>
                    <SidebarMenuButton size={'lg'}
                        className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
                        <div className='grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden'>
                            <span className="truncate font-semibold">{user?.name}</span>
                            <span className="truncate text-secondary">{user?.email}</span>
                        </div>
                    </SidebarMenuButton>
                </div>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

export default NavFooter