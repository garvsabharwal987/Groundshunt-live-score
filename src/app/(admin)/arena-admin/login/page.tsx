'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Button, Input, Card } from '@/components/ui';
import { Trophy, Lock } from 'lucide-react';
import { ADMIN_PATH } from '@/lib/constants';

// Hardcoded admin credentials for development
const HARDCODED_ADMIN = {
  email: 'prabhdeep1701@gmail.com',
  password: '1234',
};

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check hardcoded credentials first
    if (email === HARDCODED_ADMIN.email && password === HARDCODED_ADMIN.password) {
      // Store admin session in localStorage
      localStorage.setItem('adminAuth', JSON.stringify({
        email: HARDCODED_ADMIN.email,
        role: 'super_admin',
        loggedIn: true,
      }));
      router.push(`/${ADMIN_PATH}`);
      router.refresh();
      setLoading(false);
      return;
    }

    // Fallback to Supabase auth
    const supabase = getSupabaseClient();

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Check if user has admin access
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (!userData || !userData.is_active) {
        setError('Access denied. Please contact administrator.');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user.id);

      router.push(`/${ADMIN_PATH}`);
      router.refresh();
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-xl mb-4">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">SPORTIKON Arena</h1>
          <p className="text-gray-400 mt-1">Admin Portal</p>
        </div>

        {/* Login Card */}
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Sign In</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sportikon.com"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" isLoading={loading}>
              Sign In
            </Button>
          </form>
        </Card>

        <p className="text-center text-gray-500 text-sm mt-6">
          Only authorized administrators can access this portal.
        </p>
      </div>
    </div>
  );
}
