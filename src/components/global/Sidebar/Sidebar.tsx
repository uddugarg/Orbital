"use client";

import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { data } from '@/lib/constants';
import NavMain from './NavMain';
import Footer from './Footer';

const AppSidebar = () => {
    return (
        <Sidebar
            collapsible='icon'
            className='max-w-[212px] bg-background-90'
        >
            <SidebarHeader className='pt-6 px-2 pb-0'>
                <SidebarMenuButton size={'lg'} className='data-[state=open]:text-sidebar-accent-foreground'>
                    <div className='flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground'>
                        <Avatar className='h-10 w-10 rounded-full'>
                            <AvatarImage src={'/orbital-icon.svg'} alt={`vivid-logo`} />
                            <AvatarFallback className='rounded-lg'>
                                VI
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <span className='truncate text- text-3xl font-semibold'>
                        Orbital
                    </span>
                </SidebarMenuButton>
            </SidebarHeader>
            <SidebarContent className='px-2 mt-10 gap-y-6'>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <Footer user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar