"use client";

import React, { useEffect, useState } from 'react';
import AppSelector from './AppSelector';
import EnvSelector from './EnvSelector';
import ServerTable from './ServerTable';
import AppForm from './AppForm';
import ArtifactForm from './ArtifactForm';
import HistoryModal from './HistoryModal';
import { Application, Environment, Server } from '@/data/mockData';

import InventoryDashboard from './InventoryDashboard';
import VulnerabilityScanner from './VulnerabilityScanner';

const Dashboard = () => {
    const [data, setData] = useState<{
        applications: Application[];
        environments: Environment[];
        servers: Server[];
    } | null>(null);

    const [activeTab, setActiveTab] = useState<'automation' | 'inventory' | 'security'>('automation');
    const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
    const [selectedEnvNames, setSelectedEnvNames] = useState<string[]>(["Non-Prod", "Prod"]);
    const [showAppForm, setShowAppForm] = useState(false);
    const [showArtifactForm, setShowArtifactForm] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [editingApp, setEditingApp] = useState<Application | null>(null);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/inventory');
            const d = await res.json();
            setData(d);

            // Set initial selected app if none selected
            if (!selectedAppId && d.applications && d.applications.length > 0) {
                setSelectedAppId(d.applications[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch inventory:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleToggleEnv = (envName: string) => {
        setSelectedEnvNames(prev =>
            prev.includes(envName) ? prev.filter(e => e !== envName) : [...prev, envName]
        );
    };

    const handleUpgrade = async (serverId: string | number, componentName: string, targetVersion: string) => {
        await fetch('http://localhost:8081/api/upgrade', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ serverId, componentName, targetVersion }),
        });

        setTimeout(() => fetchData(), 2000);
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

    const handleDeleteApp = async (appId: number) => {
        try {
            const res = await fetch(`/api/applications/${appId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                if (selectedAppId === appId) {
                    setSelectedAppId(null);
                }
                fetchData();
            } else {
                alert("Failed to delete application.");
            }
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    if (!data) return <div style={{ padding: '2rem' }}>Loading Enterprise Inventory...</div>;

    const filteredServers = data.servers.filter(s => {
        const env = data.environments.find(e => e.id === s.envId);
        return s.appId === selectedAppId && env && selectedEnvNames.includes(env.name);
    });

    const currentApp = data.applications.find(a => a.id === selectedAppId);

    const upgradesNeeded = data.servers.filter(s => s.status !== "Up to Date").length;
    const totalServersCount = data.servers.length;
    const upToDateCount = totalServersCount - upgradesNeeded;

    return (
        <div className="app-container">
            {showAppForm && (
                <AppForm
                    initialData={editingApp || undefined}
                    onSubmit={handleAppSubmit}
                    onClose={() => { setShowAppForm(false); setEditingApp(null); }}
                />
            )}

            {showArtifactForm && (
                <ArtifactForm
                    onClose={() => setShowArtifactForm(false)}
                    onUploadSuccess={() => {
                        fetchData();
                    }}
                />
            )}

            {showHistoryModal && (
                <HistoryModal onClose={() => setShowHistoryModal(false)} />
            )}

            <nav className="top-nav">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>VERIZON UPGRADE AUTOMATION</span>
                </div>
                <div className="top-nav-links">
                    <a href="#" className={activeTab === 'automation' ? 'active' : ''} onClick={() => setActiveTab('automation')}>Upgrade Utility</a>
                    <a href="#" className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>Inventory Dashboard</a>
                    <a href="#" onClick={() => setShowHistoryModal(true)}>Audit Logs</a>
                    <a href="#" className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}>Security Scan</a>
                </div>
            </nav>

            {activeTab === 'inventory' ? (
                <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Global Inventory </h1>

                        </div>
                        <button className="btn btn-primary" onClick={fetchData}>Refresh Data</button>
                    </div>
                    <InventoryDashboard data={data} />
                </div>
            ) : activeTab === 'security' ? (
                <VulnerabilityScanner />
            ) : (
                <div className="main-body">
                    <aside className="sidebar">
                        <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', fontWeight: 700 }}
                                onClick={() => setShowAppForm(true)}
                            >
                                + Register App
                            </button>
                            <button
                                className="btn btn-ghost"
                                style={{ width: '100%', border: '1px solid #e2e8f0', background: 'white' }}
                                onClick={() => setShowArtifactForm(true)}
                            >
                                Upload Artifact
                            </button>
                        </div>

                        <AppSelector
                            applications={data.applications}
                            selectedAppId={selectedAppId}
                            onSelect={(appId) => setSelectedAppId(appId)}
                            onDelete={handleDeleteApp}
                            onEdit={(app) => {
                                const fullApp = {
                                    ...app,
                                    environments: data.environments
                                        .filter(e => e.appId === app.id)
                                        .map(e => ({
                                            ...e,
                                            servers: data.servers.filter(s => s.appId === app.id && s.envId === e.id)
                                        }))
                                };
                                setEditingApp(fullApp as any);
                                setShowAppForm(true);
                            }}
                        />

                        <EnvSelector
                            environments={data.environments.filter(e => e.appId === selectedAppId)}
                            selectedEnvNames={selectedEnvNames}
                            onToggle={handleToggleEnv}
                        />

                        <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                            <div className="sidebar-title">Security Health</div>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '1rem', background: '#fef2f2', borderRadius: '12px',
                                border: '1px solid #fee2e2'
                            }} className="critical-badge">
                                <div style={{
                                    width: '32px', height: '32px', background: '#ef4444',
                                    borderRadius: '8px', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', color: 'white', fontWeight: 800
                                }}>{upgradesNeeded}</div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#991b1b' }}>Pending Upgrades</div>
                                    <div style={{ fontSize: '0.7rem', color: '#dc2626' }}>Action Required</div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <main className="content-area">
                        <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
                                    {currentApp ? currentApp.name : "Select Application"}
                                </h1>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', alignItems: 'center' }}>
                                    <span style={{ padding: '0.2rem 0.6rem', background: '#f1f5f9', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
                                        VAST ID: {currentApp?.vastId || "N/A"}
                                    </span>
                                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                                        Showing: {selectedEnvNames.length} Environments
                                    </span>
                                </div>
                            </div>
                            <button
                                className="btn btn-ghost"
                                style={{ border: '1px solid #e2e8f0', background: 'white', fontWeight: 600 }}
                                onClick={() => {
                                    if (currentApp) {
                                        const fullApp = {
                                            ...currentApp,
                                            environments: data.environments
                                                .filter(e => e.appId === currentApp.id)
                                                .map(e => ({
                                                    ...e,
                                                    servers: data.servers.filter(s => s.appId === currentApp.id && s.envId === e.id)
                                                }))
                                        };
                                        setEditingApp(fullApp as any);
                                        setShowAppForm(true);
                                    }
                                }}
                            >
                                Update Inventory
                            </button>
                        </div>

                        <ServerTable
                            servers={filteredServers}
                            onUpgrade={handleUpgrade}
                        />

                        <div className="summary-bar" style={{ marginTop: '2rem' }}>
                            <div className="stat-item">
                                <span>Active Servers</span>
                                <span style={{ fontWeight: 800 }}>{filteredServers.length}</span>
                            </div>
                            <div className="stat-item">
                                <span>Vulnerable/Outdated</span>
                                <span className="stat-red" style={{ fontWeight: 800 }}>{filteredServers.filter(s => s.status !== "Up to Date").length}</span>
                            </div>
                            <div className="stat-item">
                                <span>Compliance Status</span>
                                <span className="stat-green" style={{ fontWeight: 800 }}>{filteredServers.filter(s => s.status === "Up to Date").length}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
                            <button className="btn btn-batch" style={{ padding: '0.75rem 2.5rem', fontWeight: 700 }}>Initiate Batch Upgrade</button>
                            <button className="btn btn-ghost" style={{ border: '1px solid #cbd5e0' }} onClick={fetchData}>Refresh Inventory</button>
                        </div>
                    </main>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
