'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import {
  Task,
  TaskWithCategory,
  TaskCategory,
  TaskPriority,
  TaskStatus,
  RecurringRule,
  PRIORITY_COLORS,
  STATUS_COLORS,
  PRIORITIES,
  STATUSES,
} from '../utils';

interface TaskModalProps {
  task: TaskWithCategory | null;
  categories: TaskCategory[];
  onSave: (taskData: Partial<Task>) => void;
  onClose: () => void;
}

const RECURRING_OPTIONS: { value: RecurringRule; label: string }[] = [
  { value: 'none', label: 'Does not repeat' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export function TaskModal({ task, categories, onSave, onClose }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('not_started');
  const [dueDate, setDueDate] = useState('');
  const [estimateMinutes, setEstimateMinutes] = useState('');
  const [actualMinutes, setActualMinutes] = useState('');
  const [recurringRule, setRecurringRule] = useState<RecurringRule>('none');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setCategoryId(task.category_id || '');
      setPriority(task.priority);
      setStatus(task.status);
      setDueDate(task.due_date || '');
      setEstimateMinutes(task.estimate_minutes?.toString() || '');
      setActualMinutes(task.actual_minutes?.toString() || '');
      setRecurringRule(task.recurring_rule);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData: Partial<Task> = {
      title: title.trim(),
      description: description.trim() || null,
      category_id: categoryId || null,
      priority,
      status,
      due_date: dueDate || null,
      estimate_minutes: estimateMinutes ? parseInt(estimateMinutes, 10) : null,
      actual_minutes: actualMinutes ? parseInt(actualMinutes, 10) : null,
      recurring_rule: recurringRule,
    };

    // If marking as done and wasn't done before, set completed_at
    if (status === 'done' && task?.status !== 'done') {
      taskData.completed_at = new Date().toISOString();
    } else if (status !== 'done') {
      taskData.completed_at = null;
    }

    onSave(taskData);
  };

  const isEditing = !!task;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card variant="elevated" className="w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Task' : 'New Task'}</CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
              autoFocus
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details or notes..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">No Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {PRIORITY_COLORS[p].label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_COLORS[s].label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Estimate (minutes)"
                type="number"
                min="0"
                step="5"
                value={estimateMinutes}
                onChange={(e) => setEstimateMinutes(e.target.value)}
                placeholder="30"
              />

              <Input
                label="Actual (minutes)"
                type="number"
                min="0"
                step="5"
                value={actualMinutes}
                onChange={(e) => setActualMinutes(e.target.value)}
                placeholder="45"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recurring
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={recurringRule}
                onChange={(e) => setRecurringRule(e.target.value as RecurringRule)}
              >
                {RECURRING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={!title.trim()}>
                {isEditing ? 'Save Changes' : 'Create Task'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
