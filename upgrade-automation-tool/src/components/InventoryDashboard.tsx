"use client";

import React, { useState } from 'react';
import { Application, Environment, Server } from '@/data/mockData';

interface InventoryDashboardProps {
    data: {
        applications: Application[];
        environments: Environment[];
        servers: Server[];
    };
}

const InventoryDashboard: React.FC<InventoryDashboardProps> = ({ data }) => {
    const [selectedAppId, setSelectedAppId] = useState<number | null>(
        data.applications.length > 0 ? data.applications[0].id : null
    );
    const [selectedEnv, setSelectedEnv] = useState<"Non-Prod" | "Prod">("Non-Prod");

    const naturalSort = (a: string, b: string) => {
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    };

    const currentApp = data.applications.find(a => a.id === selectedAppId);

    const filteredServers = data.servers.filter(s => {
        const env = data.environments.find(e => e.id === s.envId);
        return s.appId === selectedAppId && env?.name === selectedEnv;
    }).sort((a, b) => naturalSort(a.hostname, b.hostname));

    return (
        <div style={{ display: 'flex', gap: '2rem', height: '100%', animation: 'fadeIn 0.3s ease-out' }}>
            {/* Sidebar App List */}
            <div style={{
                width: '320px',
                background: 'white',
                borderRadius: '20px',
                padding: '1.75rem',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border)'
            }}>
                <h3 style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#64748b',
                    marginBottom: '1.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>
                    Enterprise Application Matrix
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {data.applications.map(app => (
                        <button
                            key={app.id}
                            onClick={() => setSelectedAppId(app.id)}
                            style={{
                                textAlign: 'left',
                                padding: '0.875rem 1.25rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: selectedAppId === app.id ? '#000000' : 'transparent',
                                color: selectedAppId === app.id ? '#ffffff' : '#64748b',
                                fontWeight: selectedAppId === app.id ? 700 : 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontSize: '0.9rem'
                            }}
                        >
                            {app.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{
                flex: 1,
                background: 'white',
                borderRadius: '20px',
                padding: '2.5rem',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border)',
                overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#000', letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
                            {currentApp?.name || "Inventory Overview"}
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>ACTIVE DEPLOYMENT</span>
                            <div style={{ width: '1px', height: '12px', background: '#e2e8f0' }}></div>
                            <span style={{ fontSize: '0.875rem', color: '#000', fontWeight: 700 }}>{selectedEnv.toUpperCase()}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.375rem', borderRadius: '12px', gap: '0.25rem' }}>
                        {(["Non-Prod", "Prod"] as const).map((env) => (
                            <button
                                key={env}
                                onClick={() => setSelectedEnv(env)}
                                style={{
                                    padding: '0.625rem 1.75rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    background: selectedEnv === env ? 'white' : 'transparent',
                                    color: selectedEnv === env ? '#000000' : '#64748b',
                                    boxShadow: selectedEnv === env ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                    textTransform: 'uppercase'
                                }}
                            >
                                {env}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredServers.length > 0 ? (
                    <div className="data-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '60%' }}>Infrastructure Hostname</th>
                                    <th>Point of Presence (IP)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredServers.map((server) => (
                                    <tr key={server.id}>
                                        <td style={{ fontWeight: 700, color: '#0f172a' }}>{server.hostname}</td>
                                        <td style={{ color: '#64748b', fontFamily: 'monospace', fontWeight: 500 }}>{server.ip}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '6rem 2rem',
                        background: '#f8fafc',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0'
                    }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Null Result Set</h3>
                        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>No telemetry data found for the selected application in this environment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryDashboard;
