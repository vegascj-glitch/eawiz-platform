import Link from 'next/link';
import { isActiveMember } from '@/lib/supabase-server';
import { TaskTracker } from '@/components/tools/task-tracker/TaskTracker';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

export const metadata = {
  title: 'Task Tracker | EAwiz',
  description:
    'A lightweight task management tool with dashboard metrics, task tables, and weekly planner for executive assistants.',
};

export default async function TaskTrackerPage() {
  const isMember = await isActiveMember();

  if (!isMember) {
    return (
      <>
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="container py-12">
            <div className="max-w-3xl">
              <Link
                href="/tools"
                className="inline-flex items-center text-primary-100 hover:text-white mb-4 text-sm"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Tools
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold">Task Tracker</h1>
              <p className="mt-3 text-lg text-primary-100">
                A lightweight task management system with dashboard metrics, sortable task tables,
                and a weekly time-block planner designed for executive assistants.
              </p>
            </div>
          </div>
        </section>

        {/* Paywall */}
        <section className="section bg-gray-50">
          <div className="container max-w-2xl">
            <Card variant="bordered" className="text-center">
              <CardHeader>
                <div className="mx-auto text-6xl mb-4">🔒</div>
                <CardTitle className="text-2xl">Members Only</CardTitle>
                <CardDescription className="text-base mt-2">
                  The Task Tracker tool is exclusively available to EAwiz members.
                  Join today to access this and all other premium tools.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-gray-600">
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
                    Dashboard with KPIs, completion trends, and impact metrics
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
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
                    Full task table with filtering, sorting, and bulk actions
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
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
                    Weekly planner with drag-and-drop time-block scheduling
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
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
                    Color-coded categories, priorities, and statuses
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
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
                    CSV export and weekly summary copy for reporting
                  </li>
                </ul>
                <Link href="/join?from=task-tracker">
                  <Button variant="primary" size="lg">
                    Join EAwiz - $40/month
                  </Button>
                </Link>
                <p className="mt-4 text-sm text-gray-500">
                  Already a member?{' '}
                  <Link href="/login" className="text-primary-600 hover:underline">
                    Log in
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </>
    );
  }

  // Member view - show actual tool
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/tools"
                className="inline-flex items-center text-primary-100 hover:text-white mb-2 text-sm"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Tools
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold">Task Tracker</h1>
              <p className="mt-1 text-primary-100">
                Track tasks, measure impact, and plan your week
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tool */}
      <section className="section bg-white">
        <div className="container">
          <TaskTracker />
        </div>
      </section>
    </>
  );
}
