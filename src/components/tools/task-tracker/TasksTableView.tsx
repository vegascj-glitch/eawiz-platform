'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn, copyToClipboard } from '@/lib/utils';
import { TaskModal } from './modals/TaskModal';
import { CategoryModal } from './modals/CategoryModal';
import {
  Task,
  TaskWithCategory,
  TaskCategory,
  TaskPriority,
  TaskStatus,
  PRIORITY_COLORS,
  STATUS_COLORS,
  CATEGORY_COLORS,
  PRIORITIES,
  STATUSES,
  formatDateShort,
  formatTime,
  isOverdue,
  isDueToday,
  isDueThisWeek,
  getToday,
  exportTasksToCSV,
  generateWeeklySummary,
} from './utils';

interface TasksTableViewProps {
  tasks: TaskWithCategory[];
  categories: TaskCategory[];
  onAddTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Task;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onDuplicateTask: (task: Task) => Task;
  onToggleComplete: (id: string) => void;
  onBulkUpdate: (ids: string[], updates: Partial<Task>) => void;
  onBulkDelete: (ids: string[]) => void;
  onAddCategory: (name: string, colorKey: string) => TaskCategory;
  onUpdateCategory: (id: string, updates: Partial<TaskCategory>) => void;
  onDeleteCategory: (id: string) => void;
}

type SortField = 'due_date' | 'priority' | 'created_at' | 'status';
type SortDir = 'asc' | 'desc';

const PRIORITY_ORDER: Record<TaskPriority, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
const STATUS_ORDER: Record<TaskStatus, number> = { blocked: 5, in_progress: 4, waiting: 3, not_started: 2, done: 1 };

export function TasksTableView({
  tasks,
  categories,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onDuplicateTask,
  onToggleComplete,
  onBulkUpdate,
  onBulkDelete,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}: TasksTableViewProps) {
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'overdue' | 'today' | 'this_week' | 'range'>('all');
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');

  // Sort state
  const [sortField, setSortField] = useState<SortField>('due_date');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modal state
  const [editingTask, setEditingTask] = useState<TaskWithCategory | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Quick add state
  const [quickAddTitle, setQuickAddTitle] = useState('');
  const [quickAddDueDate, setQuickAddDueDate] = useState('');
  const [quickAddPriority, setQuickAddPriority] = useState<TaskPriority>('medium');
  const [quickAddCategory, setQuickAddCategory] = useState<string>('');

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          (t.description && t.description.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      if (categoryFilter === 'uncategorized') {
        result = result.filter((t) => !t.category_id);
      } else {
        result = result.filter((t) => t.category_id === categoryFilter);
      }
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    // Date filter
    if (dateFilter === 'overdue') {
      result = result.filter((t) => isOverdue(t));
    } else if (dateFilter === 'today') {
      result = result.filter((t) => isDueToday(t));
    } else if (dateFilter === 'this_week') {
      result = result.filter((t) => isDueThisWeek(t));
    } else if (dateFilter === 'range' && dateRangeStart && dateRangeEnd) {
      result = result.filter(
        (t) => t.due_date && t.due_date >= dateRangeStart && t.due_date <= dateRangeEnd
      );
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'due_date':
          if (!a.due_date && !b.due_date) cmp = 0;
          else if (!a.due_date) cmp = 1;
          else if (!b.due_date) cmp = -1;
          else cmp = a.due_date.localeCompare(b.due_date);
          break;
        case 'priority':
          cmp = PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
          break;
        case 'status':
          cmp = STATUS_ORDER[b.status] - STATUS_ORDER[a.status];
          break;
        case 'created_at':
          cmp = b.created_at.localeCompare(a.created_at);
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [tasks, searchQuery, statusFilter, categoryFilter, priorityFilter, dateFilter, dateRangeStart, dateRangeEnd, sortField, sortDir]);

  // Handlers
  const handleQuickAdd = () => {
    if (!quickAddTitle.trim()) return;
    onAddTask({
      title: quickAddTitle.trim(),
      description: null,
      category_id: quickAddCategory || null,
      priority: quickAddPriority,
      status: 'not_started',
      due_date: quickAddDueDate || null,
      estimate_minutes: null,
      actual_minutes: null,
      completed_at: null,
      recurring_rule: 'none',
    });
    setQuickAddTitle('');
    setQuickAddDueDate('');
    setQuickAddPriority('medium');
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredTasks.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTasks.map((t) => t.id)));
    }
  };

  const handleSelectTask = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleBulkMarkDone = () => {
    onBulkUpdate(Array.from(selectedIds), {
      status: 'done',
      completed_at: new Date().toISOString(),
    });
    setSelectedIds(new Set());
  };

  const handleBulkChangePriority = (priority: TaskPriority) => {
    onBulkUpdate(Array.from(selectedIds), { priority });
    setSelectedIds(new Set());
  };

  const handleBulkChangeCategory = (categoryId: string | null) => {
    onBulkUpdate(Array.from(selectedIds), { category_id: categoryId });
    setSelectedIds(new Set());
  };

  const handleBulkDelete = () => {
    onBulkDelete(Array.from(selectedIds));
    setSelectedIds(new Set());
    setShowBulkDeleteConfirm(false);
  };

  const handleExportCSV = () => {
    const csv = exportTasksToCSV(filteredTasks, categories);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-${getToday()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyWeeklySummary = async () => {
    const summary = generateWeeklySummary(tasks, categories);
    await copyToClipboard(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleDeleteTask = () => {
    if (taskToDelete) {
      onDeleteTask(taskToDelete);
      setTaskToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      onUpdateTask(editingTask.id, taskData);
    } else {
      onAddTask(taskData as Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>);
    }
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setPriorityFilter('all');
    setDateFilter('all');
    setDateRangeStart('');
    setDateRangeEnd('');
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all' || dateFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* Quick Add Row */}
      <Card variant="bordered" className="bg-gray-50">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-2 items-end">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Quick add task..."
                value={quickAddTitle}
                onChange={(e) => setQuickAddTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
              />
            </div>
            <Input
              type="date"
              className="w-40"
              value={quickAddDueDate}
              onChange={(e) => setQuickAddDueDate(e.target.value)}
            />
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              value={quickAddPriority}
              onChange={(e) => setQuickAddPriority(e.target.value as TaskPriority)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{PRIORITY_COLORS[p].label}</option>
              ))}
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              value={quickAddCategory}
              onChange={(e) => setQuickAddCategory(e.target.value)}
            >
              <option value="">No Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <Button variant="primary" onClick={handleQuickAdd} disabled={!quickAddTitle.trim()}>
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Actions */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <Input
            placeholder="Search tasks..."
            className="w-48"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
          >
            <option value="all">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_COLORS[s].label}</option>
            ))}
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="uncategorized">Uncategorized</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')}
          >
            <option value="all">All Priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{PRIORITY_COLORS[p].label}</option>
            ))}
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
          >
            <option value="all">All Dates</option>
            <option value="overdue">Overdue</option>
            <option value="today">Due Today</option>
            <option value="this_week">Due This Week</option>
            <option value="range">Date Range</option>
          </select>
          {dateFilter === 'range' && (
            <>
              <Input
                type="date"
                className="w-36"
                value={dateRangeStart}
                onChange={(e) => setDateRangeStart(e.target.value)}
              />
              <span className="text-gray-500">to</span>
              <Input
                type="date"
                className="w-36"
                value={dateRangeEnd}
                onChange={(e) => setDateRangeEnd(e.target.value)}
              />
            </>
          )}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowCategoryModal(true)}>
            Manage Categories
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCopyWeeklySummary}>
            {copiedSummary ? 'Copied!' : 'Copy Summary'}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="primary" onClick={() => { setEditingTask(null); setShowTaskModal(true); }}>
            + New Task
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <Card variant="bordered" className="bg-violet-50 border-violet-200">
          <CardContent className="py-3">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-violet-700 font-medium">
                {selectedIds.size} selected
              </span>
              <Button variant="ghost" size="sm" onClick={handleBulkMarkDone}>
                Mark Done
              </Button>
              <select
                className="px-2 py-1 border border-gray-300 rounded text-sm"
                onChange={(e) => e.target.value && handleBulkChangePriority(e.target.value as TaskPriority)}
                defaultValue=""
              >
                <option value="" disabled>Change Priority</option>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{PRIORITY_COLORS[p].label}</option>
                ))}
              </select>
              <select
                className="px-2 py-1 border border-gray-300 rounded text-sm"
                onChange={(e) => handleBulkChangeCategory(e.target.value || null)}
                defaultValue=""
              >
                <option value="" disabled>Change Category</option>
                <option value="">None</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <Button variant="danger" size="sm" onClick={() => setShowBulkDeleteConfirm(true)}>
                Delete Selected
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>
                Deselect All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks Table */}
      <Card variant="bordered">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filteredTasks.length && filteredTasks.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-3 py-3 text-left w-8">Done</th>
                <th className="px-3 py-3 text-left min-w-[200px]">Title</th>
                <th className="px-3 py-3 text-left">Category</th>
                <th className="px-3 py-3 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('priority')}>
                  Priority {sortField === 'priority' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-3 py-3 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('status')}>
                  Status {sortField === 'status' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-3 py-3 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('due_date')}>
                  Due {sortField === 'due_date' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-3 py-3 text-left">Est.</th>
                <th className="px-3 py-3 text-left">Scheduled</th>
                <th className="px-3 py-3 text-left cursor-pointer hover:bg-gray-100" onClick={() => handleSort('created_at')}>
                  Created {sortField === 'created_at' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-3 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-3 py-12 text-center text-gray-500">
                    {hasActiveFilters ? 'No tasks match your filters.' : 'No tasks yet. Add your first task above!'}
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const catColors = task.category ? CATEGORY_COLORS[task.category.color_key] : null;
                  const priorityColors = PRIORITY_COLORS[task.priority];
                  const statusColors = STATUS_COLORS[task.status];
                  const overdue = isOverdue(task);

                  return (
                    <tr
                      key={task.id}
                      className={cn(
                        'hover:bg-gray-50 cursor-pointer',
                        task.status === 'done' && 'opacity-60',
                        overdue && 'bg-rose-50'
                      )}
                      onClick={() => { setEditingTask(task); setShowTaskModal(true); }}
                    >
                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(task.id)}
                          onChange={() => handleSelectTask(task.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={task.status === 'done'}
                          onChange={() => onToggleComplete(task.id)}
                          className="rounded border-gray-300 text-emerald-600"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <span className={cn(task.status === 'done' && 'line-through text-gray-500')}>
                          {task.title}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        {task.category && catColors && (
                          <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', catColors.bg, catColors.text)}>
                            {task.category.name}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', priorityColors.bg, priorityColors.text)}>
                          {priorityColors.label}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', statusColors.bg, statusColors.text)}>
                          {statusColors.label}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={cn(overdue && 'text-rose-600 font-medium')}>
                          {formatDateShort(task.due_date)}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-gray-600">
                        {task.estimate_minutes ? `${task.estimate_minutes}m` : ''}
                      </td>
                      <td className="px-3 py-3 text-gray-600 text-xs">
                        {task.schedule && (
                          <span>
                            {formatDateShort(task.schedule.scheduled_date)}{' '}
                            {formatTime(task.schedule.start_time)}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-gray-500 text-xs">
                        {formatDateShort(task.created_at.split('T')[0])}
                      </td>
                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-1">
                          <button
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Edit"
                            onClick={() => { setEditingTask(task); setShowTaskModal(true); }}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Duplicate"
                            onClick={() => onDuplicateTask(task)}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-rose-600"
                            title="Delete"
                            onClick={() => { setTaskToDelete(task.id); setShowDeleteConfirm(true); }}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Task Count */}
      <div className="text-sm text-gray-500 text-center">
        Showing {filteredTasks.length} of {tasks.length} tasks
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          task={editingTask}
          categories={categories}
          onSave={handleSaveTask}
          onClose={() => { setShowTaskModal(false); setEditingTask(null); }}
        />
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <CategoryModal
          categories={categories}
          onAdd={onAddCategory}
          onUpdate={onUpdateCategory}
          onDelete={onDeleteCategory}
          onClose={() => setShowCategoryModal(false)}
        />
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card variant="elevated" className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Delete Task?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this task? This cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" className="flex-1" onClick={() => { setShowDeleteConfirm(false); setTaskToDelete(null); }}>
                  Cancel
                </Button>
                <Button variant="danger" className="flex-1" onClick={handleDeleteTask}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bulk Delete Confirmation */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card variant="elevated" className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Delete {selectedIds.size} Tasks?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete {selectedIds.size} tasks? This cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" className="flex-1" onClick={() => setShowBulkDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="danger" className="flex-1" onClick={handleBulkDelete}>
                  Delete All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
