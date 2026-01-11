'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// Types
type EventType = 'board-meeting' | 'offsite' | 'client-dinner' | 'conference' | 'all-hands' | 'investor-meeting' | 'site-visit' | 'other';
type TaskStatus = 'not-started' | 'in-progress' | 'blocked' | 'done';
type TaskPriority = 'low' | 'medium' | 'high';

interface Task {
  id: string;
  title: string;
  owner: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  notes: string;
  link: string;
  dependencyId: string;
  phaseId: string;
}

interface Phase {
  id: string;
  name: string;
  order: number;
}

interface EventConfig {
  name: string;
  type: EventType;
  location: string;
  startDate: string;
  endDate: string;
  timezone: string;
  attendeeCount: string;
  budget: string;
  stakeholders: string;
}

interface SavedEvent {
  id: string;
  name: string;
  config: EventConfig;
  phases: Phase[];
  tasks: Task[];
  savedAt: string;
}

interface EventTemplate {
  id: string;
  name: string;
  phases: Omit<Phase, 'id'>[];
  tasks: Omit<Task, 'id' | 'phaseId'>[];
}

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'board-meeting', label: 'Board Meeting' },
  { value: 'offsite', label: 'Offsite' },
  { value: 'client-dinner', label: 'Client Dinner' },
  { value: 'conference', label: 'Conference' },
  { value: 'all-hands', label: 'Internal All Hands' },
  { value: 'investor-meeting', label: 'Investor Meeting' },
  { value: 'site-visit', label: 'Site Visit' },
  { value: 'other', label: 'Other' },
];

const STATUSES: { value: TaskStatus; label: string; color: string }[] = [
  { value: 'not-started', label: 'Not Started', color: 'bg-gray-100 text-gray-700' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  { value: 'blocked', label: 'Blocked', color: 'bg-red-100 text-red-700' },
  { value: 'done', label: 'Done', color: 'bg-green-100 text-green-700' },
];

const PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const OWNER_PRESETS = ['EA', 'Executive', 'Team', 'Vendor', 'IT', 'HR', 'Finance'];

const DEFAULT_PHASES: Omit<Phase, 'id'>[] = [
  { name: 'Strategy & Goals', order: 0 },
  { name: 'Logistics & Venue', order: 1 },
  { name: 'Attendees & Invites', order: 2 },
  { name: 'Agenda & Content', order: 3 },
  { name: 'Vendors & Catering', order: 4 },
  { name: 'Travel & Accommodations', order: 5 },
  { name: 'Communications', order: 6 },
  { name: 'Day-Of Execution', order: 7 },
  { name: 'Post-Event Follow-Up', order: 8 },
];

const BUILT_IN_TEMPLATES: EventTemplate[] = [
  {
    id: 'board-meeting',
    name: 'Board Meeting',
    phases: [
      { name: 'Pre-Planning', order: 0 },
      { name: 'Materials & Deck', order: 1 },
      { name: 'Logistics', order: 2 },
      { name: 'Catering', order: 3 },
      { name: 'Day-Of', order: 4 },
      { name: 'Follow-Up', order: 5 },
    ],
    tasks: [
      { title: 'Confirm board meeting date with all directors', owner: 'EA', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Book boardroom and AV equipment', owner: 'EA', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Send calendar invites to board members', owner: 'EA', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Collect board deck materials from department heads', owner: 'EA', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Compile and format board deck', owner: 'EA', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Send board deck to members (advance review)', owner: 'EA', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Arrange catering and refreshments', owner: 'EA', dueDate: '', status: 'not-started', priority: 'medium', notes: '', link: '', dependencyId: '' },
      { title: 'Confirm dietary restrictions', owner: 'EA', dueDate: '', status: 'not-started', priority: 'medium', notes: '', link: '', dependencyId: '' },
      { title: 'Print materials and name tents', owner: 'EA', dueDate: '', status: 'not-started', priority: 'medium', notes: '', link: '', dependencyId: '' },
      { title: 'Test AV and video conferencing', owner: 'IT', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Greet board members on arrival', owner: 'EA', dueDate: '', status: 'not-started', priority: 'medium', notes: '', link: '', dependencyId: '' },
      { title: 'Distribute meeting minutes', owner: 'EA', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Send thank you notes', owner: 'Executive', dueDate: '', status: 'not-started', priority: 'low', notes: '', link: '', dependencyId: '' },
    ],
  },
  {
    id: 'offsite',
    name: 'Offsite',
    phases: [
      { name: 'Planning & Goals', order: 0 },
      { name: 'Venue & Logistics', order: 1 },
      { name: 'Travel', order: 2 },
      { name: 'Agenda & Activities', order: 3 },
      { name: 'Communications', order: 4 },
      { name: 'Day-Of', order: 5 },
      { name: 'Post-Event', order: 6 },
    ],
    tasks: [
      { title: 'Define offsite objectives with leadership', owner: 'Executive', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Set budget and get approval', owner: 'EA', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Research and shortlist venues', owner: 'EA', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Conduct site visit', owner: 'EA', dueDate: '', status: 'not-started', priority: 'medium', notes: '', link: '', dependencyId: '' },
      { title: 'Negotiate and sign venue contract', owner: 'EA', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Book group hotel block', owner: 'EA', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Arrange ground transportation', owner: 'EA', dueDate: '', status: 'not-started', priority: 'medium', notes: '', link: '', dependencyId: '' },
      { title: 'Coordinate flights for remote attendees', owner: 'EA', dueDate: '', status: 'not-started', priority: 'medium', notes: '', link: '', dependencyId: '' },
      { title: 'Build detailed agenda', owner: 'EA', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Plan team-building activities', owner: 'EA', dueDate: '', status: 'not-started', priority: 'medium', notes: '', link: '', dependencyId: '' },
      { title: 'Book dinner reservations', owner: 'EA', dueDate: '', status: 'not-started', priority: 'medium', notes: '', link: '', dependencyId: '' },
      { title: 'Send pre-offsite communication', owner: 'EA', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Create attendee packet', owner: 'EA', dueDate: '', status: 'not-started', priority: 'medium', notes: '', link: '', dependencyId: '' },
      { title: 'Send feedback survey', owner: 'EA', dueDate: '', status: 'not-started', priority: 'medium', notes: '', link: '', dependencyId: '' },
    ],
  },
  {
    id: 'client-dinner',
    name: 'Client Dinner',
    phases: [
      { name: 'Planning', order: 0 },
      { name: 'Restaurant & Menu', order: 1 },
      { name: 'Day-Of', order: 2 },
      { name: 'Follow-Up', order: 3 },
    ],
    tasks: [
      { title: 'Confirm dinner date with client and exec', owner: 'EA', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Research restaurant options', owner: 'EA', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Make reservation', owner: 'EA', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Request private room (if needed)', owner: 'EA', dueDate: '', status: 'not-started', priority: 'medium', notes: '', link: '', dependencyId: '' },
      { title: 'Confirm dietary restrictions', owner: 'EA', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Pre-select wine/menu (if appropriate)', owner: 'EA', dueDate: '', status: 'not-started', priority: 'low', notes: '', link: '', dependencyId: '' },
      { title: 'Provide credit card for payment', owner: 'EA', dueDate: '', status: 'not-started', priority: 'medium', notes: '', link: '', dependencyId: '' },
      { title: 'Prepare client brief for exec', owner: 'EA', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Arrange transportation', owner: 'EA', dueDate: '', status: 'not-started', priority: 'medium', notes: '', link: '', dependencyId: '' },
      { title: 'Send thank you note', owner: 'Executive', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
    ],
  },
  {
    id: 'conference',
    name: 'Conference',
    phases: [
      { name: 'Registration & Planning', order: 0 },
      { name: 'Travel & Hotel', order: 1 },
      { name: 'Booth & Collateral', order: 2 },
      { name: 'Meetings & Events', order: 3 },
      { name: 'Day-Of', order: 4 },
      { name: 'Post-Conference', order: 5 },
    ],
    tasks: [
      { title: 'Register attendees for conference', owner: 'EA', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Book flights', owner: 'EA', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Book hotel rooms', owner: 'EA', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Reserve booth space', owner: 'EA', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Order booth materials and signage', owner: 'Vendor', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Print collateral and swag', owner: 'Vendor', dueDate: '', status: 'not-started', priority: 'medium', notes: '', link: '', dependencyId: '' },
      { title: 'Ship materials to venue', owner: 'EA', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Schedule customer meetings', owner: 'EA', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Book dinner reservations', owner: 'EA', dueDate: '', status: 'not-started', priority: 'medium', notes: '', link: '', dependencyId: '' },
      { title: 'Create exec briefing doc', owner: 'EA', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Set up booth', owner: 'Team', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Collect leads and business cards', owner: 'Team', dueDate: '', status: 'not-started', priority: 'medium', notes: '', link: '', dependencyId: '' },
      { title: 'Send follow-up emails to leads', owner: 'Team', dueDate: '', status: 'not-started', priority: 'high', notes: '', link: '', dependencyId: '' },
      { title: 'Submit expense reports', owner: 'EA', dueDate: '', status: 'not-started', priority: 'medium', notes: '', link: '', dependencyId: '' },
    ],
  },
];

const STORAGE_KEY = 'eawiz_event_checklists_v1';

export function EventChecklistBuilder() {
  // Config state
  const [config, setConfig] = useState<EventConfig>({
    name: 'New Event',
    type: 'other',
    location: '',
    startDate: '',
    endDate: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    attendeeCount: '',
    budget: '',
    stakeholders: '',
  });

  // Data state
  const [phases, setPhases] = useState<Phase[]>(
    DEFAULT_PHASES.map((p, i) => ({ ...p, id: `phase-${i}` }))
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>([]);
  const [customTemplates, setCustomTemplates] = useState<EventTemplate[]>([]);

  // UI state
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterOwner, setFilterOwner] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | ''>('');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | ''>('');
  const [outputGrouping, setOutputGrouping] = useState<'phase' | 'owner' | 'date'>('phase');
  const [includeCompleted, setIncludeCompleted] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newPhaseName, setNewPhaseName] = useState('');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.savedEvents) setSavedEvents(data.savedEvents);
        if (data.customTemplates) setCustomTemplates(data.customTemplates);
        if (data.currentEvent) {
          setConfig(data.currentEvent.config);
          setPhases(data.currentEvent.phases);
          setTasks(data.currentEvent.tasks);
        }
      } catch {
        // Invalid data
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      savedEvents,
      customTemplates,
      currentEvent: { config, phases, tasks },
    }));
  }, [savedEvents, customTemplates, config, phases, tasks]);

  // Add phase
  const addPhase = () => {
    if (!newPhaseName.trim()) return;
    const newPhase: Phase = {
      id: `phase-${Date.now()}`,
      name: newPhaseName.trim(),
      order: phases.length,
    };
    setPhases(prev => [...prev, newPhase]);
    setNewPhaseName('');
  };

  // Delete phase
  const deletePhase = (id: string) => {
    setPhases(prev => prev.filter(p => p.id !== id));
    setTasks(prev => prev.filter(t => t.phaseId !== id));
  };

  // Add task
  const addTask = (phaseId: string) => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      owner: 'EA',
      dueDate: '',
      status: 'not-started',
      priority: 'medium',
      notes: '',
      link: '',
      dependencyId: '',
      phaseId,
    };
    setTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
  };

  // Update task
  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    if (editingTask?.id === id) {
      setEditingTask(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  // Delete task
  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setEditingTask(null);
  };

  // Mark all tasks in phase as done
  const markPhaseDone = (phaseId: string) => {
    setTasks(prev => prev.map(t =>
      t.phaseId === phaseId ? { ...t, status: 'done' as TaskStatus } : t
    ));
  };

  // Load template
  const loadTemplate = (template: EventTemplate) => {
    const newPhases = template.phases.map((p, i) => ({
      ...p,
      id: `phase-${Date.now()}-${i}`,
    }));

    const newTasks = template.tasks.map((t, i) => ({
      ...t,
      id: `task-${Date.now()}-${i}`,
      phaseId: newPhases[Math.min(i % newPhases.length, newPhases.length - 1)]?.id || '',
    }));

    // Distribute tasks to phases more intelligently
    const phaseTaskMap: Record<string, number> = {};
    newPhases.forEach(p => { phaseTaskMap[p.id] = 0; });

    // Assign tasks round-robin style based on template structure
    const tasksPerPhase = Math.ceil(template.tasks.length / template.phases.length);
    newTasks.forEach((t, i) => {
      const phaseIndex = Math.floor(i / tasksPerPhase);
      t.phaseId = newPhases[Math.min(phaseIndex, newPhases.length - 1)]?.id || newPhases[0]?.id || '';
    });

    setPhases(newPhases);
    setTasks(newTasks);
  };

  // Save as template
  const saveAsTemplate = () => {
    const name = prompt('Enter template name:');
    if (!name) return;

    const template: EventTemplate = {
      id: `template-${Date.now()}`,
      name,
      phases: phases.map(p => ({ name: p.name, order: p.order })),
      tasks: tasks.map(t => ({
        title: t.title,
        owner: t.owner,
        dueDate: '',
        status: 'not-started',
        priority: t.priority,
        notes: '',
        link: '',
        dependencyId: '',
      })),
    };

    setCustomTemplates(prev => [...prev, template]);
  };

  // Delete custom template
  const deleteTemplate = (id: string) => {
    setCustomTemplates(prev => prev.filter(t => t.id !== id));
  };

  // Save event
  const saveEvent = () => {
    const newSaved: SavedEvent = {
      id: `event-${Date.now()}`,
      name: config.name,
      config,
      phases,
      tasks,
      savedAt: new Date().toISOString(),
    };
    setSavedEvents(prev => [...prev, newSaved]);
  };

  // Load event
  const loadEvent = (event: SavedEvent) => {
    setConfig(event.config);
    setPhases(event.phases);
    setTasks(event.tasks);
  };

  // Duplicate event
  const duplicateEvent = (event: SavedEvent) => {
    const name = prompt('Enter name for duplicate:', `${event.name} (Copy)`);
    if (!name) return;
    setConfig({ ...event.config, name });
    setPhases(event.phases.map(p => ({ ...p, id: `phase-${Date.now()}-${p.order}` })));
    setTasks(event.tasks.map((t, i) => ({ ...t, id: `task-${Date.now()}-${i}` })));
  };

  // Delete saved event
  const deleteSavedEvent = (id: string) => {
    setSavedEvents(prev => prev.filter(e => e.id !== id));
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (filterOwner && !t.owner.toLowerCase().includes(filterOwner.toLowerCase())) return false;
      if (filterStatus && t.status !== filterStatus) return false;
      if (filterPriority && t.priority !== filterPriority) return false;
      return true;
    });
  }, [tasks, filterOwner, filterStatus, filterPriority]);

  // Timeline buckets
  const timelineBuckets = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
    const endOfNextWeek = new Date(endOfWeek);
    endOfNextWeek.setDate(endOfWeek.getDate() + 7);

    const buckets = {
      overdue: [] as Task[],
      thisWeek: [] as Task[],
      nextWeek: [] as Task[],
      later: [] as Task[],
      noDueDate: [] as Task[],
    };

    tasks.forEach(t => {
      if (t.status === 'done') return;
      if (!t.dueDate) {
        buckets.noDueDate.push(t);
        return;
      }
      const due = new Date(t.dueDate);
      due.setHours(0, 0, 0, 0);
      if (due < now) buckets.overdue.push(t);
      else if (due <= endOfWeek) buckets.thisWeek.push(t);
      else if (due <= endOfNextWeek) buckets.nextWeek.push(t);
      else buckets.later.push(t);
    });

    return buckets;
  }, [tasks]);

  // Generate outputs
  const generateOutput = useCallback((type: 'internal' | 'vendor' | 'exec') => {
    let output = '';
    const visibleTasks = includeCompleted
      ? tasks
      : tasks.filter(t => t.status !== 'done');

    // Filter for vendor/exec
    let filtered = visibleTasks;
    if (type === 'vendor') {
      filtered = visibleTasks.filter(t =>
        t.owner.toLowerCase().includes('vendor')
      );
    } else if (type === 'exec') {
      filtered = visibleTasks.filter(t =>
        t.priority === 'high' || t.status === 'blocked'
      );
    }

    output += `${config.name.toUpperCase()}\n`;
    output += `${'='.repeat(50)}\n`;
    if (config.location) output += `Location: ${config.location}\n`;
    if (config.startDate) {
      output += `Date: ${config.startDate}`;
      if (config.endDate && config.endDate !== config.startDate) {
        output += ` to ${config.endDate}`;
      }
      output += '\n';
    }
    output += `Generated: ${new Date().toLocaleDateString()}\n\n`;

    if (type === 'exec') {
      output += 'KEY MILESTONES & BLOCKERS\n';
      output += '-'.repeat(40) + '\n';
    }

    if (outputGrouping === 'phase') {
      phases.forEach(phase => {
        const phaseTasks = filtered.filter(t => t.phaseId === phase.id);
        if (phaseTasks.length === 0) return;

        output += `\n${phase.name.toUpperCase()}\n`;
        phaseTasks.forEach(t => {
          const statusIcon = t.status === 'done' ? '[x]' : t.status === 'blocked' ? '[!]' : '[ ]';
          output += `${statusIcon} ${t.title}`;
          if (t.owner) output += ` (${t.owner})`;
          if (t.dueDate) output += ` - Due: ${t.dueDate}`;
          output += '\n';
          if (includeNotes && t.notes) output += `    Notes: ${t.notes}\n`;
          if (includeNotes && t.link) output += `    Link: ${t.link}\n`;
        });
      });
    } else if (outputGrouping === 'owner') {
      const owners = Array.from(new Set(filtered.map(t => t.owner || 'Unassigned')));
      owners.forEach(owner => {
        const ownerTasks = filtered.filter(t => (t.owner || 'Unassigned') === owner);
        if (ownerTasks.length === 0) return;

        output += `\n${owner.toUpperCase()}\n`;
        ownerTasks.forEach(t => {
          const statusIcon = t.status === 'done' ? '[x]' : t.status === 'blocked' ? '[!]' : '[ ]';
          output += `${statusIcon} ${t.title}`;
          if (t.dueDate) output += ` - Due: ${t.dueDate}`;
          output += '\n';
        });
      });
    } else {
      // By date
      const byDate: Record<string, Task[]> = {};
      filtered.forEach(t => {
        const key = t.dueDate || 'No Due Date';
        if (!byDate[key]) byDate[key] = [];
        byDate[key].push(t);
      });
      Object.keys(byDate).sort().forEach(date => {
        output += `\n${date}\n`;
        byDate[date].forEach(t => {
          const statusIcon = t.status === 'done' ? '[x]' : t.status === 'blocked' ? '[!]' : '[ ]';
          output += `${statusIcon} ${t.title} (${t.owner || 'Unassigned'})\n`;
        });
      });
    }

    // Summary stats
    output += '\n' + '-'.repeat(40) + '\n';
    output += `Total: ${filtered.length} tasks | `;
    output += `Done: ${filtered.filter(t => t.status === 'done').length} | `;
    output += `In Progress: ${filtered.filter(t => t.status === 'in-progress').length} | `;
    output += `Blocked: ${filtered.filter(t => t.status === 'blocked').length}\n`;

    return output;
  }, [tasks, phases, config, includeCompleted, includeNotes, outputGrouping]);

  // Copy to clipboard
  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  // Export JSON
  const exportJSON = () => {
    const data = { config, phases, tasks };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event-checklist-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.config) setConfig(data.config);
        if (data.phases) setPhases(data.phases);
        if (data.tasks) setTasks(data.tasks);
        alert('Event imported successfully!');
      } catch {
        alert('Failed to import. Invalid JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Reset
  const resetEvent = () => {
    if (!confirm('Reset this event? All unsaved changes will be lost.')) return;
    setConfig({
      name: 'New Event',
      type: 'other',
      location: '',
      startDate: '',
      endDate: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      attendeeCount: '',
      budget: '',
      stakeholders: '',
    });
    setPhases(DEFAULT_PHASES.map((p, i) => ({ ...p, id: `phase-${Date.now()}-${i}` })));
    setTasks([]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Panel - Setup & Templates */}
      <div className="lg:col-span-3 space-y-4">
        {/* Event Setup */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Event Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
              <select
                value={config.type}
                onChange={(e) => setConfig(prev => ({ ...prev, type: e.target.value as EventType }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              >
                {EVENT_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={config.location}
                onChange={(e) => setConfig(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., NYC Office, Marriott Downtown"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                <input
                  type="date"
                  value={config.startDate}
                  onChange={(e) => setConfig(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">End Date</label>
                <input
                  type="date"
                  value={config.endDate}
                  onChange={(e) => setConfig(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stakeholders</label>
              <input
                type="text"
                value={config.stakeholders}
                onChange={(e) => setConfig(prev => ({ ...prev, stakeholders: e.target.value }))}
                placeholder="VIPs, hosts, key attendees"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Templates */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Templates</CardTitle>
            <CardDescription>Load a pre-built checklist</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-gray-500 font-medium">Built-in</p>
            {BUILT_IN_TEMPLATES.map(template => (
              <button
                key={template.id}
                onClick={() => loadTemplate(template)}
                className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded"
              >
                {template.name}
              </button>
            ))}
            {customTemplates.length > 0 && (
              <>
                <p className="text-xs text-gray-500 font-medium mt-3">Custom</p>
                {customTemplates.map(template => (
                  <div key={template.id} className="flex items-center gap-2">
                    <button
                      onClick={() => loadTemplate(template)}
                      className="flex-1 text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded"
                    >
                      {template.name}
                    </button>
                    <button
                      onClick={() => deleteTemplate(template.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </>
            )}
            <Button variant="outline" size="sm" className="w-full mt-2" onClick={saveAsTemplate}>
              Save Current as Template
            </Button>
          </CardContent>
        </Card>

        {/* Saved Events */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Saved Events</CardTitle>
          </CardHeader>
          <CardContent>
            {savedEvents.length === 0 ? (
              <p className="text-sm text-gray-500">No saved events.</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {savedEvents.map(event => (
                  <div key={event.id} className="flex items-center gap-2 text-sm">
                    <button
                      onClick={() => loadEvent(event)}
                      className="flex-1 text-left truncate hover:text-primary-600"
                    >
                      {event.name}
                    </button>
                    <button
                      onClick={() => duplicateEvent(event)}
                      className="text-gray-400 hover:text-blue-500"
                      title="Duplicate"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteSavedEvent(event.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <Button variant="primary" size="sm" className="w-full mt-3" onClick={saveEvent}>
              Save Current Event
            </Button>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Owner</label>
              <input
                type="text"
                value={filterOwner}
                onChange={(e) => setFilterOwner(e.target.value)}
                placeholder="Filter by owner..."
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as TaskStatus | '')}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="">All</option>
                {STATUSES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Priority</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as TaskPriority | '')}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="">All</option>
                {PRIORITIES.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Center Panel - Checklist Editor */}
      <div className="lg:col-span-5 space-y-4">
        {/* Timeline Summary */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2 text-center text-sm">
              <div className={`p-2 rounded ${timelineBuckets.overdue.length > 0 ? 'bg-red-100' : 'bg-gray-50'}`}>
                <div className={`text-xl font-bold ${timelineBuckets.overdue.length > 0 ? 'text-red-700' : 'text-gray-400'}`}>
                  {timelineBuckets.overdue.length}
                </div>
                <div className="text-xs text-gray-600">Overdue</div>
              </div>
              <div className={`p-2 rounded ${timelineBuckets.thisWeek.length > 0 ? 'bg-yellow-100' : 'bg-gray-50'}`}>
                <div className="text-xl font-bold text-yellow-700">{timelineBuckets.thisWeek.length}</div>
                <div className="text-xs text-gray-600">This Week</div>
              </div>
              <div className="p-2 rounded bg-gray-50">
                <div className="text-xl font-bold text-blue-700">{timelineBuckets.nextWeek.length}</div>
                <div className="text-xs text-gray-600">Next Week</div>
              </div>
              <div className="p-2 rounded bg-gray-50">
                <div className="text-xl font-bold text-gray-600">{timelineBuckets.later.length}</div>
                <div className="text-xs text-gray-600">Later</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Phase */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newPhaseName}
            onChange={(e) => setNewPhaseName(e.target.value)}
            placeholder="Add new phase..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            onKeyDown={(e) => e.key === 'Enter' && addPhase()}
          />
          <Button variant="secondary" size="sm" onClick={addPhase}>Add Phase</Button>
        </div>

        {/* Phases & Tasks */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {phases.sort((a, b) => a.order - b.order).map(phase => {
            const phaseTasks = filteredTasks.filter(t => t.phaseId === phase.id);
            const completedCount = phaseTasks.filter(t => t.status === 'done').length;

            return (
              <Card key={phase.id} variant="bordered">
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{phase.name}</CardTitle>
                      <Badge variant="default" size="sm">
                        {completedCount}/{phaseTasks.length}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => markPhaseDone(phase.id)}
                        className="text-xs text-gray-500 hover:text-green-600 px-2"
                        title="Mark all done"
                      >
                        ✓ All
                      </button>
                      <button
                        onClick={() => deletePhase(phase.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Task List */}
                  <div className="space-y-2">
                    {phaseTasks.map(task => (
                      <div
                        key={task.id}
                        className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${
                          task.status === 'done' ? 'bg-green-50 border-green-200' :
                          task.status === 'blocked' ? 'bg-red-50 border-red-200' :
                          'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setEditingTask(task)}
                      >
                        <select
                          value={task.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateTask(task.id, { status: e.target.value as TaskStatus });
                          }}
                          className="text-xs px-1 py-0.5 border rounded bg-white"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {STATUSES.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                        <span className={`flex-1 text-sm ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>
                          {task.title}
                        </span>
                        {task.priority === 'high' && (
                          <Badge variant="danger" size="sm">High</Badge>
                        )}
                        {task.owner && (
                          <span className="text-xs text-gray-500">{task.owner}</span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(task.id);
                          }}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Quick Add Task */}
                  {selectedPhase === phase.id ? (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Task title..."
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') addTask(phase.id);
                          if (e.key === 'Escape') setSelectedPhase(null);
                        }}
                        autoFocus
                      />
                      <Button variant="primary" size="sm" onClick={() => addTask(phase.id)}>Add</Button>
                      <Button variant="outline" size="sm" onClick={() => setSelectedPhase(null)}>Cancel</Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedPhase(phase.id)}
                      className="w-full mt-2 py-1 text-sm text-gray-500 hover:text-primary-600 hover:bg-gray-50 rounded border border-dashed border-gray-300"
                    >
                      + Add Task
                    </button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Task Editor Modal */}
        {editingTask && (
          <Card variant="bordered" className="border-primary-300">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Edit Task</CardTitle>
                <button onClick={() => setEditingTask(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Title</label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => updateTask(editingTask.id, { title: e.target.value })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Owner</label>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={editingTask.owner}
                      onChange={(e) => updateTask(editingTask.id, { owner: e.target.value })}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <select
                      value=""
                      onChange={(e) => updateTask(editingTask.id, { owner: e.target.value })}
                      className="px-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="">+</option>
                      {OWNER_PRESETS.map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={editingTask.dueDate}
                    onChange={(e) => updateTask(editingTask.id, { dueDate: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Status</label>
                  <select
                    value={editingTask.status}
                    onChange={(e) => updateTask(editingTask.id, { status: e.target.value as TaskStatus })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    {STATUSES.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Priority</label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) => updateTask(editingTask.id, { priority: e.target.value as TaskPriority })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    {PRIORITIES.map(p => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Notes</label>
                <textarea
                  value={editingTask.notes}
                  onChange={(e) => updateTask(editingTask.id, { notes: e.target.value })}
                  rows={2}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Link</label>
                <input
                  type="url"
                  value={editingTask.link}
                  onChange={(e) => updateTask(editingTask.id, { link: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right Panel - Outputs */}
      <div className="lg:col-span-4 space-y-4">
        {/* Output Options */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Output Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Group By</label>
              <select
                value={outputGrouping}
                onChange={(e) => setOutputGrouping(e.target.value as 'phase' | 'owner' | 'date')}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="phase">Phase</option>
                <option value="owner">Owner</option>
                <option value="date">Due Date</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includeCompleted}
                onChange={(e) => setIncludeCompleted(e.target.checked)}
                className="rounded"
              />
              Include completed tasks
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={includeNotes}
                onChange={(e) => setIncludeNotes(e.target.checked)}
                className="rounded"
              />
              Include notes & links
            </label>
          </CardContent>
        </Card>

        {/* Internal Summary */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Internal Summary</CardTitle>
            <CardDescription>Full checklist for EA team</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-50 p-3 rounded border text-xs max-h-40 overflow-y-auto whitespace-pre-wrap font-mono">
              {generateOutput('internal')}
            </pre>
            <Button
              variant="primary"
              size="sm"
              className="w-full mt-3"
              onClick={() => copyToClipboard(generateOutput('internal'), 'internal')}
            >
              {copied === 'internal' ? 'Copied!' : 'Copy Internal Summary'}
            </Button>
          </CardContent>
        </Card>

        {/* Vendor Summary */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Vendor Summary</CardTitle>
            <CardDescription>Tasks assigned to vendors only</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-50 p-3 rounded border text-xs max-h-32 overflow-y-auto whitespace-pre-wrap font-mono">
              {generateOutput('vendor')}
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3"
              onClick={() => copyToClipboard(generateOutput('vendor'), 'vendor')}
            >
              {copied === 'vendor' ? 'Copied!' : 'Copy Vendor Summary'}
            </Button>
          </CardContent>
        </Card>

        {/* Exec Summary */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Exec Summary</CardTitle>
            <CardDescription>High-priority items & blockers</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-50 p-3 rounded border text-xs max-h-32 overflow-y-auto whitespace-pre-wrap font-mono">
              {generateOutput('exec')}
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3"
              onClick={() => copyToClipboard(generateOutput('exec'), 'exec')}
            >
              {copied === 'exec' ? 'Copied!' : 'Copy Exec Summary'}
            </Button>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="secondary" size="sm" className="w-full" onClick={exportJSON}>
              Export JSON
            </Button>
            <label className="block cursor-pointer">
              <span className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors">
                Import JSON
              </span>
              <input type="file" accept=".json" onChange={importJSON} className="hidden" />
            </label>
            <Button variant="outline" size="sm" className="w-full" onClick={resetEvent}>
              Reset Event
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
