'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Button, Card, Input, Badge } from '@/components/ui';
import { Settings, Save, User, Shield, Key, Bell, Database, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile form
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
  });
  
  // Password form
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchUser = async () => {
    const supabase = getSupabaseClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (authUser) {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      if (profile) {
        setUser(profile);
        setProfileData({
          full_name: profile.full_name || '',
          email: profile.email,
        });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    setMessage(null);
    
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('users')
      .update({ full_name: profileData.full_name })
      .eq('id', user.id);
    
    if (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      fetchUser();
    }
    
    setSaving(false);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    
    if (passwordData.new_password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    
    setSaving(true);
    setMessage(null);
    
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.updateUser({
      password: passwordData.new_password
    });
    
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Password updated successfully' });
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    }
    
    setSaving(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System Info', icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Settings className="h-6 w-6 text-gray-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your account and preferences</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 border-b-2 transition-colors',
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Message */}
      {message && (
        <div className={cn(
          'p-4 rounded-lg',
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        )}>
          {message.text}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </h2>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ) : (
            <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
              <Input
                label="Full Name"
                placeholder="Your full name"
                value={profileData.full_name}
                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={profileData.email}
                disabled
                hint="Email cannot be changed"
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Role:</span>
                <Badge variant={user?.role === 'super_admin' ? 'danger' : 'secondary'}>
                  {user?.role}
                </Badge>
              </div>
              <Button type="submit" loading={saving}>
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </form>
          )}
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Key className="h-5 w-5" />
            Change Password
          </h2>
          
          <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
            <Input
              label="Current Password"
              type="password"
              placeholder="Enter current password"
              value={passwordData.current_password}
              onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
              required
            />
            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
              value={passwordData.new_password}
              onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Confirm new password"
              value={passwordData.confirm_password}
              onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
              required
            />
            <Button type="submit" loading={saving}>
              <Key className="h-4 w-4" />
              Update Password
            </Button>
          </form>
        </Card>
      )}

      {/* System Info Tab */}
      {activeTab === 'system' && (
        <div className="space-y-4">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Application Info
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Application</span>
                <span className="font-medium">SPORTIKON Arena</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Version</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Environment</span>
                <Badge variant="secondary">
                  {process.env.NODE_ENV || 'development'}
                </Badge>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-500">Framework</span>
                <span className="font-medium">Next.js 14</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Database</span>
                <span className="font-medium">Supabase (PostgreSQL)</span>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Database className="h-5 w-5" />
              Quick Links
            </h2>
            <div className="space-y-2">
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-900">Supabase Dashboard</span>
                <p className="text-sm text-gray-500">Manage database and authentication</p>
              </a>
              <a
                href="/arena-admin/audit-logs"
                className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-900">Audit Logs</span>
                <p className="text-sm text-gray-500">View all database changes</p>
              </a>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
