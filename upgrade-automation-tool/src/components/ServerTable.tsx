"use client";

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
            console.error("Operation failed:", error);
        } finally {
            setUpgradingState(prev => ({ ...prev, [key]: false }));
        }
    };

    return (
        <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
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

            <div style={{ padding: '1.5rem 2.5rem', background: '#ffffff', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#000', letterSpacing: '-0.025em' }}>Deployment Instances</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', background: '#f8fafc', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        ACTIVE INSTANCES: {servers.length}
                    </span>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc' }}>
                            <th style={headerStyle}>Host Infrastructure</th>
                            <th style={headerStyle}>Software</th>
                            <th style={headerStyle}>Version Hierarchy</th>
                            <th style={headerStyle}>Compliance</th>
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
                                        <tr key={`${server.id}-${comp.name}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={cellStyle}>
                                                <div style={{ fontWeight: 700, color: '#0f172a' }}>{server.hostname}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>{server.ip}</div>
                                            </td>
                                            <td style={cellStyle}>
                                                <span style={{
                                                    padding: '0.375rem 0.75rem',
                                                    background: '#f1f5f9',
                                                    color: '#334155',
                                                    borderRadius: '6px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 800
                                                }}>
                                                    {comp.name.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={cellStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <span style={{ color: '#64748b', fontWeight: 600 }}>{comp.currentVersion}</span>
                                                    <div style={{ width: '12px', height: '1px', background: '#cbd5e1' }}></div>
                                                    <span style={{ color: '#000', fontWeight: 800 }}>{comp.targetVersion}</span>
                                                </div>
                                            </td>
                                            <td style={cellStyle}>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <span style={{
                                                        backgroundColor: isVulnerable ? '#fef2f2' : '#f0fdf4',
                                                        color: isVulnerable ? '#b91c1c' : '#166534',
                                                        padding: '0.375rem 0.625rem',
                                                        borderRadius: '6px',
                                                        fontWeight: 800,
                                                        fontSize: '0.7rem',
                                                        border: `1px solid ${isVulnerable ? '#fecaca' : '#bbf7d0'}`,
                                                        textTransform: 'uppercase'
                                                    }}>
                                                        {isVulnerable ? 'Critical Risk' : 'Secure'}
                                                    </span>
                                                    <span style={{
                                                        backgroundColor: server.status === "Up to Date" ? '#ecfdf5' : '#fffbeb',
                                                        color: server.status === "Up to Date" ? '#065f46' : '#92400e',
                                                        padding: '0.375rem 0.625rem',
                                                        borderRadius: '6px',
                                                        fontWeight: 800,
                                                        fontSize: '0.7rem',
                                                        border: `1px solid ${server.status === "Up to Date" ? '#a7f3d0' : '#fde68a'}`,
                                                        textTransform: 'uppercase'
                                                    }}>
                                                        {server.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={cellStyle}>
                                                {server.status === "Up to Date" ? (
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>SYNCHRONIZED</div>
                                                ) : (
                                                    <button
                                                        className="btn btn-primary"
                                                        style={{
                                                            fontSize: '0.7rem',
                                                            padding: '0.5rem 1.25rem',
                                                            fontWeight: 800,
                                                            height: '2.5rem',
                                                            minWidth: '100px',
                                                            letterSpacing: '0.05em'
                                                        }}
                                                        disabled={isUpdating}
                                                        onClick={() => setActiveBuild({ serverId: server.id, componentName: comp.name })}
                                                    >
                                                        {isUpdating ? 'INITIALIZING...' : 'INITIATE BUILD'}
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
        </div>
    );
};

const headerStyle: React.CSSProperties = {
    padding: '1.25rem 2.5rem',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: 800,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #f1f5f9'
};

const cellStyle: React.CSSProperties = {
    padding: '1.5rem 2.5rem',
    fontSize: '0.875rem',
    borderBottom: '1px solid #f1f5f9'
};

export default ServerTable;
