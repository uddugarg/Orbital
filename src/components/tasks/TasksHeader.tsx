'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import {
  setFilterStatus,
  setFilterPriority,
  setSearchQuery,
  clearFilters,
} from '@/store/features/tasksSlice';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Search,
  LayoutGrid,
  LayoutList,
  X,
  FilterX
} from 'lucide-react';
import { TaskPriority, TaskStatus } from '@/types';

interface TasksHeaderProps {
  currentView: 'table' | 'kanban';
  onViewChange: (view: 'table' | 'kanban') => void;
}

export default function TasksHeader({ currentView, onViewChange }: TasksHeaderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    filterStatus,
    filterPriority,
    searchQuery,
  } = useSelector((state: RootState) => state.tasks);

  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchQuery(localSearch));
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    dispatch(setSearchQuery(''));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setLocalSearch('');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Tasks</h1>

        <div className="flex items-center space-x-2">
          <Button
            variant={currentView === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('table')}
            className="w-10 h-10 p-0"
          >
            <LayoutList className="h-4 w-4" />
            <span className="sr-only">Table View</span>
          </Button>

          <Button
            variant={currentView === 'kanban' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('kanban')}
            className="w-10 h-10 p-0"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="sr-only">Kanban View</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2 space-y-1.5">
          <Label htmlFor="status-filter">Search</Label>
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks..."
              className="pl-8 pr-10"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
            {localSearch && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-2.5"
              >
                <X className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Clear search</span>
              </button>
            )}
          </form>
        </div>

        <div>
          <div className="space-y-1.5">
            <Label htmlFor="status-filter">Status</Label>
            <Select
              value={filterStatus}
              onValueChange={(value) => dispatch(setFilterStatus(value as TaskStatus | 'all'))}
            >
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <div className="space-y-1.5">
            <Label htmlFor="priority-filter">Priority</Label>
            <Select
              value={filterPriority}
              onValueChange={(value) => dispatch(setFilterPriority(value as TaskPriority | 'all'))}
            >
              <SelectTrigger id="priority-filter">
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {(filterStatus !== 'all' || filterPriority !== 'all' || searchQuery) && (
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-8 text-xs"
          >
            <FilterX className="mr-1 h-3 w-3" />
            Clear filters
          </Button>
          <div className="ml-2 text-sm text-muted-foreground">
            Filters active
          </div>
        </div>
      )}
    </div>
  );
}