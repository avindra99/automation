import React, { useState } from 'react';
import { Server } from '@/data/mockData';

import BuildModal from './BuildModal';

interface ServerTableProps {
    servers: Server[];
    onUpgrade: (serverId: string | number, componentName: string, targetVersion: string) => Promise<void>;
}

const ServerTable: React.FC<ServerTableProps> = ({ servers, onUpgrade }) => {
    const [upgradingState, setUpgradingState] = useState<{ [key: string]: boolean }>({});
    const [activeBuild, setActiveBuild] = useState<{ serverId: string | number, componentName: string } | null>(null);

    const handleUpgradeClick = async (serverId: string | number, componentName: string, targetVersion: string) => {
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
        <div className="table-card" style={{ border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', borderRadius: '12px', overflow: 'hidden' }}>
            {activeBuild && (
                <BuildModal
                    serverId={activeBuild.serverId}
                    componentName={activeBuild.componentName}
                    onClose={() => setActiveBuild(null)}
                    onExecute={async (version) => {
                        await handleUpgradeClick(activeBuild.serverId, activeBuild.componentName, version);
                    }}
                />
            )}
            <div className="table-header" style={{ padding: '1.5rem', background: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>Middleware Components for Environment</h2>
                    <button className="btn btn-ghost" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2563eb', border: '1px solid #dbeafe', padding: '0.6rem 1.2rem', borderRadius: '8px' }}>
                        Sync Vulnerabilities (XLS/API)
                    </button>
                </div>
            </div>
            <table style={{ background: 'white', width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
                <thead>
                    <tr style={{ background: '#f8fafc' }}>
                        <th style={headerStyle}>Hostname</th>
                        <th style={headerStyle}>IP Address</th>
                        <th style={headerStyle}>Software</th>
                        <th style={headerStyle}>Install Directory</th>
                        <th style={headerStyle}>Vulnerabilities</th>
                        <th style={headerStyle}>Current Version</th>
                        <th style={headerStyle}>Target Version</th>
                        <th style={headerStyle}>Status</th>
                        <th style={headerStyle}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {servers.map((server) => (
                        <React.Fragment key={server.id}>
                            {server.components.map((comp) => {
                                const isUpdating = upgradingState[`${server.id}-${comp.name}`];
                                const isVulnerable = (comp.vulnerabilities || "").toLowerCase().includes('critical') ||
                                    (comp.vulnerabilities || "").toLowerCase().includes('high');

                                return (
                                    <tr key={`${server.id}-${comp.name}`} style={{ transition: 'background-color 0.2s' }} className="table-row">
                                        <td style={cellStyle}>{server.hostname}</td>
                                        <td style={{ ...cellStyle, color: '#64748b' }}>{server.ip}</td>
                                        <td style={{ ...cellStyle, fontWeight: 700, color: '#1e293b' }}>{comp.name}</td>
                                        <td style={{ ...cellStyle, color: '#475569', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                                            {comp.installPath || "/opt/verizon/software"}
                                        </td>
                                        <td style={cellStyle}>
                                            <span style={{
                                                backgroundColor: isVulnerable ? '#fef2f2' : '#f0fdf4',
                                                color: isVulnerable ? '#dc2626' : '#16a34a',
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '6px',
                                                fontWeight: 600,
                                                fontSize: '0.85rem',
                                                border: `1px solid ${isVulnerable ? '#fee2e2' : '#dcfce7'}`
                                            }}>
                                                {comp.vulnerabilities || "Clean"}
                                            </span>
                                        </td>
                                        <td style={{ ...cellStyle, fontWeight: 500 }}>{comp.currentVersion}</td>
                                        <td style={{ ...cellStyle, fontWeight: 500, color: '#2563eb' }}>{comp.targetVersion}</td>
                                        <td style={cellStyle}>
                                            <span className={`badge ${server.status === "Outdated" ? "status-outdated" : (server.status === "Vulnerable" ? "status-vulnerable" : "status-uptodate")}`}>
                                                {server.status}
                                            </span>
                                        </td>
                                        <td style={cellStyle}>
                                            {server.status === "Up to Date" ? (
                                                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>Up to Date</span>
                                            ) : (
                                                <button
                                                    className="btn"
                                                    style={{
                                                        fontSize: '0.85rem',
                                                        padding: '0.5rem 1.25rem',
                                                        backgroundColor: '#22c55e',
                                                        color: '#ffffff',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        fontWeight: 700,
                                                        cursor: 'pointer',
                                                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    disabled={isUpdating}
                                                    onClick={() => setActiveBuild({ serverId: server.id, componentName: comp.name })}
                                                >
                                                    {isUpdating ? 'Executing...' : 'Build'}
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
            <style jsx>{`
                .table-row:hover {
                    background-color: #f8fafc;
                }
            `}</style>
        </div>
    );
};

const headerStyle: React.CSSProperties = {
    padding: '1rem 1.5rem',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #f1f5f9'
};

const cellStyle: React.CSSProperties = {
    padding: '1.25rem 1.5rem',
    fontSize: '0.9rem',
    borderBottom: '1px solid #f1f5f9'
};

export default ServerTable;

