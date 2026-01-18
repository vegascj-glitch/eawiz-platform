'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import {
  TaskWithCategory,
  TaskCategory,
  TaskSchedule,
  TaskSettings,
  CATEGORY_COLORS,
  PRIORITY_COLORS,
  getWeekDates,
  getToday,
  formatTime,
  generateTimeSlots,
} from './utils';

interface PlannerViewProps {
  tasks: TaskWithCategory[];
  categories: TaskCategory[];
  schedules: TaskSchedule[];
  settings: TaskSettings;
  onAddSchedule: (schedule: Omit<TaskSchedule, 'id' | 'user_id' | 'created_at'>) => TaskSchedule;
  onUpdateSchedule: (id: string, updates: Partial<TaskSchedule>) => void;
  onDeleteSchedule: (id: string) => void;
  onUpdateSettings: (updates: Partial<TaskSettings>) => void;
}

export function PlannerView({
  tasks,
  categories,
  schedules,
  settings,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  onUpdateSettings,
}: PlannerViewProps) {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [weekOffset, setWeekOffset] = useState(0);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
  const [draggedTask, setDraggedTask] = useState<TaskWithCategory | null>(null);

  // Get week dates based on offset
  const currentWeekStart = useMemo(() => {
    const today = new Date();
    today.setDate(today.getDate() + weekOffset * 7);
    return today;
  }, [weekOffset]);

  const weekDates = useMemo(() => getWeekDates(currentWeekStart), [currentWeekStart]);

  // Generate time slots
  const timeSlots = useMemo(
    () => generateTimeSlots(settings.workday_start, settings.workday_end),
    [settings.workday_start, settings.workday_end]
  );

  // Get tasks due on selected date
  const tasksDueOnDate = useMemo(() => {
    return tasks.filter((t) => t.due_date === selectedDate && t.status !== 'done');
  }, [tasks, selectedDate]);

  // Get scheduled tasks for selected date
  const scheduledOnDate = useMemo(() => {
    return schedules.filter((s) => s.scheduled_date === selectedDate);
  }, [schedules, selectedDate]);

  // Get unscheduled tasks (not done, with due date in the current week or earlier)
  const unscheduledTasks = useMemo(() => {
    const weekEndStr = weekDates[6].dateStr;
    return tasks.filter((t) => {
      if (t.status === 'done') return false;
      const hasSchedule = schedules.some((s) => s.task_id === t.id);
      if (hasSchedule) return false;
      if (!t.due_date) return true; // Tasks without due date
      return t.due_date <= weekEndStr;
    });
  }, [tasks, schedules, weekDates]);

  // Count tasks due each day
  const taskCountByDay = useMemo(() => {
    const counts: Record<string, number> = {};
    weekDates.forEach((d) => {
      counts[d.dateStr] = tasks.filter(
        (t) => t.due_date === d.dateStr && t.status !== 'done'
      ).length;
    });
    return counts;
  }, [tasks, weekDates]);

  // Get task for a schedule
  const getTaskForSchedule = (schedule: TaskSchedule) => {
    return tasks.find((t) => t.id === schedule.task_id);
  };

  // Check if a time slot is occupied
  const getScheduleAtSlot = (time: string): TaskSchedule | null => {
    return scheduledOnDate.find((s) => {
      const slotMinutes = timeToMinutes(time);
      const startMinutes = timeToMinutes(s.start_time);
      const endMinutes = timeToMinutes(s.end_time);
      return slotMinutes >= startMinutes && slotMinutes < endMinutes;
    }) || null;
  };

  // Get visual position and height for scheduled block
  const getBlockStyle = (schedule: TaskSchedule) => {
    const startMinutes = timeToMinutes(schedule.start_time);
    const endMinutes = timeToMinutes(schedule.end_time);
    const dayStartMinutes = timeToMinutes(settings.workday_start);
    const slotHeight = 48; // 48px per 30-min slot

    const top = ((startMinutes - dayStartMinutes) / 30) * slotHeight;
    const height = ((endMinutes - startMinutes) / 30) * slotHeight;

    return { top: `${top}px`, height: `${height}px` };
  };

  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const handleSlotClick = (date: string, time: string) => {
    setSelectedSlot({ date, time });
    setShowAssignModal(true);
  };

  const handleAssignTask = (taskId: string, duration: number = 30) => {
    if (!selectedSlot) return;

    const startMinutes = timeToMinutes(selectedSlot.time);
    const endMinutes = startMinutes + duration;

    onAddSchedule({
      task_id: taskId,
      scheduled_date: selectedSlot.date,
      start_time: selectedSlot.time,
      end_time: minutesToTime(endMinutes),
    });

    setShowAssignModal(false);
    setSelectedSlot(null);
  };

  const handleRemoveSchedule = (scheduleId: string) => {
    onDeleteSchedule(scheduleId);
  };

  const handleDragStart = (task: TaskWithCategory) => {
    setDraggedTask(task);
  };

  const handleDrop = (date: string, time: string) => {
    if (!draggedTask) return;

    const startMinutes = timeToMinutes(time);
    const duration = draggedTask.estimate_minutes || 30;
    const endMinutes = startMinutes + duration;

    onAddSchedule({
      task_id: draggedTask.id,
      scheduled_date: date,
      start_time: time,
      end_time: minutesToTime(endMinutes),
    });

    setDraggedTask(null);
  };

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => setWeekOffset((prev) => prev - 1)}>
          ← Previous Week
        </Button>
        <div className="text-center">
          <h3 className="font-semibold">
            {weekDates[0].date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button
            className="text-sm text-primary-600 hover:underline"
            onClick={() => setWeekOffset(0)}
          >
            Go to This Week
          </button>
        </div>
        <Button variant="ghost" onClick={() => setWeekOffset((prev) => prev + 1)}>
          Next Week →
        </Button>
      </div>

      {/* Week Strip */}
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((day) => {
          const isToday = day.dateStr === getToday();
          const isSelected = day.dateStr === selectedDate;
          const taskCount = taskCountByDay[day.dateStr] || 0;

          return (
            <button
              key={day.dateStr}
              onClick={() => setSelectedDate(day.dateStr)}
              className={cn(
                'p-3 rounded-lg text-center transition-colors border',
                isSelected
                  ? 'bg-primary-600 text-white border-primary-600'
                  : isToday
                  ? 'bg-primary-50 border-primary-200'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              )}
            >
              <div className={cn('text-xs', isSelected ? 'text-primary-100' : 'text-gray-500')}>
                {day.dayName}
              </div>
              <div className={cn('text-lg font-semibold', isSelected ? 'text-white' : 'text-gray-900')}>
                {day.date.getDate()}
              </div>
              {taskCount > 0 && (
                <div className={cn(
                  'text-xs mt-1 px-2 py-0.5 rounded-full',
                  isSelected ? 'bg-white/20' : 'bg-amber-100 text-amber-700'
                )}>
                  {taskCount} due
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Day Timeline */}
        <div className="lg:col-span-2">
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-base">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative" style={{ minHeight: `${timeSlots.length * 48}px` }}>
                {/* Time slots */}
                {timeSlots.map((time, idx) => {
                  const existingSchedule = getScheduleAtSlot(time);
                  const isHourStart = time.endsWith(':00');

                  return (
                    <div
                      key={time}
                      className={cn(
                        'flex items-start h-12 border-t border-gray-100',
                        isHourStart && 'border-gray-200'
                      )}
                      onDragOver={(e) => { e.preventDefault(); }}
                      onDrop={() => handleDrop(selectedDate, time)}
                    >
                      <div className="w-16 text-xs text-gray-500 pt-1 pr-2 text-right">
                        {isHourStart && formatTime(time)}
                      </div>
                      <div
                        className={cn(
                          'flex-1 h-full cursor-pointer hover:bg-gray-50 transition-colors rounded',
                          !existingSchedule && 'border-l border-gray-100'
                        )}
                        onClick={() => !existingSchedule && handleSlotClick(selectedDate, time)}
                      />
                    </div>
                  );
                })}

                {/* Scheduled blocks */}
                {scheduledOnDate.map((schedule) => {
                  const task = getTaskForSchedule(schedule);
                  if (!task) return null;

                  const style = getBlockStyle(schedule);
                  const catColors = task.category ? CATEGORY_COLORS[task.category.color_key] : null;
                  const priorityColors = PRIORITY_COLORS[task.priority];

                  return (
                    <div
                      key={schedule.id}
                      className={cn(
                        'absolute left-16 right-2 rounded-lg p-2 border overflow-hidden group',
                        catColors ? `${catColors.bg} ${catColors.border}` : 'bg-gray-100 border-gray-200'
                      )}
                      style={style}
                    >
                      <div className="flex justify-between items-start">
                        <div className="min-w-0 flex-1">
                          <div className={cn('font-medium text-sm truncate', catColors?.text || 'text-gray-800')}>
                            {task.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                          </div>
                        </div>
                        <button
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-rose-600 transition-opacity"
                          onClick={() => handleRemoveSchedule(schedule.id)}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Unscheduled Tasks */}
        <div>
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-base">Unscheduled Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {unscheduledTasks.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  All tasks are scheduled or completed!
                </p>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {unscheduledTasks.map((task) => {
                    const catColors = task.category ? CATEGORY_COLORS[task.category.color_key] : null;
                    const priorityColors = PRIORITY_COLORS[task.priority];

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task)}
                        className={cn(
                          'p-3 rounded-lg border cursor-move hover:shadow-sm transition-shadow',
                          catColors ? `${catColors.bg} ${catColors.border}` : 'bg-white border-gray-200'
                        )}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0 flex-1">
                            <div className={cn('font-medium text-sm', catColors?.text || 'text-gray-800')}>
                              {task.title}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              <span className={cn('px-1.5 py-0.5 rounded text-xs', priorityColors.bg, priorityColors.text)}>
                                {priorityColors.label}
                              </span>
                              {task.estimate_minutes && (
                                <span className="px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                                  {task.estimate_minutes}m
                                </span>
                              )}
                              {task.due_date && (
                                <span className={cn(
                                  'px-1.5 py-0.5 rounded text-xs',
                                  task.due_date < getToday() ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-600'
                                )}>
                                  Due {new Date(task.due_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <p className="text-xs text-gray-400 mt-4 text-center">
                Drag tasks to the timeline or click a time slot to assign
              </p>
            </CardContent>
          </Card>

          {/* Tasks Due Today */}
          {tasksDueOnDate.length > 0 && (
            <Card variant="bordered" className="mt-4 bg-amber-50 border-amber-200">
              <CardHeader>
                <CardTitle className="text-base text-amber-800">Due Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tasksDueOnDate.map((task) => (
                    <div key={task.id} className="text-sm text-amber-800">
                      • {task.title}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Assign Task Modal */}
      {showAssignModal && selectedSlot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card variant="elevated" className="w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
            <CardHeader>
              <CardTitle>
                Assign Task at {formatTime(selectedSlot.time)}
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto flex-1">
              {unscheduledTasks.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No unscheduled tasks available.</p>
              ) : (
                <div className="space-y-2">
                  {unscheduledTasks.map((task) => {
                    const catColors = task.category ? CATEGORY_COLORS[task.category.color_key] : null;

                    return (
                      <button
                        key={task.id}
                        onClick={() => handleAssignTask(task.id, task.estimate_minutes || 30)}
                        className={cn(
                          'w-full text-left p-3 rounded-lg border hover:shadow-sm transition-shadow',
                          catColors ? `${catColors.bg} ${catColors.border}` : 'bg-white border-gray-200'
                        )}
                      >
                        <div className={cn('font-medium', catColors?.text || 'text-gray-800')}>
                          {task.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {task.estimate_minutes ? `${task.estimate_minutes} minutes` : '30 minutes (default)'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              <div className="mt-4 pt-4 border-t">
                <Button variant="ghost" className="w-full" onClick={() => setShowAssignModal(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
