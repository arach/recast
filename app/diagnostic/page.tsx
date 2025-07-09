'use client';

import { redirect } from 'next/navigation';

export default function DiagnosticPage() {
  // Redirect to the new inspector page
  redirect('/navigator/inspector');
}