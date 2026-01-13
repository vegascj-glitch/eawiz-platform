import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { EXTERNAL_LINKS } from '@/lib/utils';

const features = [
  {
    title: '380+ AI Prompts',
    description:
      'Curated prompt library for Executive Assistants covering career, travel, events, and more.',
    icon: '✨',
    href: '/prompts',
    memberOnly: true,
  },
  {
    title: 'AI Tools',
    description:
      'Purpose-built tools including Calendar Audit and the EAwiz GPT to supercharge your workflow.',
    icon: '🛠️',
    href: '/tools',
    memberOnly: false,
  },
  {
    title: 'EAwiz Lounge',
    description:
      'Connect with fellow EAs, share strategies, and learn from the community.',
    icon: '💬',
    href: '/lounge',
    memberOnly: true,
  },
  {
    title: 'Live Events',
    description:
      'Monthly AI for Admins sessions, workshops, and exclusive member office hours.',
    icon: '📅',
    href: '/events',
    memberOnly: false,
  },
];

const testimonials = [
  {
    quote:
      'EAwiz has completely transformed how I approach my daily tasks. The prompts alone have saved me hours every week.',
    author: 'Sarah M.',
    role: 'Executive Assistant, Fortune 500',
  },
  {
    quote:
      'Finally, a community that understands the unique challenges of being an EA. The AI tools are game-changers.',
    author: 'Michael T.',
    role: 'Chief of Staff',
  },
  {
    quote:
      'The Calendar Audit tool helped me reclaim 5 hours a week for my executive. Worth every penny.',
    author: 'Jessica L.',
    role: 'Senior Executive Assistant',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              AI-Powered Excellence for Executive Assistants
            </h1>
            <p className="mt-6 text-xl text-primary-100">
              Join the community of forward-thinking EAs using AI to work smarter,
              not harder. Access 380+ prompts, powerful tools, and exclusive resources.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/join">
                <Button variant="secondary" size="lg">
                  Join for $25/month
                </Button>
              </Link>
              <Link href="/tools">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  Try Free Tools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="section-title">Everything You Need to Excel</h2>
            <p className="section-subtitle">
              From AI-powered prompts to community support, EAwiz has you covered.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.href}>
                <Card
                  variant="bordered"
                  className="h-full hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <CardHeader>
                    <span className="text-4xl">{feature.icon}</span>
                    <CardTitle className="mt-4">
                      {feature.title}
                      {feature.memberOnly && (
                        <span className="ml-2 text-xs font-normal text-accent-600">
                          Members
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI for Admins Section */}
      <section className="section bg-gradient-to-r from-accent-50 to-primary-50 border-y border-gray-200">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="flex-shrink-0 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-lg">
                  <span className="text-5xl">🎙️</span>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="inline-block px-3 py-1 bg-accent-100 text-accent-700 text-sm font-medium rounded-full mb-4">
                  Free Monthly Event
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  AI for Admins
                </h2>
                <p className="mt-3 text-lg text-gray-600">
                  Join us the <strong>first Thursday of every month at 2pm ET</strong> for
                  live AI training, demos, and Q&A. Free for everyone — members and
                  non-members welcome!
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <a
                    href="https://us02web.zoom.us/j/81234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary">
                      Join Zoom Meeting
                      <span className="ml-2">↗</span>
                    </Button>
                  </a>
                  <a href="/api/calendar/ai-for-admins.ics" download>
                    <Button variant="outline">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Add to Calendar
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GPT Highlight Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title">Meet the EAwiz GPT</h2>
              <p className="section-subtitle">
                Your AI-powered assistant specifically trained for Executive
                Assistant tasks. Get instant help with emails, scheduling, travel
                planning, and more.
              </p>
              <ul className="mt-6 space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Draft professional emails in seconds
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Create meeting agendas and briefing docs
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Plan travel and research destinations
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Trained on EA best practices
                </li>
              </ul>
              <div className="mt-8">
                <a
                  href={EXTERNAL_LINKS.gpt}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="primary" size="lg">
                    Try EAwiz GPT Free
                    <span className="ml-2">↗</span>
                  </Button>
                </a>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-8 md:p-12 text-center">
              <div className="text-6xl mb-4">🤖</div>
              <p className="text-xl font-medium text-primary-800">
                Powered by ChatGPT
              </p>
              <p className="text-primary-600 mt-2">
                Works with free and Plus accounts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="section-title">Loved by EAs Everywhere</h2>
            <p className="section-subtitle">
              Join hundreds of Executive Assistants who are already working smarter
              with EAwiz.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i} variant="bordered">
                <CardHeader>
                  <p className="text-gray-600 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="mt-4">
                    <p className="font-medium text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Transform Your Workflow?
          </h2>
          <p className="mt-4 text-xl text-primary-100 max-w-2xl mx-auto">
            Join EAwiz today and get instant access to all prompts, tools, events,
            and our exclusive community.
          </p>
          <div className="mt-10">
            <Link href="/join">
              <Button variant="secondary" size="lg">
                Join for $25/month
              </Button>
            </Link>
            <p className="mt-4 text-sm text-primary-200">
              Cancel anytime. No contracts.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
