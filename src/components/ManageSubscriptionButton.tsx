'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function ManageSubscriptionButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleManage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating portal session:', error);
    }
    setIsLoading(false);
  };

  return (
    <Button
      variant="outline"
      onClick={handleManage}
      isLoading={isLoading}
      className="w-full"
    >
      Manage Subscription
    </Button>
  );
}
