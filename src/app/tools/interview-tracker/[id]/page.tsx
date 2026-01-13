'use client';

import { useParams } from 'next/navigation';
import { ApplicationDetail } from '@/components/tools/interview-tracker/ApplicationDetail';

export default function ApplicationDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return <ApplicationDetail applicationId={id} />;
}
