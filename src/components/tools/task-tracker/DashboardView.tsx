'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import {
  TaskWithCategory,
  TaskCategory,
  TaskSettings,
  TaskMetrics,
  STATUS_COLORS,
  PRIORITY_COLORS,
  STATUSES,
  PRIORITIES,
} from './utils';

interface DashboardViewProps {
  tasks: TaskWithCategory[];
  categories: TaskCategory[];
  metrics: TaskMetrics;
  settings: TaskSettings;
  onUpdateSettings: (updates: Partial<TaskSettings>) => void;
}

export function DashboardView({
  tasks,
  categories,
  metrics,
  settings,
  onUpdateSettings,
}: DashboardViewProps) {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [tempSettings, setTempSettings] = useState(settings);

  const handleSaveSettings = () => {
    onUpdateSettings(tempSettings);
    setShowSettingsModal(false);
  };

  // Find max count for chart scaling
  const maxStatusCount = Math.max(...Object.values(metrics.tasksByStatus), 1);
  const maxPriorityCount = Math.max(...Object.values(metrics.tasksByPriority), 1);
  const maxTrendCount = Math.max(...metrics.weeklyCompletionTrend.map((w) => w.count), 1);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card variant="bordered" className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-gray-900">{metrics.openTasks}</div>
            <div className="text-sm text-gray-600 mt-1">Open Tasks</div>
          </CardContent>
        </Card>

        <Card variant="bordered" className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-emerald-600">{metrics.completedThisWeek}</div>
            <div className="text-sm text-gray-600 mt-1">Completed This Week</div>
          </CardContent>
        </Card>

        <Card variant="bordered" className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-rose-600">{metrics.overdue}</div>
            <div className="text-sm text-gray-600 mt-1">Overdue</div>
          </CardContent>
        </Card>

        <Card variant="bordered" className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-sky-600">
              {metrics.completionRateWeek.toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Weekly Rate</div>
          </CardContent>
        </Card>

        <Card variant="bordered" className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-violet-600">
              {metrics.completionRateMonth.toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">Monthly Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks by Status */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-base">Tasks by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {STATUSES.map((status) => {
                const count = metrics.tasksByStatus[status];
                const percentage = (count / maxStatusCount) * 100;
                const colors = STATUS_COLORS[status];
                return (
                  <div key={status} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">{colors.label}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all', colors.bg.replace('100', '500'))}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tasks by Priority */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-base">Open Tasks by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {PRIORITIES.map((priority) => {
                const count = metrics.tasksByPriority[priority];
                const percentage = (count / maxPriorityCount) * 100;
                const colors = PRIORITY_COLORS[priority];
                return (
                  <div key={priority} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">{colors.label}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all', colors.bg.replace('100', '500'))}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Completion Trend */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="text-base">Completion Trend (6 Weeks)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-32 gap-2">
              {metrics.weeklyCompletionTrend.map((week, i) => {
                const height = maxTrendCount > 0 ? (week.count / maxTrendCount) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-gray-100 rounded-t relative" style={{ height: '100px' }}>
                      <div
                        className="absolute bottom-0 w-full bg-emerald-500 rounded-t transition-all"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 truncate w-full text-center">
                      {week.week}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Impact Metric */}
      <Card variant="bordered" className="bg-gradient-to-r from-emerald-50 to-teal-50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Impact Metrics</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setShowSettingsModal(true)}>
            Settings
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-700">
                {metrics.totalEstimatedHoursCompleted.toFixed(1)}h
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Hours Completed (This Month)</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-700">
                {metrics.savedHours.toFixed(1)}h
              </div>
              <div className="text-sm text-gray-600 mt-1">Estimated Hours Saved</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <div className="text-sm text-gray-600">
                <strong>Formula:</strong> Hours Saved = Completed Hours x Efficiency Factor
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Current efficiency factor: {(settings.efficiency_factor * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                This estimates time saved through better task management and prioritization.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card variant="elevated" className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Impact Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Baseline Hours per Week"
                type="number"
                step="0.5"
                min="0"
                value={tempSettings.baseline_hours_per_week}
                onChange={(e) =>
                  setTempSettings((prev) => ({
                    ...prev,
                    baseline_hours_per_week: parseFloat(e.target.value) || 0,
                  }))
                }
                helperText="Your typical weekly task hours without the tracker"
              />
              <Input
                label="Efficiency Factor (%)"
                type="number"
                step="1"
                min="0"
                max="100"
                value={(tempSettings.efficiency_factor * 100).toFixed(0)}
                onChange={(e) =>
                  setTempSettings((prev) => ({
                    ...prev,
                    efficiency_factor: (parseFloat(e.target.value) || 0) / 100,
                  }))
                }
                helperText="Estimated percentage of time saved through better task management"
              />
              <Input
                label="Workday Start"
                type="time"
                value={tempSettings.workday_start}
                onChange={(e) =>
                  setTempSettings((prev) => ({ ...prev, workday_start: e.target.value }))
                }
              />
              <Input
                label="Workday End"
                type="time"
                value={tempSettings.workday_end}
                onChange={(e) =>
                  setTempSettings((prev) => ({ ...prev, workday_end: e.target.value }))
                }
              />
              <div className="flex gap-2 pt-4">
                <Button variant="ghost" className="flex-1" onClick={() => setShowSettingsModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1" onClick={handleSaveSettings}>
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
