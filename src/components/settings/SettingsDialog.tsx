import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ColumnSettings from './ColumnSettings';

export default function SettingsDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Column Settings
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="columns">
                    <TabsList className="grid w-full grid-cols-1">
                        <TabsTrigger value="columns">Table Columns</TabsTrigger>
                    </TabsList>

                    <TabsContent value="columns" className="py-4">
                        <ColumnSettings />
                    </TabsContent>

                </Tabs>
            </DialogContent>
        </Dialog>
    );
}