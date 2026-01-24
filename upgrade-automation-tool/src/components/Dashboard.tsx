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

            if (!selectedAppId && d.applications && d.applications.length > 0) {
                setSelectedAppId(d.applications[0].id);
            }
        } catch (error) {
            console.error("Connectivity issue:", error);
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
        await fetch('/api/upgrade', {
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
            const res = await fetch(`/api/applications/${appId}`, { method: 'DELETE' });
            if (res.ok) {
                if (selectedAppId === appId) setSelectedAppId(null);
                fetchData();
            }
        } catch (error) {
            console.error("Operation failed:", error);
        }
    };

    if (!data) return (
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>
                INITIALIZING ENTERPRISE ENVIRONMENT...
            </div>
        </div>
    );

    const filteredServers = data.servers.filter(s => {
        const env = data.environments.find(e => e.id === s.envId);
        return s.appId === selectedAppId && env && selectedEnvNames.includes(env.name);
    });

    const currentApp = data.applications.find(a => a.id === selectedAppId);
    const upgradesNeeded = data.servers.filter(s => s.status !== "Up to Date").length;

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
                    onUploadSuccess={() => fetchData()}
                />
            )}

            {showHistoryModal && (
                <HistoryModal onClose={() => setShowHistoryModal(false)} />
            )}

            <nav className="top-nav">
                <h1>VERIZON • AUTOMATION CONTROL</h1>
                <div className="top-nav-links">
                    <a href="#" className={activeTab === 'automation' ? 'active' : ''} onClick={() => setActiveTab('automation')}>REMEDIATION PLANNER</a>
                    <a href="#" className={activeTab === 'inventory' ? 'active' : ''} onClick={() => setActiveTab('inventory')}>INVENTORY MATRIX</a>
                    <a href="#" className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}>SECURITY SCANNER</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); setShowHistoryModal(true); }}>AUDIT TRAIL</a>
                </div>
                <div style={{ width: '180px' }}></div> {/* Spacer for balance */}
            </nav>

            {activeTab === 'inventory' ? (
                <div style={{ padding: '2.5rem', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
                    <InventoryDashboard data={data} />
                </div>
            ) : activeTab === 'security' ? (
                <div style={{ padding: '2.5rem', height: 'calc(100vh - 64px)', overflowY: 'auto' }}>
                    <VulnerabilityScanner />
                </div>
            ) : (
                <div className="main-body">
                    <aside className="sidebar">
                        <div style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowAppForm(true)}>
                                REGISTER APPLICATION
                            </button>
                            <button className="btn btn-ghost" style={{ width: '100%', fontWeight: 700 }} onClick={() => setShowArtifactForm(true)}>
                                DEPLOY BINARY
                            </button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem' }}>
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
                        </div>

                        <EnvSelector
                            environments={data.environments.filter(e => e.appId === selectedAppId)}
                            selectedEnvNames={selectedEnvNames}
                            onToggle={handleToggleEnv}
                        />

                        <div style={{ marginTop: '2.5rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                                Compliance Health
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '40px', height: '40px', background: upgradesNeeded > 0 ? '#000' : '#059669',
                                    borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800
                                }}>
                                    {upgradesNeeded}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>{upgradesNeeded > 0 ? 'Remediation Pending' : 'Optimal State'}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>{upgradesNeeded > 0 ? 'Critical updates identified' : 'All systems compliant'}</div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <main className="content-area">
                        <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#000', letterSpacing: '-0.025em' }}>
                                    {currentApp ? currentApp.name : "System Deployment"}
                                </h1>
                                <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.5rem', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        VAST-ID: {currentApp?.vastId || "UNREGISTERED"}
                                    </span>
                                    <div style={{ width: '4px', height: '4px', background: '#cbd5e1', borderRadius: '50%' }}></div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        ACTIVE SCOPE: {selectedEnvNames.length} CLUSTERS
                                    </span>
                                </div>
                            </div>
                            <button
                                className="btn btn-ghost"
                                style={{ borderRadius: '12px' }}
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
                                CONFIGURE INVENTORY
                            </button>
                        </div>

                        <div className="data-table-container">
                            <ServerTable
                                servers={filteredServers}
                                onUpgrade={handleUpgrade}
                            />
                        </div>

                        <div style={{
                            marginTop: '2.5rem',
                            padding: '1.5rem 2rem',
                            background: '#000',
                            borderRadius: '20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                        }}>
                            <div style={{ display: 'flex', gap: '3rem' }}>
                                <div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Target Systems</div>
                                    <div style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 800 }}>{filteredServers.length}</div>
                                </div>
                                <div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Non-Compliant</div>
                                    <div style={{ color: '#ef4444', fontSize: '1.25rem', fontWeight: 800 }}>{filteredServers.filter(s => s.status !== "Up to Date").length}</div>
                                </div>
                                <div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>System Integrity</div>
                                    <div style={{ color: '#059669', fontSize: '1.25rem', fontWeight: 800 }}>
                                        {filteredServers.length > 0 ? Math.round((filteredServers.filter(s => s.status === "Up to Date").length / filteredServers.length) * 100) : 0}%
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="btn" style={{ background: '#fff', color: '#000' }}>INITIATE BATCH REMEDIATION</button>
                                <button className="btn" style={{ background: '#1e293b', color: '#fff' }} onClick={fetchData}>SYNC TELEMETRY</button>
                            </div>
                        </div>
                    </main>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
