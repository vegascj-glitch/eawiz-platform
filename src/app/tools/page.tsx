import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EXTERNAL_LINKS } from '@/lib/utils';

const tools = [
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
    badge: 'Members',
    icon: '📅',
    cta: 'Open Availability Grid',
    external: false,
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
    badge: 'Members',
    icon: '📋',
    cta: 'Open Brief Generator',
    external: false,
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
    badge: 'Members',
    icon: '🎯',
    cta: 'Open Attention Audit',
    external: false,
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
    badge: 'Members',
    icon: '👥',
    cta: 'Open 1:1 Prep Tool',
    external: false,
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
    badge: 'Members',
    icon: '✈️',
    cta: 'Open Travel Brief Builder',
    external: false,
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
    badge: 'Members',
    icon: '🏆',
    cta: 'Open Accomplishments Tracker',
    external: false,
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
    badge: 'Members',
    icon: '📧',
    cta: 'Open Inbox Intelligence',
    external: false,
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
    badge: 'Members',
    icon: '📊',
    cta: 'Open Impact Report Generator',
    external: false,
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
    badge: 'Members',
    icon: '✅',
    cta: 'Open Event Checklist Builder',
    external: false,
  },
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
    badge: 'ChatGPT',
    icon: '🤖',
    cta: 'Open in ChatGPT',
    external: true,
  },
  {
    name: 'Calendar Audit',
    description:
      'Analyze your calendar data to gain insights into meeting patterns, time allocation, and opportunities to reclaim time for your executive.',
    features: [
      'Upload Outlook or Google Calendar exports',
      'Visual meeting breakdown charts',
      'Time allocation analysis',
      'Meeting frequency insights',
      'AI-generated executive summary',
    ],
    href: EXTERNAL_LINKS.calendarAudit,
    badge: 'Streamlit',
    icon: '📊',
    cta: 'Launch Calendar Audit',
    external: true,
  },
];

const comingSoon = [
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
    name: 'Travel Itinerary Builder',
    description: 'Create detailed travel itineraries from booking confirmations.',
    icon: '✈️',
  },
  {
    name: 'Inbox Triage Assistant',
    description: 'AI-powered email sorting and priority recommendations.',
    icon: '📧',
  },
  {
    name: 'Meeting Brief Generator',
    description: 'Create executive briefing docs with attendee research.',
    icon: '📄',
  },
  {
    name: 'Gift Recommender',
    description: 'Personalized gift suggestions for clients and colleagues.',
    icon: '🎁',
  },
  {
    name: 'Event Checklist Builder',
    description: 'Generate comprehensive event planning checklists.',
    icon: '✅',
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

      {/* Tools Grid */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {tools.map((tool) => (
              <Card
                key={tool.name}
                variant="bordered"
                className="hover:border-primary-300 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{tool.icon}</span>
                    <Badge variant="info" size="sm">
                      {tool.badge}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4 text-2xl">{tool.name}</CardTitle>
                  <CardDescription className="text-base">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tool.features.map((feature, i) => (
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
                    ))}
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
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">Coming Soon</h2>
            <p className="section-subtitle">
              We&apos;re building more tools to help you work smarter.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {comingSoon.map((tool) => (
              <Card key={tool.name} variant="bordered" className="opacity-75">
                <CardHeader>
                  <span className="text-3xl">{tool.icon}</span>
                  <CardTitle className="mt-2">{tool.name}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-white">
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
