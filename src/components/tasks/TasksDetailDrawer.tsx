'use client';

import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { setSelectedTask, addComment, updateTaskStatus } from '@/store/features/tasksSlice';
import { setTaskDrawer } from '@/store/features/uiSlice';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    CalendarDays,
    Clock,
    Edit3,
    MessageSquare,
    Tag,
    CheckCircle2,
    X,
    Send,
    Calendar,
} from 'lucide-react';
import {
    formatDate,
    getStatusColor,
    getPriorityColor,
    getDueDateStatus
} from '@/lib/utils';
import { Comment as CommentType, TaskStatus } from '@/types';

export default function TaskDetailDrawer() {
    const dispatch = useDispatch<AppDispatch>();
    const { selectedTask } = useSelector((state: RootState) => state.tasks);
    const { taskDrawerOpen } = useSelector((state: RootState) => state.ui);

    const [comment, setComment] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleClose = () => {
        dispatch(setSelectedTask(null));
        dispatch(setTaskDrawer(false));
    };

    const handleStatusChange = (status: string) => {
        if (selectedTask) {
            dispatch(updateTaskStatus({
                taskId: selectedTask.id,
                status: status as TaskStatus
            }));
        }
    };

    const handleAddComment = () => {
        if (selectedTask && comment.trim()) {
            const newComment: CommentType = {
                id: `comment-${Date.now()}`,
                author: {
                    id: 'current-user',
                    name: 'Current User',
                    avatar: '/avatars/avatar-1.png',
                },
                content: comment.trim(),
                createdAt: new Date().toISOString(),
            };

            dispatch(addComment({ taskId: selectedTask.id, comment: newComment }));
            setComment('');

            if (textareaRef.current) {
                textareaRef.current.focus();
            }
        }
    };

    if (!selectedTask) return null;

    const { color: dueDateColor, label: dueDateLabel } = getDueDateStatus(selectedTask.dueDate);

    return (
        <Sheet open={taskDrawerOpen} onOpenChange={setTaskDrawer}>
            <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto">
                <SheetHeader className="space-y-2 pb-4 mb-6 border-b">
                    <div className="flex justify-between items-start">
                        <SheetTitle className="text-xl mr-8">{selectedTask.title}</SheetTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClose}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </div>
                    <SheetDescription className="text-sm">
                        Task #{selectedTask.id.split('-')[1]} · Created {formatDate(selectedTask.createdAt)}
                    </SheetDescription>

                    <div className="flex flex-wrap gap-2 mt-2">
                        <div className="flex items-center">
                            <Select
                                value={selectedTask.status}
                                onValueChange={handleStatusChange}
                            >
                                <SelectTrigger className="h-8 gap-1 w-auto">
                                    <Badge variant="outline" className={getStatusColor(selectedTask.status)}>
                                        {selectedTask.status === 'in-progress' ? 'In Progress' :
                                            selectedTask.status.charAt(0).toUpperCase() + selectedTask.status.slice(1)}
                                    </Badge>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todo">To Do</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="review">Review</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Badge variant="outline" className={getPriorityColor(selectedTask.priority)}>
                            {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)} Priority
                        </Badge>

                        {selectedTask.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </SheetHeader>

                <Tabs defaultValue="details">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="comments">
                            Comments ({selectedTask.comments.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4 mt-4">
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium mb-1">Description</h4>
                                <div className="text-sm p-3 bg-muted rounded-md">
                                    {selectedTask.description || 'No description provided.'}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                                        <CalendarDays className="h-4 w-4" />
                                        Due Date
                                    </h4>
                                    <div className="flex items-center">
                                        <div className="text-sm">{formatDate(selectedTask.dueDate)}</div>
                                        <div className={`text-xs ml-2 ${dueDateColor}`}>
                                            {dueDateLabel}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        Estimated Time
                                    </h4>
                                    <div className="text-sm">{selectedTask.estimatedHours} hours</div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium mb-1">Assignee</h4>
                                <div className="flex items-center gap-2">
                                    <Avatar>
                                        <AvatarImage src={selectedTask.assignee.avatar} />
                                        <AvatarFallback>
                                            {selectedTask.assignee.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-sm">{selectedTask.assignee.name}</div>
                                </div>
                            </div>

                            {selectedTask.completedAt && (
                                <div>
                                    <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        Completed
                                    </h4>
                                    <div className="text-sm">
                                        {formatDate(selectedTask.completedAt)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="comments" className="space-y-4 mt-4">
                        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                            {selectedTask.comments.length === 0 ? (
                                <div className="text-center py-8">
                                    <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                    <div className="text-sm text-muted-foreground">
                                        No comments yet. Be the first to add a comment.
                                    </div>
                                </div>
                            ) : (
                                selectedTask.comments.map((comment) => (
                                    <div key={comment.id} className="pb-4">
                                        <div className="flex items-start gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={comment.author.avatar} />
                                                <AvatarFallback>
                                                    {comment.author.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <div className="font-medium text-sm">
                                                        {comment.author.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {formatDate(comment.createdAt)}
                                                    </div>
                                                </div>
                                                <div className="text-sm bg-muted p-3 rounded-md">
                                                    {comment.content}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="pt-4 border-t">
                            <div className="flex items-start gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/avatars/avatar-1.png" />
                                    <AvatarFallback>CU</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <Textarea
                                        ref={textareaRef}
                                        placeholder="Add a comment..."
                                        className="min-h-24 mb-2"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                    <Button
                                        onClick={handleAddComment}
                                        disabled={!comment.trim()}
                                        className="ml-auto"
                                    >
                                        <Send className="h-4 w-4 mr-2" />
                                        Send
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <SheetFooter className="pt-4 mt-6 border-t">
                    <div className="flex gap-2 justify-end w-full">
                        <Button variant="outline" size="sm">
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                        <Button size="sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            Set Reminder
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}