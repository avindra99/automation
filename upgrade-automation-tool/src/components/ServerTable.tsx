import React, { useState } from 'react';
import { Server } from '@/data/mockData';

interface ServerTableProps {
    servers: Server[];
    onUpgrade: (serverId: string, componentName: string, targetVersion: string) => Promise<void>;
}

const TYPE_ICONS: Record<string, string> = {
    "Java": "☕",
    "Python": "🐍",
    "Node.js": "🟢",
    "OpenSSL": "📁",
    "Data": "📊",
    "Web": "🌐",
    "API": "⚙️",
    "Analytics": "📈",
};

const ServerTable: React.FC<ServerTableProps> = ({ servers, onUpgrade }) => {
    const [upgradingState, setUpgradingState] = useState<{ [key: string]: boolean }>({});

    const handleUpgradeClick = async (serverId: string, componentName: string, targetVersion: string) => {
        const key = `${serverId}-${componentName}`;
        setUpgradingState(prev => ({ ...prev, [key]: true }));

        try {
            await onUpgrade(serverId, componentName, targetVersion);
        } catch (error) {
            console.error("Upgrade failed", error);
        } finally {
            setUpgradingState(prev => ({ ...prev, [key]: false }));
        }
    };

    return (
        <div className="table-card">
            <div className="table-header">
                <h2>Middleware Components for Environment</h2>
                <div style={{ color: '#cbd5e0', fontSize: '1.2rem', cursor: 'pointer' }}>...</div>
            </div>
            <table style={{ background: 'white' }}>
                <thead>
                    <tr>
                        <th>Hostname</th>
                        <th>Software</th>
                        <th>Current Version</th>
                        <th>Patch Level</th>
                        <th>Target Version</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {servers.map((server) => (
                        <React.Fragment key={server.id}>
                            {server.components.map((comp) => {
                                const isUpdating = upgradingState[`${server.id}-${comp.name}`];
                                const statusClass =
                                    server.status === "Outdated" ? "status-outdated" :
                                        server.status === "Vulnerable" ? "status-vulnerable" :
                                            "status-uptodate";

                                return (
                                    <tr key={`${server.id}-${comp.name}`}>
                                        <td style={{ fontWeight: 500 }}>{server.hostname}</td>
                                        <td>
                                            <span style={{ marginRight: '8px' }}>{TYPE_ICONS[comp.type] || "📦"}</span>
                                            {comp.name}
                                        </td>
                                        <td>{comp.currentVersion}</td>
                                        <td>{comp.patchLevel}</td>
                                        <td>{comp.targetVersion}</td>
                                        <td>
                                            <span className={`badge ${statusClass}`}>
                                                {server.status}
                                            </span>
                                        </td>
                                        <td>
                                            {server.status === "Up to Date" ? (
                                                <span style={{ fontSize: '0.8rem', color: '#a0aec0' }}>No Action Needed</span>
                                            ) : (
                                                <button
                                                    className="btn btn-primary"
                                                    style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}
                                                    disabled={isUpdating}
                                                    onClick={() => handleUpgradeClick(server.id, comp.name, comp.targetVersion)}
                                                >
                                                    {isUpdating ? 'Updating...' : 'Upgrade'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ServerTable;
