'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// Types
type MessageCategory = 'urgent' | 'needs-exec-decision' | 'ea-can-handle' | 'waiting' | 'fyi' | 'archive';
type MessageStatus = 'new' | 'in-progress' | 'waiting' | 'completed';

interface TriageMessage {
  id: string;
  content: string;
  subject: string;
  sender: string;
  category: MessageCategory;
  status: MessageStatus;
  notes: string;
  followUpDate: string;
  createdAt: string;
}

interface TriageSession {
  id: string;
  name: string;
  messages: TriageMessage[];
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES: { value: MessageCategory; label: string; color: string; description: string }[] = [
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 border-red-300 text-red-800', description: 'Requires immediate attention' },
  { value: 'needs-exec-decision', label: 'Needs Exec Decision', color: 'bg-orange-100 border-orange-300 text-orange-800', description: 'Exec must weigh in' },
  { value: 'ea-can-handle', label: 'EA Can Handle', color: 'bg-green-100 border-green-300 text-green-800', description: 'EA can respond/action' },
  { value: 'waiting', label: 'Waiting', color: 'bg-yellow-100 border-yellow-300 text-yellow-800', description: 'Pending external response' },
  { value: 'fyi', label: 'FYI', color: 'bg-blue-100 border-blue-300 text-blue-800', description: 'Informational only' },
  { value: 'archive', label: 'Archive', color: 'bg-gray-100 border-gray-300 text-gray-600', description: 'No action needed' },
];

const STATUSES: { value: MessageStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'waiting', label: 'Waiting' },
  { value: 'completed', label: 'Completed' },
];

const STORAGE_KEY = 'eawiz-inbox-intelligence';

export function InboxIntelligence() {
  // State
  const [inboxText, setInboxText] = useState('');
  const [messages, setMessages] = useState<TriageMessage[]>([]);
  const [sessions, setSessions] = useState<TriageSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessionName, setSessionName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MessageCategory | 'all'>('all');
  const [selectedMessage, setSelectedMessage] = useState<TriageMessage | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSessions(data.sessions || []);
        if (data.currentSessionId) {
          setCurrentSessionId(data.currentSessionId);
          const session = data.sessions?.find((s: TriageSession) => s.id === data.currentSessionId);
          if (session) {
            setMessages(session.messages || []);
            setSessionName(session.name || '');
          }
        }
      } catch {
        // Invalid data
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (currentSessionId) {
      const updatedSessions = sessions.map(s =>
        s.id === currentSessionId
          ? { ...s, messages, name: sessionName, updatedAt: new Date().toISOString() }
          : s
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        sessions: updatedSessions,
        currentSessionId,
      }));
    } else if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ sessions, currentSessionId }));
    }
  }, [messages, sessions, currentSessionId, sessionName]);

  // Parse inbox text into messages
  const parseInbox = () => {
    if (!inboxText.trim()) return;

    const blocks = inboxText.split(/\n\s*\n/).filter(b => b.trim());
    const newMessages: TriageMessage[] = blocks.map((block, idx) => {
      const lines = block.trim().split('\n');
      let subject = '';
      let sender = '';
      let content = block.trim();

      // Try to extract subject and sender from common email formats
      for (const line of lines) {
        if (line.toLowerCase().startsWith('subject:')) {
          subject = line.replace(/^subject:\s*/i, '').trim();
        } else if (line.toLowerCase().startsWith('from:')) {
          sender = line.replace(/^from:\s*/i, '').trim();
        } else if (line.toLowerCase().startsWith('re:')) {
          subject = line.trim();
        }
      }

      // If no subject found, use first line truncated
      if (!subject) {
        subject = lines[0].substring(0, 60) + (lines[0].length > 60 ? '...' : '');
      }

      return {
        id: `msg-${Date.now()}-${idx}`,
        content,
        subject,
        sender,
        category: 'fyi' as MessageCategory, // Default category
        status: 'new' as MessageStatus,
        notes: '',
        followUpDate: '',
        createdAt: new Date().toISOString(),
      };
    });

    setMessages(prev => [...prev, ...newMessages]);
    setInboxText('');

    // Create session if not exists
    if (!currentSessionId) {
      const newSession: TriageSession = {
        id: `session-${Date.now()}`,
        name: sessionName || `Triage ${new Date().toLocaleDateString()}`,
        messages: newMessages,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSessions(prev => [...prev, newSession]);
      setCurrentSessionId(newSession.id);
      setSessionName(newSession.name);
    }
  };

  // Update message
  const updateMessage = (id: string, updates: Partial<TriageMessage>) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    if (selectedMessage?.id === id) {
      setSelectedMessage(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  // Delete message
  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
  };

  // New session
  const newSession = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setSessionName('');
    setSelectedMessage(null);
    setInboxText('');
  };

  // Load session
  const loadSession = (session: TriageSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    setSessionName(session.name);
    setSelectedMessage(null);
  };

  // Delete session
  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (currentSessionId === id) {
      newSession();
    }
  };

  // Filter messages
  const filteredMessages = messages.filter(m => {
    if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
    if (!showCompleted && m.status === 'completed') return false;
    return true;
  });

  // Group messages by category
  const groupedMessages = CATEGORIES.reduce((acc, cat) => {
    acc[cat.value] = filteredMessages.filter(m => m.category === cat.value);
    return acc;
  }, {} as Record<MessageCategory, TriageMessage[]>);

  // Generate outputs
  const generateExecSummary = () => {
    const urgent = messages.filter(m => m.category === 'urgent' && m.status !== 'completed');
    const needsDecision = messages.filter(m => m.category === 'needs-exec-decision' && m.status !== 'completed');
    const fyi = messages.filter(m => m.category === 'fyi' && m.status !== 'completed');

    let summary = `INBOX SUMMARY - ${new Date().toLocaleDateString()}\n`;
    summary += `${'='.repeat(40)}\n\n`;

    if (urgent.length > 0) {
      summary += `🔴 URGENT (${urgent.length})\n`;
      urgent.forEach(m => {
        summary += `• ${m.subject}${m.sender ? ` (${m.sender})` : ''}\n`;
        if (m.notes) summary += `  Notes: ${m.notes}\n`;
      });
      summary += '\n';
    }

    if (needsDecision.length > 0) {
      summary += `🟠 NEEDS YOUR DECISION (${needsDecision.length})\n`;
      needsDecision.forEach(m => {
        summary += `• ${m.subject}${m.sender ? ` (${m.sender})` : ''}\n`;
        if (m.notes) summary += `  Notes: ${m.notes}\n`;
      });
      summary += '\n';
    }

    if (fyi.length > 0) {
      summary += `🔵 FYI (${fyi.length})\n`;
      fyi.forEach(m => {
        summary += `• ${m.subject}${m.sender ? ` (${m.sender})` : ''}\n`;
      });
      summary += '\n';
    }

    const total = messages.length;
    const completed = messages.filter(m => m.status === 'completed').length;
    summary += `\nTotal: ${total} messages | Completed: ${completed} | Remaining: ${total - completed}`;

    return summary;
  };

  const generateEAActionList = () => {
    const eaActions = messages.filter(m => m.category === 'ea-can-handle' && m.status !== 'completed');
    const waiting = messages.filter(m => m.category === 'waiting' && m.status !== 'completed');
    const followUps = messages.filter(m => m.followUpDate && m.status !== 'completed');

    let list = `EA ACTION LIST - ${new Date().toLocaleDateString()}\n`;
    list += `${'='.repeat(40)}\n\n`;

    if (eaActions.length > 0) {
      list += `TO DO (${eaActions.length})\n`;
      eaActions.forEach((m, i) => {
        list += `${i + 1}. ${m.subject}\n`;
        if (m.sender) list += `   From: ${m.sender}\n`;
        if (m.notes) list += `   Action: ${m.notes}\n`;
        list += `   Status: ${STATUSES.find(s => s.value === m.status)?.label}\n\n`;
      });
    }

    if (waiting.length > 0) {
      list += `\nWAITING ON OTHERS (${waiting.length})\n`;
      waiting.forEach((m, i) => {
        list += `${i + 1}. ${m.subject}`;
        if (m.sender) list += ` (${m.sender})`;
        list += '\n';
        if (m.notes) list += `   Notes: ${m.notes}\n`;
      });
    }

    if (followUps.length > 0) {
      list += `\nFOLLOW-UPS SCHEDULED\n`;
      followUps.sort((a, b) => a.followUpDate.localeCompare(b.followUpDate)).forEach(m => {
        list += `• ${m.followUpDate}: ${m.subject}\n`;
      });
    }

    return list;
  };

  const generateFollowUpTracker = () => {
    const withFollowUp = messages.filter(m => m.followUpDate).sort((a, b) => a.followUpDate.localeCompare(b.followUpDate));

    let tracker = `FOLLOW-UP TRACKER\n`;
    tracker += `${'='.repeat(40)}\n\n`;

    if (withFollowUp.length === 0) {
      tracker += 'No follow-ups scheduled.\n';
    } else {
      const byDate = withFollowUp.reduce((acc, m) => {
        if (!acc[m.followUpDate]) acc[m.followUpDate] = [];
        acc[m.followUpDate].push(m);
        return acc;
      }, {} as Record<string, TriageMessage[]>);

      Object.entries(byDate).forEach(([date, msgs]) => {
        tracker += `${date}\n`;
        msgs.forEach(m => {
          const statusIcon = m.status === 'completed' ? '✓' : '○';
          tracker += `  ${statusIcon} ${m.subject}`;
          if (m.sender) tracker += ` (${m.sender})`;
          tracker += '\n';
        });
        tracker += '\n';
      });
    }

    return tracker;
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const getCategoryBadgeVariant = (category: MessageCategory): 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' => {
    switch (category) {
      case 'urgent': return 'danger';
      case 'needs-exec-decision': return 'warning';
      case 'ea-can-handle': return 'success';
      case 'waiting': return 'warning';
      case 'fyi': return 'info';
      case 'archive': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Panel - Input & Settings */}
      <div className="lg:col-span-3 space-y-4">
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Inbox Input</CardTitle>
            <CardDescription>Paste email content to triage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Name
              </label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="e.g., Monday Triage"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paste Emails
              </label>
              <textarea
                value={inboxText}
                onChange={(e) => setInboxText(e.target.value)}
                placeholder="Paste email content here...&#10;&#10;Separate multiple emails with blank lines.&#10;&#10;Tip: Include Subject: and From: lines for better parsing."
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>

            <Button variant="primary" className="w-full" onClick={parseInbox}>
              Add to Triage
            </Button>

            <Button variant="outline" className="w-full" onClick={newSession}>
              New Session
            </Button>
          </CardContent>
        </Card>

        {/* Saved Sessions */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Saved Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <p className="text-sm text-gray-500">No saved sessions yet.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {sessions.map(session => (
                  <div
                    key={session.id}
                    className={`p-2 rounded border cursor-pointer hover:bg-gray-50 ${
                      currentSessionId === session.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                    }`}
                    onClick={() => loadSession(session)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{session.name}</p>
                        <p className="text-xs text-gray-500">
                          {session.messages.length} messages
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.id);
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filters */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as MessageCategory | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Show completed</span>
            </label>
          </CardContent>
        </Card>
      </div>

      {/* Center Panel - Message Board */}
      <div className="lg:col-span-5 space-y-4">
        <Card variant="bordered">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Message Board</CardTitle>
                <CardDescription>
                  {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
                  {selectedCategory !== 'all' && ` in ${CATEGORIES.find(c => c.value === selectedCategory)?.label}`}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="default">{messages.filter(m => m.status === 'new').length} New</Badge>
                <Badge variant="success">{messages.filter(m => m.status === 'completed').length} Done</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredMessages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No messages to display.</p>
                <p className="text-sm mt-1">Paste email content in the left panel to get started.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {selectedCategory === 'all' ? (
                  // Show grouped by category
                  CATEGORIES.map(cat => {
                    const catMessages = groupedMessages[cat.value];
                    if (catMessages.length === 0) return null;
                    return (
                      <div key={cat.value} className="mb-4">
                        <h3 className={`text-sm font-semibold mb-2 px-2 py-1 rounded ${cat.color}`}>
                          {cat.label} ({catMessages.length})
                        </h3>
                        <div className="space-y-2">
                          {catMessages.map(msg => (
                            <MessageCard
                              key={msg.id}
                              message={msg}
                              isSelected={selectedMessage?.id === msg.id}
                              onSelect={() => setSelectedMessage(msg)}
                              onUpdateCategory={(cat) => updateMessage(msg.id, { category: cat })}
                              onUpdateStatus={(status) => updateMessage(msg.id, { status })}
                              onDelete={() => deleteMessage(msg.id)}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  // Show filtered list
                  filteredMessages.map(msg => (
                    <MessageCard
                      key={msg.id}
                      message={msg}
                      isSelected={selectedMessage?.id === msg.id}
                      onSelect={() => setSelectedMessage(msg)}
                      onUpdateCategory={(cat) => updateMessage(msg.id, { category: cat })}
                      onUpdateStatus={(status) => updateMessage(msg.id, { status })}
                      onDelete={() => deleteMessage(msg.id)}
                    />
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Detail */}
        {selectedMessage && (
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-lg">Message Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={selectedMessage.subject}
                  onChange={(e) => updateMessage(selectedMessage.id, { subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sender</label>
                <input
                  type="text"
                  value={selectedMessage.sender}
                  onChange={(e) => updateMessage(selectedMessage.id, { sender: e.target.value })}
                  placeholder="e.g., John Smith"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original Content</label>
                <div className="bg-gray-50 p-3 rounded border text-sm max-h-32 overflow-y-auto whitespace-pre-wrap">
                  {selectedMessage.content}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">EA Notes / Action</label>
                <textarea
                  value={selectedMessage.notes}
                  onChange={(e) => updateMessage(selectedMessage.id, { notes: e.target.value })}
                  placeholder="Add notes or action items..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Follow-Up Date</label>
                <input
                  type="date"
                  value={selectedMessage.followUpDate}
                  onChange={(e) => updateMessage(selectedMessage.id, { followUpDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right Panel - Outputs */}
      <div className="lg:col-span-4 space-y-4">
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Exec Summary</CardTitle>
            <CardDescription>Share with your executive</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-50 p-3 rounded border text-xs max-h-48 overflow-y-auto whitespace-pre-wrap">
              {generateExecSummary()}
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3"
              onClick={() => copyToClipboard(generateExecSummary(), 'exec')}
            >
              {copied === 'exec' ? 'Copied!' : 'Copy Exec Summary'}
            </Button>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <CardTitle>EA Action List</CardTitle>
            <CardDescription>Your to-do list</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-50 p-3 rounded border text-xs max-h-48 overflow-y-auto whitespace-pre-wrap">
              {generateEAActionList()}
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3"
              onClick={() => copyToClipboard(generateEAActionList(), 'ea')}
            >
              {copied === 'ea' ? 'Copied!' : 'Copy Action List'}
            </Button>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Follow-Up Tracker</CardTitle>
            <CardDescription>Scheduled follow-ups by date</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-50 p-3 rounded border text-xs max-h-48 overflow-y-auto whitespace-pre-wrap">
              {generateFollowUpTracker()}
            </pre>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3"
              onClick={() => copyToClipboard(generateFollowUpTracker(), 'followup')}
            >
              {copied === 'followup' ? 'Copied!' : 'Copy Follow-Up Tracker'}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-red-50 p-2 rounded text-center">
                <div className="text-2xl font-bold text-red-600">
                  {messages.filter(m => m.category === 'urgent' && m.status !== 'completed').length}
                </div>
                <div className="text-red-700">Urgent</div>
              </div>
              <div className="bg-orange-50 p-2 rounded text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {messages.filter(m => m.category === 'needs-exec-decision' && m.status !== 'completed').length}
                </div>
                <div className="text-orange-700">Exec Decision</div>
              </div>
              <div className="bg-green-50 p-2 rounded text-center">
                <div className="text-2xl font-bold text-green-600">
                  {messages.filter(m => m.category === 'ea-can-handle' && m.status !== 'completed').length}
                </div>
                <div className="text-green-700">EA To-Do</div>
              </div>
              <div className="bg-blue-50 p-2 rounded text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {messages.filter(m => m.status === 'completed').length}
                </div>
                <div className="text-blue-700">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Message Card Component
function MessageCard({
  message,
  isSelected,
  onSelect,
  onUpdateCategory,
  onUpdateStatus,
  onDelete,
}: {
  message: TriageMessage;
  isSelected: boolean;
  onSelect: () => void;
  onUpdateCategory: (cat: MessageCategory) => void;
  onUpdateStatus: (status: MessageStatus) => void;
  onDelete: () => void;
}) {
  const category = CATEGORIES.find(c => c.value === message.category);

  return (
    <div
      className={`p-3 rounded border cursor-pointer transition-colors ${
        isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
      } ${message.status === 'completed' ? 'opacity-60' : ''}`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-sm truncate ${message.status === 'completed' ? 'line-through' : ''}`}>
            {message.subject}
          </p>
          {message.sender && (
            <p className="text-xs text-gray-500 truncate">From: {message.sender}</p>
          )}
          {message.notes && (
            <p className="text-xs text-gray-600 mt-1 truncate">Note: {message.notes}</p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-gray-400 hover:text-red-500 flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
        <select
          value={message.category}
          onChange={(e) => onUpdateCategory(e.target.value as MessageCategory)}
          className="text-xs px-2 py-1 border border-gray-200 rounded flex-1"
        >
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>

        <select
          value={message.status}
          onChange={(e) => onUpdateStatus(e.target.value as MessageStatus)}
          className="text-xs px-2 py-1 border border-gray-200 rounded"
        >
          {STATUSES.map(status => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
