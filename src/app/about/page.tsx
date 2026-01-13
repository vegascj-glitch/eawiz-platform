import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

const values = [
  {
    title: 'Empowerment',
    description:
      'We believe every EA has the potential to become a strategic partner. Our tools and resources are designed to elevate your impact.',
    icon: '💪',
  },
  {
    title: 'Community',
    description:
      "The EA profession is stronger together. We foster connections, share knowledge, and celebrate each other's wins.",
    icon: '🤝',
  },
  {
    title: 'Innovation',
    description:
      'AI is transforming how we work. We help EAs stay ahead of the curve and leverage technology effectively.',
    icon: '🚀',
  },
  {
    title: 'Excellence',
    description:
      'We hold ourselves to the same high standards that EAs bring to their work every day.',
    icon: '⭐',
  },
];

const stats = [
  { value: '380+', label: 'AI Prompts' },
  { value: '19', label: 'Categories' },
  { value: '500+', label: 'EAs Served' },
  { value: '10k+', label: 'Prompts Copied' },
];

const team = [
  {
    name: 'Courtney',
    role: 'Founder & Developer',
    bio: "Courtney is a seasoned Executive Assistant with over a decade of experience supporting C-suite executives at Fortune 500 companies. Her journey into AI began when she discovered how tools like ChatGPT could transform the daily workflow of administrative professionals.\n\nAfter years of developing her own AI-powered systems and sharing them with colleagues, Courtney founded EAwiz to bring these innovations to the broader EA community. She's passionate about helping Executive Assistants evolve from task managers to strategic partners through the power of AI.\n\nWhen she's not building tools or hosting AI for Admins sessions, Courtney enjoys mentoring aspiring EAs and speaking at industry conferences about the future of the profession.",
    image: '/images/courtney.jpg',
    linkedIn: 'https://www.linkedin.com/in/courtney-eawiz/',
  },
  {
    name: 'Molly',
    role: 'Co-Founder',
    bio: "Molly brings a unique blend of community building expertise and administrative excellence to EAwiz. With a background in operations management and a deep understanding of the challenges EAs face daily, she leads The EAwiz Lounge community with warmth and intention.\n\nHer vision for the community is simple: create a space where EAs can learn from each other, share wins and challenges, and grow together. Molly believes that the collective wisdom of experienced EAs is one of the profession's greatest untapped resources.\n\nAs Community Lead, Molly curates discussions, hosts virtual meetups, and ensures every member feels welcomed and supported. She's known for her ability to bring people together and create meaningful connections.",
    image: '/images/molly.jpg',
    linkedIn: 'https://www.linkedin.com/in/molly-eawiz/',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold">About EAwiz</h1>
            <p className="mt-6 text-xl text-primary-100">
              Built by EAs, for EAs. We&apos;re on a mission to empower Executive
              Assistants with AI-powered tools and a supportive community.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-center">Our Story</h2>
            <div className="mt-8 prose prose-lg mx-auto text-gray-600">
              <p>
                EAwiz was born from a simple observation: Executive Assistants are
                some of the most capable professionals in any organization, yet
                they&apos;re often underserved when it comes to purpose-built tools and
                resources.
              </p>
              <p>
                When AI tools like ChatGPT emerged, we saw an incredible opportunity.
                EAs could use these tools to draft emails faster, create meeting
                agendas more efficiently, and handle countless tasks with less effort
                — if only they knew how.
              </p>
              <p>
                That&apos;s why we created EAwiz. Our platform combines carefully crafted
                AI prompts, purpose-built tools like Calendar Audit, and a vibrant
                community where EAs can learn from each other and grow together.
              </p>
              <p>
                Whether you&apos;re just starting your EA journey or you&apos;ve been
                supporting executives for decades, EAwiz has something for you.
                Welcome to the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-primary-600">
                  {stat.value}
                </p>
                <p className="mt-2 text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="section bg-white">
        <div className="container">
          <h2 className="section-title text-center">Meet the Team</h2>
          <p className="section-subtitle text-center max-w-2xl mx-auto">
            EAwiz is led by experienced professionals who understand the unique
            challenges and opportunities in the EA profession.
          </p>

          <div className="mt-16 space-y-16">
            {team.map((member, index) => (
              <div
                key={member.name}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } gap-8 md:gap-12 items-center`}
              >
                {/* Team Member Image */}
                <div className="flex-shrink-0 w-full md:w-1/3">
                  <div className="aspect-square rounded-2xl overflow-hidden">
                    <Image
                      src={member.image}
                      alt={`${member.name} headshot`}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{member.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-primary-600 font-medium">{member.role}</p>
                    {member.linkedIn && (
                      <a
                        href={member.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#0A66C2] transition-colors"
                        aria-label={`${member.name}'s LinkedIn profile`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                  <div className="mt-4 prose prose-gray max-w-none">
                    {member.bio.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="text-gray-600">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-gray-50">
        <div className="container">
          <h2 className="section-title text-center">Our Values</h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <Card key={value.title} variant="bordered">
                <CardHeader>
                  <span className="text-4xl">{value.icon}</span>
                  <CardTitle className="mt-4">{value.title}</CardTitle>
                  <CardDescription>{value.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Speaking CTA */}
      <section className="section bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title">Bring EAwiz to Your Event</h2>
            <p className="section-subtitle">
              Looking for an engaging speaker on AI for Executive Assistants? We offer
              keynotes, workshops, and custom training sessions for teams and
              organizations.
            </p>
            <div className="mt-8">
              <Link href="/services/speaking">
                <Button variant="primary" size="lg">
                  Book a Speaking Engagement
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="section bg-primary-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Join the Community?
          </h2>
          <p className="mt-4 text-xl text-primary-100 max-w-2xl mx-auto">
            Get access to all our prompts, tools, and connect with EAs worldwide.
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
      </section>
    </>
  );
}
