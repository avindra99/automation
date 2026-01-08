"use client";

import React, { useEffect, useState } from 'react';
import AppSelector from './AppSelector';
import EnvSelector from './EnvSelector';
import ServerTable from './ServerTable';
import AppForm from './AppForm';
import { Application, Environment, Server } from '@/data/mockData';

const Dashboard = () => {
    const [data, setData] = useState<{
        applications: Application[];
        environments: Environment[];
        servers: Server[];
    } | null>(null);

    const [selectedAppId, setSelectedAppId] = useState<string>("vzweb");
    const [selectedEnvIds, setSelectedEnvIds] = useState<string[]>(["qa"]);
    const [showAppForm, setShowAppForm] = useState(false);
    const [editingApp, setEditingApp] = useState<Application | null>(null);

    const fetchData = async () => {
        const res = await fetch('/api/inventory');
        const d = await res.json();
        setData(d);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleToggleEnv = (envName: string) => {
        const lower = envName.toLowerCase();
        setSelectedEnvIds(prev =>
            prev.includes(lower) ? prev.filter(e => e !== lower) : [...prev, lower]
        );
    };

    const handleUpgrade = async (serverId: string, componentName: string, targetVersion: string) => {
        await fetch('/api/upgrade', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ serverId, componentName, targetVersion }),
        });
        fetchData();
    };

    const handleAppSubmit = async (formData: any) => {
        await fetch('/api/applications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        setShowAppForm(false);
        setEditingApp(null);
        fetchData();
    };

    if (!data) return <div style={{ padding: '2rem' }}>Loading Inventory Data...</div>;

    const filteredServers = data.servers.filter(s => {
        const env = data.environments.find(e => e.id === s.envId);
        return s.appId === selectedAppId && env && selectedEnvIds.includes(env.name.toLowerCase());
    });

    const totalServers = filteredServers.length;
    const upgradesNeeded = filteredServers.filter(s => s.status !== "Up to Date").length;
    const upToDate = totalServers - upgradesNeeded;

    return (
        <div className="app-container">
            {showAppForm && (
                <AppForm
                    initialData={editingApp || undefined}
                    onSubmit={handleAppSubmit}
                    onClose={() => { setShowAppForm(false); setEditingApp(null); }}
                />
            )}

            {/* Top Nav */}
            <nav className="top-nav">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>📦 Upgrade Automation Tool</span>
                </div>
                <div className="top-nav-links">
                    <a href="#">Dashboard</a>
                    <a href="#" className="active">Applications</a>
                    <a href="#">Upgrade History</a>
                    <a href="#">Settings</a>
                    <div style={{ marginLeft: '1rem', cursor: 'pointer' }}>👤 ▼</div>
                </div>
            </nav>

            <div className="main-body">
                {/* Sidebar */}
                <aside className="sidebar">
                    <div style={{ marginBottom: '1.5rem' }}>
                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            onClick={() => setShowAppForm(true)}
                        >
                            <span>➕</span> Upload New App
                        </button>
                    </div>
                    <AppSelector
                        applications={data.applications}
                        selectedAppId={selectedAppId}
                        onSelect={setSelectedAppId}
                        onEdit={(app) => { setEditingApp(app); setShowAppForm(true); }}
                    />
                    <EnvSelector
                        environments={[
                            { id: 'dev', name: 'Dev' },
                            { id: 'qa', name: 'QA' },
                            { id: 'staging', name: 'Staging' },
                            { id: 'prod', name: 'Production' }
                        ]}
                        selectedEnvIds={selectedEnvIds}
                        onToggle={handleToggleEnv}
                    />
                </aside>

                {/* Content Area */}
                <main className="content-area">
                    <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 style={{ fontSize: '1.5rem', margin: 0 }}>
                                Environment: <span style={{ color: '#2d3748' }}>{selectedEnvIds.map(e => e.toUpperCase()).join(", ") || "None"}</span>
                            </h1>
                            <p style={{ color: '#718096', marginTop: '0.5rem' }}>
                                App: <strong>{data.applications.find(a => a.id === selectedAppId)?.name}</strong>
                                (VAST ID: {data.applications.find(a => a.id === selectedAppId)?.vastId})
                            </p>
                        </div>
                    </div>

                    <ServerTable
                        servers={filteredServers}
                        onUpgrade={handleUpgrade}
                    />

                    <div className="summary-bar">
                        <div className="stat-item">
                            <span>Total Servers:</span>
                            <span>{totalServers}</span>
                        </div>
                        <div className="stat-item">
                            <span>Upgrades Needed:</span>
                            <span className="stat-red">{upgradesNeeded}</span>
                        </div>
                        <div className="stat-item">
                            <span>Up to Date:</span>
                            <span className="stat-green">{upToDate}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                        <button className="btn btn-batch">Batch Upgrade</button>
                        <button className="btn btn-ghost" onClick={fetchData}>🔄 Refresh</button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
