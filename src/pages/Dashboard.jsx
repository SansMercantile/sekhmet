import React, { useState } from 'react';
import {
  Shield, ShieldAlert, ShieldCheck, AlertTriangle, Activity,
  Server, GitBranch, Clock, TrendingUp, TrendingDown, ChevronRight,
  RefreshCw, Radio, Zap, Eye, CheckCircle2, XCircle, Info,
} from 'lucide-react';
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { motion } from 'framer-motion';

// ---------------------------------------------------------------------------
// PLACEHOLDER DATA — visual redesign only, real data wiring is a separate,
// later decision (see /api/v1/system/health and /api/v1/agents for what's
// actually live today). Kept in one place so swapping in real fetches later
// only touches this block, not the layout below.
// ---------------------------------------------------------------------------
const SIGNAL_TREND = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  signals: Math.round(20 + Math.sin(i / 3) * 12 + Math.random() * 8),
}));

const KPIS = [
  { id: 'signals', label: 'Signals (24h)', value: '312', delta: '+4.2%', trend: 'up', icon: Radio },
  { id: 'detection', label: 'Detection Coverage', value: '—', delta: 'pending', trend: 'flat', icon: Eye },
  { id: 'incidents', label: 'Open Incidents', value: '3', delta: '-1', trend: 'down', icon: AlertTriangle },
  { id: 'response', label: 'Avg. Response Time', value: '—', delta: 'pending', trend: 'flat', icon: Clock },
];

const INCIDENTS = [
  { id: 'INC-0091', title: 'Elevated failed-auth attempts', system: 'crazyjam-backend', severity: 'medium', status: 'investigating', age: '18m' },
  { id: 'INC-0090', title: 'Dependency advisory: transitive package', system: 'constellation', severity: 'low', status: 'monitoring', age: '2h' },
  { id: 'INC-0089', title: 'Unusual egress volume, non-prod', system: 'kev-backend', severity: 'low', status: 'resolved', age: '1d' },
];

const SYSTEMS = [
  { name: 'crazyjam-backend', status: 'healthy' },
  { name: 'kev-backend', status: 'healthy' },
  { name: 'mpeti-worker', status: 'healthy' },
  { name: 'constellation-core', status: 'degraded' },
];

const SEVERITY_STYLES = {
  critical: 'bg-sekhmet-red/15 text-sekhmet-red border-sekhmet-red/30',
  high: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  medium: 'bg-sekhmet-orange/15 text-sekhmet-orange border-sekhmet-orange/30',
  low: 'bg-sekhmet-blue/15 text-sekhmet-blue border-sekhmet-blue/30',
};

const STATUS_STYLES = {
  investigating: { icon: Activity, className: 'text-sekhmet-orange' },
  monitoring: { icon: Eye, className: 'text-sekhmet-blue' },
  resolved: { icon: CheckCircle2, className: 'text-sekhmet-green' },
};

function SeverityBadge({ level }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase tracking-wide border ${SEVERITY_STYLES[level] || SEVERITY_STYLES.low}`}>
      {level}
    </span>
  );
}

function StatCard({ stat, index }) {
  const Icon = stat.icon;
  const TrendIcon = stat.trend === 'up' ? TrendingUp : stat.trend === 'down' ? TrendingDown : Info;
  const trendColor = stat.trend === 'up' ? 'text-sekhmet-green' : stat.trend === 'down' ? 'text-sekhmet-red' : 'text-sekhmet-ink-muted';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-sekhmet-surface border border-sekhmet-border rounded-xl p-4 flex flex-col gap-3 hover:border-sekhmet-red/30 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="p-2 rounded-lg bg-sekhmet-surface-2 text-sekhmet-red">
          <Icon className="h-4 w-4" />
        </div>
        <div className={`flex items-center gap-1 text-[11px] font-mono ${trendColor}`}>
          <TrendIcon className="h-3 w-3" />
          {stat.delta}
        </div>
      </div>
      <div>
        <div className="text-2xl font-display font-semibold text-sekhmet-ink tabular-nums">{stat.value}</div>
        <div className="text-[12px] text-sekhmet-ink-muted mt-0.5">{stat.label}</div>
      </div>
    </motion.div>
  );
}

function IncidentRow({ incident, index }) {
  const statusMeta = STATUS_STYLES[incident.status] || STATUS_STYLES.monitoring;
  const StatusIcon = statusMeta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-sekhmet-surface-2 transition-colors group cursor-default"
    >
      <span className="font-mono text-[11px] text-sekhmet-ink-muted w-20 shrink-0">{incident.id}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-sekhmet-ink truncate">{incident.title}</p>
        <p className="text-[11px] text-sekhmet-ink-muted mt-0.5">{incident.system}</p>
      </div>
      <SeverityBadge level={incident.severity} />
      <div className={`flex items-center gap-1.5 text-[11px] ${statusMeta.className} w-24 shrink-0`}>
        <StatusIcon className="h-3 w-3" />
        {incident.status}
      </div>
      <span className="text-[11px] text-sekhmet-ink-muted font-mono w-10 shrink-0 text-right">{incident.age}</span>
      <ChevronRight className="h-3.5 w-3.5 text-sekhmet-ink-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </motion.div>
  );
}

function SystemHealthRow({ system }) {
  const isHealthy = system.status === 'healthy';
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-sekhmet-border last:border-0">
      <span className="text-[12px] text-sekhmet-ink font-mono">{system.name}</span>
      <div className={`flex items-center gap-1.5 text-[11px] ${isHealthy ? 'text-sekhmet-green' : 'text-sekhmet-orange'}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${isHealthy ? 'bg-sekhmet-green' : 'bg-sekhmet-orange'} ${isHealthy ? '' : 'animate-pulse'}`} />
        {system.status}
      </div>
    </div>
  );
}

function SignalChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={SIGNAL_TREND} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="signalGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#262a32" vertical={false} />
        <XAxis dataKey="hour" tick={{ fill: '#8b909c', fontSize: 10 }} axisLine={{ stroke: '#262a32' }} tickLine={false} interval={3} />
        <YAxis tick={{ fill: '#8b909c', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
        <Tooltip
          contentStyle={{ background: '#1b1e24', border: '1px solid #262a32', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#8b909c' }}
          itemStyle={{ color: '#e8e9ec' }}
        />
        <Area type="monotone" dataKey="signals" stroke="#ef4444" strokeWidth={2} fill="url(#signalGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetch('/api/health');
    } catch (e) {
      // Backend not reachable from this environment - non-fatal for a visual pass.
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-sekhmet-bg text-sekhmet-ink font-sans">
      {/* Top bar */}
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
            <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-sekhmet-ink-muted border border-sekhmet-border rounded-full px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-sekhmet-orange" />
              Preview data · pending live integration
            </span>
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
        {/* Posture strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-4 bg-sekhmet-surface border border-sekhmet-border rounded-xl p-5"
        >
          <div className="p-3 rounded-full bg-sekhmet-green/10 border border-sekhmet-green/30">
            <ShieldCheck className="h-6 w-6 text-sekhmet-green" />
          </div>
          <div className="flex-1">
            <h2 className="font-display font-medium text-[15px]">No critical incidents open</h2>
            <p className="text-[12px] text-sekhmet-ink-muted mt-0.5">3 open items being tracked, all low/medium severity - see incident feed below.</p>
          </div>
          <Zap className="h-4 w-4 text-sekhmet-ink-muted" />
        </motion.div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {KPIS.map((stat, i) => (
            <StatCard key={stat.id} stat={stat} index={i} />
          ))}
        </div>

        {/* Chart + systems panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-sekhmet-surface border border-sekhmet-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[13px] font-medium text-sekhmet-ink flex items-center gap-2">
                <Activity className="h-4 w-4 text-sekhmet-red" /> Signal volume, last 24h
              </h3>
            </div>
            <SignalChart />
          </div>

          <div className="bg-sekhmet-surface border border-sekhmet-border rounded-xl p-5">
            <h3 className="text-[13px] font-medium text-sekhmet-ink flex items-center gap-2 mb-3">
              <Server className="h-4 w-4 text-sekhmet-red" /> System health
            </h3>
            <div>
              {SYSTEMS.map((system) => (
                <SystemHealthRow key={system.name} system={system} />
              ))}
            </div>
          </div>
        </div>

        {/* Incident feed */}
        <div className="bg-sekhmet-surface border border-sekhmet-border rounded-xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-sekhmet-border">
            <h3 className="text-[13px] font-medium text-sekhmet-ink flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-sekhmet-red" /> Incident feed
            </h3>
            <span className="text-[11px] text-sekhmet-ink-muted font-mono">{INCIDENTS.length} items</span>
          </div>
          <div className="px-2 py-2">
            {INCIDENTS.map((incident, i) => (
              <IncidentRow key={incident.id} incident={incident} index={i} />
            ))}
          </div>
        </div>
      </main>

      <footer className="max-w-[1400px] mx-auto px-6 py-6 text-center">
        <p className="text-[11px] text-sekhmet-ink-muted">Sans Mercantile Constellation &middot; SEKHMET Security Operations</p>
      </footer>
    </div>
  );
}
