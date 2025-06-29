'use client';

import { UserButton as ClerkUserButton, SignInButton, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import Link from 'next/link';

export function UserButton() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <Button size="sm" variant="outline">
          Sign In
        </Button>
      </SignInButton>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/settings">
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <Settings className="h-4 w-4" />
        </Button>
      </Link>
      <ClerkUserButton 
        afterSignOutUrl="/"
        appearance={{
          elements: {
            avatarBox: "h-8 w-8"
          }
        }}
      />
    </div>
  );
}