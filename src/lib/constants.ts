import { HomeIcon, NotebookPenIcon, SettingsIcon, TrashIcon } from "lucide-react";

export const data = {
    user: {
        name: "Test User",
        email: "s@example.com",
        avatar: "/s.jpg"
    },

    navMain: [
        {
            title: "Home",
            url: '/dashboard',
            icon: HomeIcon,
        },
        {
            title: "Tasks",
            url: '/tasks',
            icon: NotebookPenIcon,
        },
        {
            title: 'Trash',
            url: '/trash',
            icon: TrashIcon
        },
        {
            title: 'Settings',
            url: '/settings',
            icon: SettingsIcon
        }
    ]
}