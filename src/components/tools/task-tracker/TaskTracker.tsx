'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { DashboardView } from './DashboardView';
import { TasksTableView } from './TasksTableView';
import { PlannerView } from './PlannerView';
import {
  Task,
  TaskCategory,
  TaskSchedule,
  TaskSettings,
  TaskWithCategory,
  DEFAULT_CATEGORIES,
  STORAGE_KEY,
  calculateMetrics,
} from './utils';

type TabId = 'dashboard' | 'tasks' | 'planner';

interface TabState {
  tasks: Task[];
  categories: TaskCategory[];
  schedules: TaskSchedule[];
  settings: TaskSettings;
}

const DEFAULT_SETTINGS: TaskSettings = {
  user_id: 'local',
  workday_start: '07:00',
  workday_end: '19:00',
  baseline_hours_per_week: 5,
  efficiency_factor: 0.15,
  updated_at: new Date().toISOString(),
};

function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

export function TaskTracker() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [schedules, setSchedules] = useState<TaskSchedule[]>([]);
  const [settings, setSettings] = useState<TaskSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const data: TabState = JSON.parse(saved);
          setTasks(data.tasks || []);
          setCategories(data.categories || []);
          setSchedules(data.schedules || []);
          setSettings(data.settings || DEFAULT_SETTINGS);
        }

        // Seed default categories if none exist
        const savedData = saved ? JSON.parse(saved) : null;
        if (!savedData?.categories || savedData.categories.length === 0) {
          const defaultCats: TaskCategory[] = DEFAULT_CATEGORIES.map((cat, idx) => ({
            id: generateId(),
            user_id: 'local',
            name: cat.name,
            color_key: cat.color_key,
            created_at: new Date().toISOString(),
          }));
          setCategories(defaultCats);
        }
      } catch (error) {
        console.error('Failed to load task tracker data:', error);
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Save data to localStorage
  const saveData = useCallback(() => {
    try {
      const data: TabState = { tasks, categories, schedules, settings };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save task tracker data:', error);
    }
  }, [tasks, categories, schedules, settings]);

  useEffect(() => {
    if (!isLoading) {
      saveData();
    }
  }, [tasks, categories, schedules, settings, isLoading, saveData]);

  // Task CRUD operations
  const addTask = useCallback((task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      user_id: 'local',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, ...updates, updated_at: new Date().toISOString() }
          : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    setSchedules((prev) => prev.filter((s) => s.task_id !== id));
  }, []);

  const duplicateTask = useCallback((task: Task) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      title: `${task.title} (copy)`,
      status: 'not_started',
      completed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const toggleTaskComplete = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        const isCompleting = task.status !== 'done';
        return {
          ...task,
          status: isCompleting ? 'done' : 'not_started',
          completed_at: isCompleting ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        };
      })
    );
  }, []);

  const bulkUpdateTasks = useCallback((ids: string[], updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        ids.includes(task.id)
          ? { ...task, ...updates, updated_at: new Date().toISOString() }
          : task
      )
    );
  }, []);

  const bulkDeleteTasks = useCallback((ids: string[]) => {
    setTasks((prev) => prev.filter((task) => !ids.includes(task.id)));
    setSchedules((prev) => prev.filter((s) => !ids.includes(s.task_id)));
  }, []);

  // Category CRUD operations
  const addCategory = useCallback((name: string, colorKey: string) => {
    const newCategory: TaskCategory = {
      id: generateId(),
      user_id: 'local',
      name,
      color_key: colorKey as TaskCategory['color_key'],
      created_at: new Date().toISOString(),
    };
    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<TaskCategory>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    // Remove category from tasks
    setTasks((prev) =>
      prev.map((task) =>
        task.category_id === id ? { ...task, category_id: null } : task
      )
    );
  }, []);

  // Schedule CRUD operations
  const addSchedule = useCallback((schedule: Omit<TaskSchedule, 'id' | 'user_id' | 'created_at'>) => {
    const newSchedule: TaskSchedule = {
      ...schedule,
      id: generateId(),
      user_id: 'local',
      created_at: new Date().toISOString(),
    };
    setSchedules((prev) => [...prev, newSchedule]);
    return newSchedule;
  }, []);

  const updateSchedule = useCallback((id: string, updates: Partial<TaskSchedule>) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  const deleteSchedule = useCallback((id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // Settings update
  const updateSettings = useCallback((updates: Partial<TaskSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates, updated_at: new Date().toISOString() }));
  }, []);

  // Combine tasks with categories and schedules
  const tasksWithCategories: TaskWithCategory[] = useMemo(() => {
    return tasks.map((task) => ({
      ...task,
      category: categories.find((c) => c.id === task.category_id) || null,
      schedule: schedules.find((s) => s.task_id === task.id) || null,
    }));
  }, [tasks, categories, schedules]);

  // Calculate metrics
  const metrics = useMemo(() => calculateMetrics(tasks, settings), [tasks, settings]);

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'tasks', label: 'Tasks', icon: '📋' },
    { id: 'planner', label: 'Planner', icon: '📅' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2',
              activeTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <DashboardView
          tasks={tasksWithCategories}
          categories={categories}
          metrics={metrics}
          settings={settings}
          onUpdateSettings={updateSettings}
        />
      )}

      {activeTab === 'tasks' && (
        <TasksTableView
          tasks={tasksWithCategories}
          categories={categories}
          onAddTask={addTask}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          onDuplicateTask={duplicateTask}
          onToggleComplete={toggleTaskComplete}
          onBulkUpdate={bulkUpdateTasks}
          onBulkDelete={bulkDeleteTasks}
          onAddCategory={addCategory}
          onUpdateCategory={updateCategory}
          onDeleteCategory={deleteCategory}
        />
      )}

      {activeTab === 'planner' && (
        <PlannerView
          tasks={tasksWithCategories}
          categories={categories}
          schedules={schedules}
          settings={settings}
          onAddSchedule={addSchedule}
          onUpdateSchedule={updateSchedule}
          onDeleteSchedule={deleteSchedule}
          onUpdateSettings={updateSettings}
        />
      )}
    </div>
  );
}
