import React, { useEffect, useState, useCallback } from 'react';
import {
  Shield, ShieldAlert, ShieldCheck, AlertTriangle, Activity,
  Server, GitBranch, Clock, ChevronRight,
  RefreshCw, Zap, Eye, CheckCircle2, XCircle, Loader2, PieChart as PieIcon,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
} from 'recharts';
import { motion } from 'framer-motion';

const SEVERITY_STYLES = {
  critical: 'bg-sekhmet-red/15 text-sekhmet-red border-sekhmet-red/30',
  high: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  medium: 'bg-sekhmet-orange/15 text-sekhmet-orange border-sekhmet-orange/30',
  low: 'bg-sekhmet-blue/15 text-sekhmet-blue border-sekhmet-blue/30',
  unknown: 'bg-sekhmet-ink-muted/15 text-sekhmet-ink-muted border-sekhmet-border',
};

const SEVERITY_COLORS = { critical: '#ef4444', high: '#fb923c', medium: '#f59e0b', low: '#3b82f6', unknown: '#8b909c' };

const SYSTEM_STATUS_META = {
  healthy: { className: 'text-sekhmet-green', dot: 'bg-sekhmet-green', pulse: false },
  degraded: { className: 'text-sekhmet-orange', dot: 'bg-sekhmet-orange', pulse: true },
  down: { className: 'text-sekhmet-red', dot: 'bg-sekhmet-red', pulse: true },
  unreachable: { className: 'text-sekhmet-ink-muted', dot: 'bg-sekhmet-ink-muted', pulse: true },
};

function timeAgo(isoString) {
  if (!isoString) return '—';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

function SeverityBadge({ level }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase tracking-wide border ${SEVERITY_STYLES[level] || SEVERITY_STYLES.unknown}`}>
      {level}
    </span>
  );
}

function StatCard({ label, value, icon: Icon, index, tone = 'default' }) {
  const toneColor = tone === 'danger' ? 'text-sekhmet-red' : tone === 'warn' ? 'text-sekhmet-orange' : 'text-sekhmet-red';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-sekhmet-surface border border-sekhmet-border rounded-xl p-4 flex flex-col gap-3 hover:border-sekhmet-red/30 transition-colors"
    >
      <div className="p-2 rounded-lg bg-sekhmet-surface-2 w-fit">
        <Icon className={`h-4 w-4 ${toneColor}`} />
      </div>
      <div>
        <div className="text-2xl font-display font-semibold text-sekhmet-ink tabular-nums">{value}</div>
        <div className="text-[12px] text-sekhmet-ink-muted mt-0.5">{label}</div>
      </div>
    </motion.div>
  );
}

function AlertRow({ alert, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index, 10) * 0.03, duration: 0.25 }}
      className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-sekhmet-surface-2 transition-colors group cursor-default"
    >
      <span className="font-mono text-[11px] text-sekhmet-ink-muted w-24 shrink-0">{alert.repo}#{alert.number}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-sekhmet-ink truncate">{alert.summary}</p>
        <p className="text-[11px] text-sekhmet-ink-muted mt-0.5 font-mono">{alert.package}</p>
      </div>
      <SeverityBadge level={alert.severity} />
      <span className="text-[11px] text-sekhmet-ink-muted font-mono w-10 shrink-0 text-right">{timeAgo(alert.created_at)}</span>
      <ChevronRight className="h-3.5 w-3.5 text-sekhmet-ink-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </motion.div>
  );
}

function SystemHealthRow({ system }) {
  const meta = SYSTEM_STATUS_META[system.status] || SYSTEM_STATUS_META.unreachable;
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-sekhmet-border last:border-0">
      <div>
        <span className="text-[12px] text-sekhmet-ink font-mono block">{system.name}</span>
        {system.status !== 'unreachable' && (
          <span className="text-[10px] text-sekhmet-ink-muted font-mono">{system.running_count}/{system.desired_count} tasks</span>
        )}
      </div>
      <div className={`flex items-center gap-1.5 text-[11px] ${meta.className}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${meta.dot} ${meta.pulse ? 'animate-pulse' : ''}`} />
        {system.status}
      </div>
    </div>
  );
}

function SeverityBreakdown({ counts }) {
  const data = Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([severity, value]) => ({ name: severity, value }));

  if (data.length === 0) {
    return <p className="text-[12px] text-sekhmet-ink-muted text-center py-10">No open advisories - nothing to break down.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={SEVERITY_COLORS[entry.name] || SEVERITY_COLORS.unknown} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ background: '#1b1e24', border: '1px solid #262a32', borderRadius: 8, fontSize: 12 }} itemStyle={{ color: '#e8e9ec' }} />
        <Legend wrapperStyle={{ fontSize: 11, color: '#8b909c' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default function Dashboard() {
  const [systems, setSystems] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadData = useCallback(async () => {
    setError(null);
    try {
      const [infraRes, alertsRes] = await Promise.all([
        fetch('/api/v1/sekhmet/infrastructure/status'),
        fetch('/api/v1/sekhmet/code-security/alerts'),
      ]);
      if (!infraRes.ok || !alertsRes.ok) throw new Error('Backend returned an error response');
      const infraData = await infraRes.json();
      const alertsData = await alertsRes.json();
      setSystems(infraData.systems || []);
      setAlerts(alertsData.alerts || []);
      setLastUpdated(new Date());
    } catch (e) {
      setError('Could not reach the Sekhmet backend - is it running?');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  const severityCounts = alerts.reduce(
    (acc, a) => ({ ...acc, [a.severity]: (acc[a.severity] || 0) + 1 }),
    { critical: 0, high: 0, medium: 0, low: 0 }
  );
  const criticalOrHigh = severityCounts.critical + severityCounts.high;
  const healthySystems = systems.filter((s) => s.status === 'healthy').length;
  const hasCritical = severityCounts.critical > 0;

  return (
    <div className="min-h-screen bg-sekhmet-bg text-sekhmet-ink font-sans">
      <header className="sticky top-0 z-40 border-b border-sekhmet-border bg-sekhmet-bg/90 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sekhmet-red/10 border border-sekhmet-red/30">
              <Shield className="h-5 w-5 text-sekhmet-red" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-[15px] tracking-wide">SEKHMET</h1>
              <p className="text-[10px] text-sekhmet-ink-muted -mt-0.5">Security Operations · Sans Mercantile Constellation</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!error && !isLoading && (
              <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-sekhmet-ink-muted border border-sekhmet-border rounded-full px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-sekhmet-green" />
                Live · updated {lastUpdated ? lastUpdated.toLocaleTimeString() : '—'}
              </span>
            )}
            <button
              onClick={handleRefresh}
              className="p-2 rounded-lg border border-sekhmet-border text-sekhmet-ink-muted hover:text-sekhmet-ink hover:border-sekhmet-red/30 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8 flex flex-col gap-6">
        {isLoading && (
          <div className="flex items-center justify-center gap-2 text-sekhmet-ink-muted py-20">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading live data...
          </div>
        )}

        {!isLoading && error && (
          <div className="flex items-center gap-4 bg-sekhmet-surface border border-sekhmet-red/30 rounded-xl p-5">
            <div className="p-3 rounded-full bg-sekhmet-red/10 border border-sekhmet-red/30">
              <XCircle className="h-6 w-6 text-sekhmet-red" />
            </div>
            <div>
              <h2 className="font-display font-medium text-[15px]">{error}</h2>
              <p className="text-[12px] text-sekhmet-ink-muted mt-0.5">Check that the Sekhmet backend service is running and reachable at /api.</p>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Posture strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-4 bg-sekhmet-surface border border-sekhmet-border rounded-xl p-5"
            >
              <div className={`p-3 rounded-full ${hasCritical ? 'bg-sekhmet-red/10 border border-sekhmet-red/30' : 'bg-sekhmet-green/10 border border-sekhmet-green/30'}`}>
                {hasCritical ? <ShieldAlert className="h-6 w-6 text-sekhmet-red" /> : <ShieldCheck className="h-6 w-6 text-sekhmet-green" />}
              </div>
              <div className="flex-1">
                <h2 className="font-display font-medium text-[15px]">
                  {hasCritical ? `${severityCounts.critical} critical advisory open` : 'No critical advisories open'}
                </h2>
                <p className="text-[12px] text-sekhmet-ink-muted mt-0.5">
                  {alerts.length} open Dependabot alert{alerts.length === 1 ? '' : 's'} across monitored repos - see below.
                </p>
              </div>
              <Zap className="h-4 w-4 text-sekhmet-ink-muted" />
            </motion.div>

            {/* KPI grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Systems Monitored" value={systems.length} icon={Server} index={0} />
              <StatCard label="Systems Healthy" value={`${healthySystems}/${systems.length}`} icon={CheckCircle2} index={1} />
              <StatCard label="Open Advisories" value={alerts.length} icon={AlertTriangle} index={2} />
              <StatCard label="Critical/High" value={criticalOrHigh} icon={ShieldAlert} index={3} tone={criticalOrHigh > 0 ? 'danger' : 'default'} />
            </div>

            {/* Severity breakdown + systems panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-sekhmet-surface border border-sekhmet-border rounded-xl p-5">
                <h3 className="text-[13px] font-medium text-sekhmet-ink flex items-center gap-2 mb-2">
                  <PieIcon className="h-4 w-4 text-sekhmet-red" /> Open advisories by severity
                </h3>
                <SeverityBreakdown counts={severityCounts} />
              </div>

              <div className="bg-sekhmet-surface border border-sekhmet-border rounded-xl p-5">
                <h3 className="text-[13px] font-medium text-sekhmet-ink flex items-center gap-2 mb-3">
                  <Server className="h-4 w-4 text-sekhmet-red" /> System health
                </h3>
                <div>
                  {systems.length === 0 ? (
                    <p className="text-[12px] text-sekhmet-ink-muted py-4">No systems reachable.</p>
                  ) : (
                    systems.map((system) => <SystemHealthRow key={system.name} system={system} />)
                  )}
                </div>
              </div>
            </div>

            {/* Advisory feed */}
            <div className="bg-sekhmet-surface border border-sekhmet-border rounded-xl">
              <div className="flex items-center justify-between px-5 py-4 border-b border-sekhmet-border">
                <h3 className="text-[13px] font-medium text-sekhmet-ink flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-sekhmet-red" /> Security advisories (GitHub Dependabot)
                </h3>
                <span className="text-[11px] text-sekhmet-ink-muted font-mono">{alerts.length} items</span>
              </div>
              <div className="px-2 py-2">
                {alerts.length === 0 ? (
                  <p className="text-[12px] text-sekhmet-ink-muted text-center py-8">No open advisories across monitored repos.</p>
                ) : (
                  alerts
                    .sort((a, b) => {
                      const order = { critical: 0, high: 1, medium: 2, low: 3 };
                      return (order[a.severity] ?? 4) - (order[b.severity] ?? 4);
                    })
                    .map((alert, i) => <AlertRow key={`${alert.repo}-${alert.number}`} alert={alert} index={i} />)
                )}
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="max-w-[1400px] mx-auto px-6 py-6 text-center">
        <p className="text-[11px] text-sekhmet-ink-muted">Sans Mercantile Constellation &middot; SEKHMET Security Operations</p>
      </footer>
    </div>
  );
}
