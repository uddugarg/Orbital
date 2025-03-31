import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import { Button } from '@/components/ui/button'
import { BellIcon, Upload } from 'lucide-react'
import SearchBar from './SearchBar'
import ToggleTheme from '../ToggleTheme/ToggleTheme'
import AddTaskBtn from './AddTaskBtn'
import { FormProvider } from 'react-hook-form'

const TopNavbar = () => {
    return (
        <header className='sticky top-0 z-[10] flex shrink-0 flex-wrap items-center gap-2 bg-background p-4 justify-between'>
            <SidebarTrigger className='ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />

            <div className="w-full max-w-[95%] flex items-center justify-between gap-4 flex-wrap">
                <SearchBar />
                <ToggleTheme />
                <div className='flex flex-wrap gap-4 items-center justify-end'>
                    <Button className='bg-primary rounded-lg hover:bg-background-80 text-primary-foreground font-semibold cursor-not-allowed'>
                        <BellIcon />
                        Set Reminder
                    </Button>
                    <AddTaskBtn />
                </div>
            </div>

        </header>
    )
}

export default TopNavbar