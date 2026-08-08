import React, { useState } from 'react';
import axios from 'axios';
import { Shield, AlertTriangle, Eye, Activity, Settings, Zap, Lock, Radar, RefreshCw } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [refreshStatus, setRefreshStatus] = useState('');

  const handleRefresh = async () => {
    setRefreshing(true);
    setRefreshStatus('Checking API health...');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/health`);
      setRefreshStatus(`API status: ${response.status} ${response.statusText}`);
    } catch (error) {
      setRefreshStatus(`API health check failed: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Activity },
    { id: 'threats', name: 'Threats', icon: AlertTriangle },
    { id: 'incidents', name: 'Incidents', icon: Shield },
    { id: 'intelligence', name: 'Intelligence', icon: Eye },
    { id: 'operations', name: 'Operations', icon: Radar },
    { id: 'system', name: 'System', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Security Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="security-metric">
                <div className="value">SECURE</div>
                <div className="label">System Status</div>
              </div>
              <div className="security-metric">
                <div className="value">2,847</div>
                <div className="label">Active Threats</div>
              </div>
              <div className="security-metric">
                <div className="value">99.7%</div>
                <div className="label">Detection Rate</div>
              </div>
              <div className="security-metric">
                <div className="value">&lt;5min</div>
                <div className="label">Response Time</div>
              </div>
            </div>

            {/* Active Threats Summary */}
            <div className="security-card">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2 text-red-400" />
                Active Threat Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-red-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-red-400 mb-1">12</div>
                  <div className="text-red-200 text-sm">Critical Threats</div>
                </div>
                <div className="text-center p-4 bg-orange-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-orange-400 mb-1">45</div>
                  <div className="text-orange-200 text-sm">High Priority</div>
                </div>
                <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">128</div>
                  <div className="text-yellow-200 text-sm">Medium Priority</div>
                </div>
              </div>
            </div>

            {/* Recent Incidents */}
            <div className="security-card">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-blue-400" />
                Recent Security Incidents
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Unauthorized Access Attempt</div>
                    <div className="text-gray-400 text-sm">PRIV Trading System - 2 minutes ago</div>
                  </div>
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm">CRITICAL</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">DDoS Attack Detected</div>
                    <div className="text-gray-400 text-sm">OMEGA Medical Portal - 15 minutes ago</div>
                  </div>
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-sm">HIGH</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">Malware Signature Match</div>
                    <div className="text-gray-400 text-sm">HATHOR Mining Network - 1 hour ago</div>
                  </div>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-sm">MEDIUM</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'threats':
        return (
          <div className="space-y-6">
            <div className="security-card">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2 text-red-400" />
                Real-time Threat Detection
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-white mb-3">Threat Categories</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Network Intrusion</span>
                      <span className="text-red-400 font-semibold">23 active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Malware Detection</span>
                      <span className="text-orange-400 font-semibold">15 active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">DDoS Attacks</span>
                      <span className="text-yellow-400 font-semibold">8 active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Data Exfiltration</span>
                      <span className="text-blue-400 font-semibold">5 active</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-3">Affected Systems</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">PRIV Trading</span>
                      <span className="text-red-400 font-semibold">CRITICAL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">OMEGA Medical</span>
                      <span className="text-orange-400 font-semibold">HIGH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">HATHOR Mining</span>
                      <span className="text-yellow-400 font-semibold">MEDIUM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">BRIGIT Governance</span>
                      <span className="text-green-400 font-semibold">LOW</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'incidents':
        return (
          <div className="space-y-6">
            <div className="security-card">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-blue-400" />
                Incident Response Center
              </h3>
              <div className="incident-timeline">
                <div className="incident-event">
                  <div className="text-white font-medium">INC-2026-00412: Critical Data Breach</div>
                  <div className="text-gray-400 text-sm">PRIV Trading System - Status: CONTAINED</div>
                  <div className="text-xs text-gray-500 mt-1">Started: 2 hours ago | Response: 4 minutes</div>
                </div>
                <div className="incident-event">
                  <div className="text-white font-medium">INC-2026-00411: DDoS Mitigation</div>
                  <div className="text-gray-400 text-sm">OMEGA Medical Portal - Status: RESOLVED</div>
                  <div className="text-xs text-gray-500 mt-1">Started: 45 minutes ago | Response: 2 minutes</div>
                </div>
                <div className="incident-event">
                  <div className="text-white font-medium">INC-2026-00410: Malware Containment</div>
                  <div className="text-gray-400 text-sm">HATHOR Mining Network - Status: INVESTIGATING</div>
                  <div className="text-xs text-gray-500 mt-1">Started: 1 hour ago | Response: 8 minutes</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'intelligence':
        return (
          <div className="space-y-6">
            <div className="security-card">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Eye className="w-6 h-6 mr-2 text-purple-400" />
                Threat Intelligence Feed
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-white mb-3">Intelligence Sources</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Dark Web Monitoring</span>
                      <span className="text-green-400 font-semibold">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Honeypot Networks</span>
                      <span className="text-green-400 font-semibold">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Partner Intelligence</span>
                      <span className="text-green-400 font-semibold">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">AI Correlation Engine</span>
                      <span className="text-green-400 font-semibold">Active</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-3">Recent Intelligence</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="text-white font-medium text-sm">New Ransomware Campaign</div>
                      <div className="text-gray-400 text-xs">Targeting financial institutions</div>
                    </div>
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="text-white font-medium text-sm">Zero-day Vulnerability</div>
                      <div className="text-gray-400 text-xs">Affects React applications</div>
                    </div>
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="text-white font-medium text-sm">Supply Chain Attack</div>
                      <div className="text-gray-400 text-xs">Popular npm package compromised</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'operations':
        return (
          <div className="space-y-6">
            <div className="security-card">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Radar className="w-6 h-6 mr-2 text-cyan-400" />
                Security Operations Center
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">24/7</div>
                  <div className="text-cyan-200 text-sm">Monitoring</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">SOC</div>
                  <div className="text-cyan-200 text-sm">Team</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">AI</div>
                  <div className="text-cyan-200 text-sm">Assisted</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-6">
            <div className="security-card">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Settings className="w-6 h-6 mr-2 text-gray-400" />
                System Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-white mb-3">Security Policies</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Zero Trust</span>
                      <span className="text-green-400 font-semibold">Enabled</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Multi-factor Auth</span>
                      <span className="text-green-400 font-semibold">Required</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Encryption</span>
                      <span className="text-green-400 font-semibold">AES-256</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-3">System Health</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">CPU Usage</span>
                      <span className="text-green-400 font-semibold">23%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Memory Usage</span>
                      <span className="text-yellow-400 font-semibold">67%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Storage</span>
                      <span className="text-green-400 font-semibold">45%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-400 to-orange-600 rounded-lg mr-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">SEKHMET</h1>
              <p className="text-red-200">Threat Intelligence & Security Operations</p>
            </div>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Advanced threat detection, automated incident response, and comprehensive security monitoring
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-red-500/20 text-red-300 rounded-full hover:bg-red-500/30 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
            {refreshStatus && (
              <div className="text-xs text-gray-400">{refreshStatus}</div>
            )}
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 mx-1 mb-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;