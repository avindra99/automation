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

    // Natural sort logic for hostnames (handles characters and numbers)
    const naturalSort = (a: string, b: string) => {
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    };

    const currentApp = data.applications.find(a => a.id === selectedAppId);

    // Filter servers based on selection
    const filteredServers = data.servers.filter(s => {
        const env = data.environments.find(e => e.id === s.envId);
        return s.appId === selectedAppId && env?.name === selectedEnv;
    }).sort((a, b) => naturalSort(a.hostname, b.hostname));

    return (
        <div style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 200px)', animation: 'fadeIn 0.3s ease-out' }}>
            {/* Sidebar App List */}
            <div style={{ width: '300px', background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Applications
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {data.applications.map(app => (
                        <button
                            key={app.id}
                            onClick={() => setSelectedAppId(app.id)}
                            style={{
                                textAlign: 'left',
                                padding: '1rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: selectedAppId === app.id ? '#f1f5f9' : 'transparent',
                                color: selectedAppId === app.id ? '#2563eb' : '#475569',
                                fontWeight: selectedAppId === app.id ? 700 : 500,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <span>{app.name}</span>
                            {selectedAppId === app.id && <span style={{ fontSize: '1.2rem' }}>•</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{currentApp?.name || "Inventory View"}</h2>
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Environment: <span style={{ fontWeight: 700, color: '#334155' }}>{selectedEnv}</span></p>
                    </div>

                    <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.4rem', borderRadius: '12px', gap: '0.5rem' }}>
                        <button
                            onClick={() => setSelectedEnv("Non-Prod")}
                            style={{
                                padding: '0.6rem 2rem', borderRadius: '8px', border: 'none',
                                fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                                background: selectedEnv === "Non-Prod" ? 'white' : 'transparent',
                                color: selectedEnv === "Non-Prod" ? '#2563eb' : '#64748b',
                                boxShadow: selectedEnv === "Non-Prod" ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                            }}
                        >
                            Non-Prod
                        </button>
                        <button
                            onClick={() => setSelectedEnv("Prod")}
                            style={{
                                padding: '0.6rem 2rem', borderRadius: '8px', border: 'none',
                                fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                                background: selectedEnv === "Prod" ? 'white' : 'transparent',
                                color: selectedEnv === "Prod" ? '#2563eb' : '#64748b',
                                boxShadow: selectedEnv === "Prod" ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                            }}
                        >
                            Prod
                        </button>
                    </div>
                </div>

                {filteredServers.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #f1f5f9' }}>
                                <th style={thStyle}>Hostname (Sorted ↑)</th>
                                <th style={thStyle}>IP Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServers.map((server) => (
                                <tr key={server.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ ...tdStyle, fontWeight: 700, color: '#1e293b' }}>{server.hostname}</td>
                                    <td style={{ ...tdStyle, color: '#64748b', fontFamily: 'monospace' }}>{server.ip}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                        <p>No servers found for {currentApp?.name} in {selectedEnv} environment.</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

const thStyle: React.CSSProperties = {
    padding: '1.25rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em'
};

const tdStyle: React.CSSProperties = {
    padding: '1.25rem 1rem', fontSize: '0.9rem', color: '#334155'
};

export default InventoryDashboard;
