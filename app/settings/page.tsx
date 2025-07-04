'use client';

import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Key, Save, Eye, EyeOff, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/sign-in?redirect=/settings');
    }
  }, [isPending, session, router]);

  useEffect(() => {
    // Load API key from user data
    const loadUserSettings = async () => {
      if (!session) return;
      
      try {
        const response = await fetch('/api/user/settings');
        if (response.ok) {
          const data = await response.json();
          setApiKey(data.openaiApiKey || '');
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    
    loadUserSettings();
  }, [session]);

  const saveApiKey = async () => {
    if (!session) return;
    
    setIsSaving(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/user/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          openaiApiKey: apiKey
        }),
      });

      if (response.ok) {
        setMessage('Settings saved successfully!');
        // Also update localStorage for immediate use
        if (apiKey) {
          localStorage.setItem('reflow_openai_key', apiKey);
        } else {
          localStorage.removeItem('reflow_openai_key');
        }
      } else {
        setMessage('Failed to save settings. Please try again.');
      }
    } catch (error) {
      setMessage('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteApiKey = async () => {
    setApiKey('');
    await saveApiKey();
  };

  if (isPending || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Studio
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account and API keys</p>
        </div>

        {/* User Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email</span>
                <span className="text-sm font-medium">{session.user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">User ID</span>
                <span className="text-sm font-mono text-gray-500">{session.user.id}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Key Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              OpenAI API Key
            </CardTitle>
            <CardDescription>
              Your API key is stored securely and used for AI features. It's never shared with other users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">API Key</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                      className="w-full p-2 pr-10 border rounded-lg text-sm font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {apiKey && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={deleteApiKey}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Get your API key from{' '}
                  <a 
                    href="https://platform.openai.com/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    OpenAI Platform
                  </a>
                </p>
              </div>

              {message && (
                <div className={`text-sm p-3 rounded-lg ${
                  message.includes('success') 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  {message}
                </div>
              )}

              <Button
                onClick={saveApiKey}
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Settings */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Additional settings and preferences coming soon...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Future options: Default industry, theme preferences, export settings, and more.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}