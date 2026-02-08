'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, Input, Select, Badge } from '@/components/ui';
import { FileText, Search, Filter, User, Clock, Activity } from 'lucide-react';
import { formatDate, getRelativeTime, cn } from '@/lib/utils';
import type { AuditLog } from '@/lib/database.types';

type AuditLogWithUser = AuditLog & { 
  user?: { email: string; full_name: string | null } | null 
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [tableFilter, setTableFilter] = useState('');

  const fetchData = async () => {
    const supabase = getSupabaseClient();
    
    let query = supabase
      .from('audit_logs')
      .select(`
        *,
        user:users(email, full_name)
      `)
      .order('created_at', { ascending: false })
      .limit(200);

    if (actionFilter) {
      query = query.eq('action', actionFilter);
    }

    if (tableFilter) {
      query = query.eq('entity_type', tableFilter);
    }

    const { data } = await query;
    if (data) setLogs(data as AuditLogWithUser[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [actionFilter, tableFilter]);

  const filteredLogs = logs.filter(log => {
    const searchLower = searchQuery.toLowerCase();
    return (
      log.entity_type.toLowerCase().includes(searchLower) ||
      log.action.toLowerCase().includes(searchLower) ||
      (log.user?.email || '').toLowerCase().includes(searchLower) ||
      JSON.stringify(log.new_data || {}).toLowerCase().includes(searchLower)
    );
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'INSERT': return 'success';
      case 'UPDATE': return 'warning';
      case 'DELETE': return 'danger';
      default: return 'secondary';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'INSERT': return '+';
      case 'UPDATE': return '~';
      case 'DELETE': return '-';
      default: return '?';
    }
  };

  const uniqueTables = [...new Set(logs.map(l => l.entity_type))].sort();
  const uniqueActions = [...new Set(logs.map(l => l.action))].sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-100 rounded-lg">
          <FileText className="h-6 w-6 text-slate-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-500">Track all database changes</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-4">
            <Select
              options={[
                { value: '', label: 'All Actions' },
                ...uniqueActions.map(a => ({ value: a, label: a }))
              ]}
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-40"
            />
            <Select
              options={[
                { value: '', label: 'All Tables' },
                ...uniqueTables.map(t => ({ value: t, label: t }))
              ]}
              value={tableFilter}
              onChange={(e) => setTableFilter(e.target.value)}
              className="w-48"
            />
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
          <p className="text-sm text-gray-500">Total Logs</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {logs.filter(l => l.action === 'INSERT').length}
          </p>
          <p className="text-sm text-gray-500">Inserts</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {logs.filter(l => l.action === 'UPDATE').length}
          </p>
          <p className="text-sm text-gray-500">Updates</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-red-600">
            {logs.filter(l => l.action === 'DELETE').length}
          </p>
          <p className="text-sm text-gray-500">Deletes</p>
        </Card>
      </div>

      {/* Logs Timeline */}
      {loading ? (
        <Card className="animate-pulse">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-8 w-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : filteredLogs.length === 0 ? (
        <Card className="text-center py-12">
          <Activity className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No audit logs found</p>
        </Card>
      ) : (
        <Card className="divide-y divide-gray-100">
          {filteredLogs.map((log) => (
            <div key={log.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start gap-4">
                <div className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
                  log.action === 'INSERT' && 'bg-green-100 text-green-600',
                  log.action === 'UPDATE' && 'bg-yellow-100 text-yellow-600',
                  log.action === 'DELETE' && 'bg-red-100 text-red-600'
                )}>
                  {getActionIcon(log.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={getActionColor(log.action) as any}>
                      {log.action}
                    </Badge>
                    <span className="font-medium text-gray-900">{log.entity_type}</span>
                    {log.entity_id && (
                      <span className="text-xs text-gray-400 font-mono">
                        #{log.entity_id.slice(0, 8)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    {log.user && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {log.user.full_name || log.user.email}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getRelativeTime(log.created_at)}
                    </span>
                  </div>

                  {/* Changes Preview */}
                  {(log.old_data || log.new_data) && (
                    <details className="mt-2">
                      <summary className="text-xs text-blue-600 cursor-pointer hover:underline">
                        View changes
                      </summary>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {log.old_data && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Before</p>
                            <pre className="text-xs bg-red-50 p-2 rounded overflow-x-auto max-h-32">
                              {JSON.stringify(log.old_data, null, 2)}
                            </pre>
                          </div>
                        )}
                        {log.new_data && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">After</p>
                            <pre className="text-xs bg-green-50 p-2 rounded overflow-x-auto max-h-32">
                              {JSON.stringify(log.new_data, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Load More Note */}
      {filteredLogs.length >= 200 && (
        <p className="text-center text-sm text-gray-400">
          Showing last 200 logs. Use filters to find specific entries.
        </p>
      )}
    </div>
  );
}
