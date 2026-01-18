// Types
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'not_started' | 'in_progress' | 'blocked' | 'waiting' | 'done';
export type RecurringRule = 'none' | 'daily' | 'weekly' | 'monthly';
export type ColorKey = 'rose' | 'amber' | 'emerald' | 'sky' | 'violet' | 'slate' | 'orange' | 'teal' | 'pink' | 'indigo';

export interface TaskCategory {
  id: string;
  user_id: string;
  name: string;
  color_key: ColorKey;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string | null;
  estimate_minutes: number | null;
  actual_minutes: number | null;
  completed_at: string | null;
  recurring_rule: RecurringRule;
  created_at: string;
  updated_at: string;
}

export interface TaskSchedule {
  id: string;
  user_id: string;
  task_id: string;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  created_at: string;
}

export interface TaskSettings {
  user_id: string;
  workday_start: string;
  workday_end: string;
  baseline_hours_per_week: number;
  efficiency_factor: number;
  updated_at: string;
}

export interface TaskWithCategory extends Task {
  category?: TaskCategory | null;
  schedule?: TaskSchedule | null;
}

// Default categories to seed for new users
export const DEFAULT_CATEGORIES: { name: string; color_key: ColorKey }[] = [
  { name: 'Admin', color_key: 'slate' },
  { name: 'Meetings', color_key: 'sky' },
  { name: 'Travel', color_key: 'amber' },
  { name: 'People', color_key: 'violet' },
  { name: 'Projects', color_key: 'emerald' },
  { name: 'Personal', color_key: 'rose' },
];

// Color mappings
export const CATEGORY_COLORS: Record<ColorKey, { bg: string; text: string; border: string }> = {
  rose: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-300' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' },
  sky: { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-300' },
  violet: { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-300' },
  slate: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-300' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-300' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300' },
};

export const PRIORITY_COLORS: Record<TaskPriority, { bg: string; text: string; label: string }> = {
  low: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Low' },
  medium: { bg: 'bg-sky-100', text: 'text-sky-700', label: 'Medium' },
  high: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'High' },
  urgent: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Urgent' },
};

export const STATUS_COLORS: Record<TaskStatus, { bg: string; text: string; label: string }> = {
  not_started: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Not Started' },
  in_progress: { bg: 'bg-violet-100', text: 'text-violet-700', label: 'In Progress' },
  blocked: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Blocked' },
  waiting: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Waiting' },
  done: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Done' },
};

export const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
export const STATUSES: TaskStatus[] = ['not_started', 'in_progress', 'blocked', 'waiting', 'done'];

// Date helpers
export function formatDateShort(date: string | null): string {
  if (!date) return '';
  const d = new Date(date + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDateFull(date: string | null): string {
  if (!date) return '';
  const d = new Date(date + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

export function getWeekEnd(date: Date = new Date()): Date {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return end;
}

export function isOverdue(task: Task): boolean {
  if (!task.due_date || task.status === 'done') return false;
  return task.due_date < getToday();
}

export function isDueToday(task: Task): boolean {
  if (!task.due_date) return false;
  return task.due_date === getToday();
}

export function isDueThisWeek(task: Task): boolean {
  if (!task.due_date) return false;
  const today = new Date();
  const weekEnd = getWeekEnd(today);
  const dueDate = new Date(task.due_date + 'T00:00:00');
  return dueDate >= today && dueDate <= weekEnd;
}

export function getWeekDates(date: Date = new Date()): { date: Date; dateStr: string; dayName: string }[] {
  const start = getWeekStart(date);
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    days.push({
      date: d,
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
    });
  }
  return days;
}

// CSV export helper
export function exportTasksToCSV(tasks: TaskWithCategory[], categories: TaskCategory[]): string {
  const headers = [
    'Title',
    'Description',
    'Category',
    'Priority',
    'Status',
    'Due Date',
    'Estimate (min)',
    'Actual (min)',
    'Completed At',
    'Created At',
  ];

  const rows = tasks.map((task) => {
    const category = categories.find((c) => c.id === task.category_id);
    return [
      `"${(task.title || '').replace(/"/g, '""')}"`,
      `"${(task.description || '').replace(/"/g, '""')}"`,
      category?.name || '',
      PRIORITY_COLORS[task.priority].label,
      STATUS_COLORS[task.status].label,
      task.due_date || '',
      task.estimate_minutes?.toString() || '',
      task.actual_minutes?.toString() || '',
      task.completed_at || '',
      task.created_at || '',
    ];
  });

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

// Weekly summary generator
export function generateWeeklySummary(
  tasks: TaskWithCategory[],
  categories: TaskCategory[]
): string {
  const today = new Date();
  const weekStart = getWeekStart(today);
  const weekEnd = getWeekEnd(today);
  const weekStartStr = weekStart.toISOString().split('T')[0];
  const weekEndStr = weekEnd.toISOString().split('T')[0];

  const completedThisWeek = tasks.filter(
    (t) => t.completed_at && t.completed_at >= weekStartStr && t.completed_at <= weekEndStr
  );

  const topPrioritiesNextWeek = tasks.filter(
    (t) =>
      t.status !== 'done' &&
      (t.priority === 'urgent' || t.priority === 'high') &&
      t.due_date &&
      t.due_date > weekEndStr
  );

  const overdue = tasks.filter((t) => isOverdue(t));
  const blocked = tasks.filter((t) => t.status === 'blocked');

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Uncategorized';
    return categories.find((c) => c.id === categoryId)?.name || 'Uncategorized';
  };

  let summary = `WEEKLY SUMMARY\n`;
  summary += `Week of ${formatDateFull(weekStartStr)}\n\n`;

  summary += `COMPLETED THIS WEEK (${completedThisWeek.length})\n`;
  if (completedThisWeek.length === 0) {
    summary += '  No tasks completed yet this week.\n';
  } else {
    completedThisWeek.forEach((t) => {
      summary += `  - ${t.title} [${getCategoryName(t.category_id)}]\n`;
    });
  }
  summary += '\n';

  summary += `TOP PRIORITIES NEXT WEEK (${topPrioritiesNextWeek.length})\n`;
  if (topPrioritiesNextWeek.length === 0) {
    summary += '  No urgent/high priority tasks due next week.\n';
  } else {
    topPrioritiesNextWeek.slice(0, 5).forEach((t) => {
      summary += `  - ${t.title} [${PRIORITY_COLORS[t.priority].label}] due ${formatDateShort(t.due_date)}\n`;
    });
  }
  summary += '\n';

  summary += `OVERDUE (${overdue.length})\n`;
  if (overdue.length === 0) {
    summary += '  No overdue tasks.\n';
  } else {
    overdue.forEach((t) => {
      summary += `  - ${t.title} was due ${formatDateShort(t.due_date)}\n`;
    });
  }
  summary += '\n';

  summary += `BLOCKERS (${blocked.length})\n`;
  if (blocked.length === 0) {
    summary += '  No blocked tasks.\n';
  } else {
    blocked.forEach((t) => {
      summary += `  - ${t.title}\n`;
    });
  }

  return summary;
}

// Metrics calculation
export interface TaskMetrics {
  openTasks: number;
  completedThisWeek: number;
  completedThisMonth: number;
  overdue: number;
  completionRateWeek: number;
  completionRateMonth: number;
  totalEstimatedHoursCompleted: number;
  savedHours: number;
  tasksByStatus: Record<TaskStatus, number>;
  tasksByPriority: Record<TaskPriority, number>;
  weeklyCompletionTrend: { week: string; count: number }[];
}

export function calculateMetrics(
  tasks: Task[],
  settings: TaskSettings
): TaskMetrics {
  const today = new Date();
  const todayStr = getToday();
  const weekStart = getWeekStart(today);
  const weekStartStr = weekStart.toISOString().split('T')[0];
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthStartStr = monthStart.toISOString().split('T')[0];

  const openTasks = tasks.filter((t) => t.status !== 'done').length;
  const completedThisWeek = tasks.filter(
    (t) => t.completed_at && t.completed_at >= weekStartStr
  ).length;
  const completedThisMonth = tasks.filter(
    (t) => t.completed_at && t.completed_at >= monthStartStr
  ).length;
  const overdue = tasks.filter((t) => isOverdue(t)).length;

  // Completion rates
  const tasksCreatedThisWeek = tasks.filter((t) => t.created_at >= weekStartStr).length;
  const tasksCreatedThisMonth = tasks.filter((t) => t.created_at >= monthStartStr).length;
  const completionRateWeek = tasksCreatedThisWeek > 0 ? (completedThisWeek / tasksCreatedThisWeek) * 100 : 0;
  const completionRateMonth = tasksCreatedThisMonth > 0 ? (completedThisMonth / tasksCreatedThisMonth) * 100 : 0;

  // Impact calculation
  const completedTasksWithEstimate = tasks.filter(
    (t) => t.status === 'done' && t.estimate_minutes && t.completed_at && t.completed_at >= monthStartStr
  );
  const totalEstimatedMinutes = completedTasksWithEstimate.reduce(
    (sum, t) => sum + (t.estimate_minutes || 0),
    0
  );
  const totalEstimatedHoursCompleted = totalEstimatedMinutes / 60;
  const savedHours = totalEstimatedHoursCompleted * settings.efficiency_factor;

  // Tasks by status
  const tasksByStatus: Record<TaskStatus, number> = {
    not_started: 0,
    in_progress: 0,
    blocked: 0,
    waiting: 0,
    done: 0,
  };
  tasks.forEach((t) => {
    tasksByStatus[t.status]++;
  });

  // Tasks by priority
  const tasksByPriority: Record<TaskPriority, number> = {
    low: 0,
    medium: 0,
    high: 0,
    urgent: 0,
  };
  tasks.forEach((t) => {
    if (t.status !== 'done') {
      tasksByPriority[t.priority]++;
    }
  });

  // Weekly completion trend (last 6 weeks)
  const weeklyCompletionTrend: { week: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const weekDate = new Date(today);
    weekDate.setDate(weekDate.getDate() - i * 7);
    const ws = getWeekStart(weekDate);
    const we = getWeekEnd(weekDate);
    const wsStr = ws.toISOString().split('T')[0];
    const weStr = we.toISOString().split('T')[0];
    const count = tasks.filter(
      (t) => t.completed_at && t.completed_at >= wsStr && t.completed_at <= weStr
    ).length;
    weeklyCompletionTrend.push({
      week: ws.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count,
    });
  }

  return {
    openTasks,
    completedThisWeek,
    completedThisMonth,
    overdue,
    completionRateWeek,
    completionRateMonth,
    totalEstimatedHoursCompleted,
    savedHours,
    tasksByStatus,
    tasksByPriority,
    weeklyCompletionTrend,
  };
}

// Generate time slots for planner
export function generateTimeSlots(startTime: string, endTime: string): string[] {
  const slots: string[] = [];
  const [startHour] = startTime.split(':').map(Number);
  const [endHour] = endTime.split(':').map(Number);

  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
}

// Local storage key
export const STORAGE_KEY = 'eawiz-task-tracker';
