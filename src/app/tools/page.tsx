import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EXTERNAL_LINKS } from '@/lib/utils';

// Tool entry types for safety
interface ToolEntry {
  name: string;
  description: string;
  features?: string[];
  href: string;
  icon: string;
  cta: string;
  external?: boolean;
}

interface ComingSoonEntry {
  name: string;
  description: string;
  icon: string;
}

// Safety helper: get features array with fallback
function getFeatures(tool: ToolEntry): string[] {
  if (!tool.features || !Array.isArray(tool.features)) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Tool "${tool.name}" is missing features array`);
    }
    return [];
  }
  return tool.features;
}

// Safety helper: validate tool entry in development
function validateTool(tool: ToolEntry, index: number, arrayName: string): boolean {
  if (process.env.NODE_ENV === 'development') {
    const missing: string[] = [];
    if (!tool.name) missing.push('name');
    if (!tool.href) missing.push('href');
    if (!tool.icon) missing.push('icon');
    if (!tool.cta) missing.push('cta');
    if (missing.length > 0) {
      console.warn(`${arrayName}[${index}] is missing: ${missing.join(', ')}`);
      return false;
    }
  }
  return !!(tool.name && tool.href);
}

const freeTools: ToolEntry[] = [
  {
    name: 'EAwiz GPT',
    description:
      'Your AI-powered assistant specifically trained for Executive Assistant tasks. Draft emails, create agendas, plan travel, and more.',
    features: [
      'Professional email drafting',
      'Meeting preparation and agendas',
      'Travel planning assistance',
      'Executive briefing documents',
      'Conflict resolution scripts',
    ],
    href: EXTERNAL_LINKS.gpt,
    icon: '🤖',
    cta: 'Open in ChatGPT',
    external: true,
  },
  {
    name: 'Cover Letter Generator',
    description:
      'Generate tailored, human-sounding cover letters that don\'t read like AI. Get three distinct versions optimized for different approaches.',
    features: [
      'Three tailored cover letter versions per job',
      'Upload resume or paste text directly',
      'Avoids generic AI phrases and cliches',
      'Multiple tone options (professional, direct, warm)',
      'Export to Word or Google Docs',
    ],
    href: '/tools/cover-letter-generator',
    icon: '✉️',
    cta: 'Open Cover Letter Generator',
    external: false,
  },
  {
    name: 'Interview Tracker',
    description:
      'Track job applications and interview events in one place. Stay organized during your job search with a clean table view and detailed event tracking.',
    features: [
      'Track applications with company, role, and salary info',
      'Log multiple interview events per application',
      'See next scheduled interview at a glance',
      'Filter and sort by status, work mode, and date',
      'Track thank-you notes and interview outcomes',
    ],
    href: '/tools/interview-tracker',
    icon: '💼',
    cta: 'Open Interview Tracker',
    external: false,
  },
  {
    name: 'Prompt Library',
    description:
      '380+ AI prompts curated specifically for Executive Assistants. Copy, customize, and use with ChatGPT or any AI assistant.',
    features: [
      '380+ prompts across 19 categories',
      'Email, calendar, travel, and meeting prompts',
      'One-click copy to clipboard',
      'Search and filter by category',
      'Regularly updated with new prompts',
    ],
    href: '/prompts',
    icon: '✨',
    cta: 'Browse Prompt Library',
    external: false,
  },
];

const memberTools: ToolEntry[] = [
  {
    name: 'Charitable Deductions Calculator 2025',
    description:
      'Estimate fair market value for donated items using consistent excellent condition rules. Export CSV and copy a TurboTax-friendly summary.',
    features: [
      'Category-based item catalog with search and totals',
      'Excellent condition logic: range-high, plus-min, fixed',
      'CSV export (only items with quantity > 0)',
      'Copy TurboTax summary and category totals',
      'Autosave and restore your entries',
    ],
    href: '/tools/charitable-deductions-calculator-2025',
    icon: '🧾',
    cta: 'Open Deductions Calculator',
  },
  {
    name: 'Task Tracker',
    description:
      'A lightweight task management tool with dashboard metrics, sortable task tables, and weekly time-block planner designed for executive assistants.',
    features: [
      'Dashboard with KPIs, completion trends, and impact metrics',
      'Full task table with filtering, sorting, and bulk actions',
      'Weekly planner with drag-and-drop time-block scheduling',
      'Color-coded categories, priorities, and statuses',
      'CSV export and weekly summary copy for reporting',
    ],
    href: '/tools/task-tracker',
    icon: '📋',
    cta: 'Open Task Tracker',
  },
  {
    name: 'Executive Profile',
    description:
      'A comprehensive executive preference and operations profile covering contacts, vendors, documents, travel, calendar, and protocols.',
    features: [
      '16 sections: personal, travel, meetings, health, family, and more',
      'Contact, vendor, and document registries with editable tables',
      'Travel preferences, meeting protocols, work style notes',
      'Autosave with cloud sync and local backup',
      'Export and import JSON for backup',
    ],
    href: '/tools/executive-profile',
    icon: '👤',
    cta: 'Open Executive Profile',
  },
  {
    name: 'Availability Grid',
    description:
      'Select meeting times across time zones and generate a ready-to-send email with professional formatting.',
    features: [
      'Visual weekly calendar grid (7am-7pm)',
      'Multi-timezone conversion with day-shift indicators',
      'Professional email templates (4 tones)',
      'ICS calendar export for holds',
      'Lunch blackout and buffer settings',
    ],
    href: '/tools/availability-grid',
    icon: '📅',
    cta: 'Open Availability Grid',
  },
  {
    name: 'Executive Brief Generator',
    description:
      'Create professional daily and weekly briefing documents for your executive with customizable sections and tone.',
    features: [
      'Daily and weekly briefing modes',
      'Customizable sections (schedule, priorities, decisions, FYI)',
      'Formal and conversational tone options',
      'Private EA-only internal notes',
      'Copy as plain text or HTML',
    ],
    href: '/tools/executive-brief',
    icon: '📋',
    cta: 'Open Brief Generator',
  },
  {
    name: 'Executive Attention Audit',
    description:
      'Analyze how your executive\'s time and attention are allocated across categories and identify strategic misalignment.',
    features: [
      'Structured entry and paste import modes',
      'Category breakdown (Strategy, Operations, People, etc.)',
      'Automatic insights and recommendations',
      'Save named audits for comparison',
      'Executive and EA-only export formats',
    ],
    href: '/tools/executive-attention-audit',
    icon: '🎯',
    cta: 'Open Attention Audit',
  },
  {
    name: 'Executive 1:1 Prep Tool',
    description:
      'Build structured agendas for executive check-ins with updates, decisions, blockers, and follow-ups.',
    features: [
      'Structured agenda sections with reordering',
      'Open item carryover between meetings',
      'Timebox allocation and preset templates',
      'Owner and status tracking per item',
      'Separate exec-ready and EA internal outputs',
    ],
    href: '/tools/executive-1on1-prep',
    icon: '👥',
    cta: 'Open 1:1 Prep Tool',
  },
  {
    name: 'Executive Travel Brief Builder',
    description:
      'Build polished travel itineraries with contacts, addresses, schedules, and packing lists.',
    features: [
      'Day-by-day itinerary with flight, lodging, ground, meeting segments',
      'Reusable contacts and locations library',
      'Packing list templates (business, conference, weather)',
      'Trip preferences and document checklist',
      'Separate exec-ready and EA internal outputs',
    ],
    href: '/tools/executive-travel-brief',
    icon: '✈️',
    cta: 'Open Travel Brief Builder',
  },
  {
    name: 'Accomplishments Tracker',
    description:
      'Log EA impact throughout the year and generate review-ready bullets and narrative summaries.',
    features: [
      'Track accomplishments with metrics and STAR format',
      'Generate review-ready bullets in 3 styles',
      'Narrative summaries and brag doc export',
      'Confidentiality controls and saved templates',
      'Filter by category, impact type, and date range',
    ],
    href: '/tools/accomplishments-tracker',
    icon: '🏆',
    cta: 'Open Accomplishments Tracker',
  },
  {
    name: 'Inbox Intelligence',
    description:
      'Quickly triage inbox content by organizing messages into priorities, actions, delegations, and follow-ups.',
    features: [
      'Parse and categorize emails by priority',
      'Urgent, Exec Decision, EA Handle, Waiting, FYI, Archive categories',
      'Generate exec summaries and EA action lists',
      'Track follow-ups with scheduled dates',
      'Save and load triage sessions',
    ],
    href: '/tools/inbox-intelligence',
    icon: '📧',
    cta: 'Open Inbox Intelligence',
  },
  {
    name: 'EA Impact Report Generator',
    description:
      'Generate executive-ready reports that quantify EA impact and outcomes across any reporting period.',
    features: [
      'Monthly, quarterly, annual, or custom period reports',
      'Auto-calculate metrics: hours saved, cost avoided, initiatives delivered',
      'Import from Accomplishments Tracker or CSV',
      'Confidentiality controls for sensitive items',
      'Executive-ready and internal EA report outputs',
    ],
    href: '/tools/ea-impact-report',
    icon: '📊',
    cta: 'Open Impact Report Generator',
  },
  {
    name: 'Event Checklist Builder',
    description:
      'Build event checklists with timelines, owners, and share-ready outputs for any type of event.',
    features: [
      'Built-in templates for board meetings, offsites, conferences',
      'Organize tasks by phases with owners and due dates',
      'Timeline view with overdue alerts',
      'Generate vendor, exec, and internal summaries',
      'Save and reuse event templates',
    ],
    href: '/tools/event-checklist-builder',
    icon: '✅',
    cta: 'Open Event Checklist Builder',
  },
  {
    name: 'Calendar Audit',
    description:
      'Analyze your calendar data to gain insights into meeting patterns, time allocation, and opportunities to reclaim time for your executive.',
    features: [
      'Import from Outlook or Google Calendar CSV',
      'Auto-categorize meetings with smart rules',
      'Visual time allocation breakdown',
      'Date range filtering with presets',
      'Save custom category rules',
    ],
    href: '/tools/calendar-audit',
    icon: '📊',
    cta: 'Open Calendar Audit',
  },
];

const comingSoon: ComingSoonEntry[] = [
  {
    name: 'Meeting Prep Generator',
    description: 'Generate comprehensive meeting prep documents in seconds.',
    icon: '📋',
  },
  {
    name: 'Expense Report Formatter',
    description: 'Automatically format and categorize expense reports.',
    icon: '💰',
  },
  {
    name: 'Gift Recommender',
    description: 'Personalized gift suggestions for clients and colleagues.',
    icon: '🎁',
  },
  {
    name: 'Document Summarizer',
    description: 'Quickly summarize long documents and reports.',
    icon: '📑',
  },
  {
    name: 'Contact Relationship Manager',
    description: 'Track interactions and relationship history with key contacts.',
    icon: '👥',
  },
];

export default function ToolsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            AI Tools for EAs
          </h1>
          <p className="mt-4 text-xl text-primary-100 text-center max-w-2xl mx-auto">
            Purpose-built tools to supercharge your productivity and help you
            support your executive more effectively.
          </p>
        </div>
      </section>

      {/* Free Tools */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">Free Tools</h2>
            <p className="section-subtitle">
              Get started with our free tools — no account required.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {freeTools.filter((tool, i) => validateTool(tool, i, 'freeTools')).map((tool) => {
              const features = getFeatures(tool);
              return (
              <Card
                key={tool.name}
                variant="bordered"
                className="hover:border-primary-300 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{tool.icon}</span>
                    <Badge variant="success" size="sm">
                      Free
                    </Badge>
                  </div>
                  <CardTitle className="mt-4 text-2xl">{tool.name}</CardTitle>
                  <CardDescription className="text-base">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {features.length > 0 ? features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-600">
                        <svg
                          className="w-4 h-4 text-green-500 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </li>
                    )) : (
                      <li className="text-gray-500 italic">Details coming soon</li>
                    )}
                  </ul>
                  <div className="mt-6">
                    {tool.external ? (
                      <a
                        href={tool.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="primary" className="w-full">
                          {tool.cta}
                          <span className="ml-2">↗</span>
                        </Button>
                      </a>
                    ) : (
                      <Link href={tool.href}>
                        <Button variant="primary" className="w-full">
                          {tool.cta}
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
            })}
          </div>
        </div>
      </section>

      {/* Members Only Tools */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">Members Only Tools</h2>
            <p className="section-subtitle">
              Unlock all tools with an EAwiz membership - $25/month or $250/year.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {memberTools.filter((tool, i) => validateTool(tool, i, 'memberTools')).map((tool) => {
              const features = getFeatures(tool);
              return (
              <Card
                key={tool.name}
                variant="bordered"
                className="hover:border-primary-300 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{tool.icon}</span>
                    <Badge variant="info" size="sm">
                      Members
                    </Badge>
                  </div>
                  <CardTitle className="mt-4 text-2xl">{tool.name}</CardTitle>
                  <CardDescription className="text-base">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {features.length > 0 ? features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-600">
                        <svg
                          className="w-4 h-4 text-green-500 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </li>
                    )) : (
                      <li className="text-gray-500 italic">Details coming soon</li>
                    )}
                  </ul>
                  <div className="mt-6">
                    <Link href={tool.href}>
                      <Button variant="primary" className="w-full">
                        {tool.cta}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
            })}
          </div>
          <div className="mt-12 text-center">
            <Link href="/join">
              <Button variant="primary" size="lg">
                Become a Member - $25/month
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">Coming Soon</h2>
            <p className="section-subtitle">
              We&apos;re building more tools to help you work smarter.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {comingSoon.map((tool) => (
              <Card key={tool.name} variant="bordered" className="opacity-75">
                <CardHeader>
                  <span className="text-3xl">{tool.icon}</span>
                  <CardTitle className="mt-2 text-lg">{tool.name}</CardTitle>
                  <CardDescription className="text-sm">{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-gray-50">
        <div className="container text-center">
          <h2 className="section-title">Want More Tools?</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Members get early access to new tools and can vote on what we build
            next.
          </p>
          <div className="mt-8">
            <Link href="/join">
              <Button variant="primary" size="lg">
                Become a Member
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
