"use client";

import React, { useState } from 'react';

interface EnvConfig {
    name: "Non-Prod" | "Prod";
    enabled: boolean;
    servers: string[];
}

interface AppFormProps {
    initialData?: any;
    onSubmit: (data: any) => void;
    onClose: () => void;
}

const AppForm: React.FC<AppFormProps> = ({ initialData, onSubmit, onClose }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [vastId, setVastId] = useState(initialData?.vastId || '');

    const [envs, setEnvs] = useState<EnvConfig[]>([
        {
            name: 'Non-Prod',
            enabled: initialData?.environments?.some((e: any) => e.name === 'Non-Prod') ?? true,
            servers: initialData?.environments?.find((e: any) => e.name === 'Non-Prod')?.servers.map((s: any) => s.hostname) || ['']
        },
        {
            name: 'Prod',
            enabled: initialData?.environments?.some((e: any) => e.name === 'Prod') ?? true,
            servers: initialData?.environments?.find((e: any) => e.name === 'Prod')?.servers.map((s: any) => s.hostname) || ['']
        },
    ]);

    const handleToggleEnv = (index: number) => {
        const newEnvs = [...envs];
        newEnvs[index].enabled = !newEnvs[index].enabled;
        setEnvs(newEnvs);
    };

    const handleAddServer = (envIndex: number) => {
        const newEnvs = [...envs];
        newEnvs[envIndex].servers.push('');
        setEnvs(newEnvs);
    };

    const handleRemoveServer = (envIndex: number, serverIndex: number) => {
        const newEnvs = [...envs];
        newEnvs[envIndex].servers.splice(serverIndex, 1);
        if (newEnvs[envIndex].servers.length === 0) {
            newEnvs[envIndex].servers.push('');
        }
        setEnvs(newEnvs);
    };

    const handleServerChange = (envIndex: number, serverIndex: number, value: string) => {
        const newEnvs = [...envs];
        newEnvs[envIndex].servers[serverIndex] = value;
        setEnvs(newEnvs);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            id: initialData?.id,
            name,
            vastId,
            envs: envs.filter(e => e.enabled).map(e => ({
                name: e.name,
                servers: e.servers
                    .filter(s => s.trim() !== '')
                    .map(hostname => ({
                        hostname,
                        components: []
                    }))
            })),
            action: initialData ? 'edit' : 'add'
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ width: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '3.5rem' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#000', letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
                        {initialData ? 'Update Infrastructure Node' : 'Register Infrastructure Node'}
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 500 }}>
                        Configure high-level metadata and cluster assignments for the remediation cycle.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginBottom: '3rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Application Common Name
                            </label>
                            <input
                                type="text"
                                style={{ width: '100%', padding: '0.875rem 1rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', fontSize: '1rem', fontWeight: 500 }}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Global Middleware Portal"
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                VAST ID
                            </label>
                            <input
                                type="text"
                                style={{ width: '100%', padding: '0.875rem 1rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', fontSize: '1rem', fontWeight: 500 }}
                                value={vastId}
                                onChange={(e) => setVastId(e.target.value)}
                                placeholder="V00XXXXX"
                                required
                            />
                        </div>
                    </div>

                    <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#000', marginBottom: '1.5rem', letterSpacing: '-0.025em' }}>
                        Environment Configuration
                    </h3>

                    {envs.map((env, envIndex) => (
                        <div key={env.name} style={{
                            marginBottom: '1.5rem',
                            padding: '2rem',
                            border: '1px solid #e2e8f0',
                            borderRadius: '16px',
                            background: env.enabled ? '#ffffff' : '#f8fafc',
                            transition: 'all 0.2s'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: env.enabled ? '1.5rem' : 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => handleToggleEnv(envIndex)}>
                                    <div style={{
                                        width: '24px', height: '24px', borderRadius: '6px', border: `2px solid ${env.enabled ? '#000' : '#cbd5e1'}`,
                                        background: env.enabled ? '#000' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {env.enabled && <div style={{ width: '8px', height: '8px', background: '#fff', borderRadius: '2px' }}></div>}
                                    </div>
                                    <span style={{ fontSize: '1.125rem', fontWeight: 800, color: env.enabled ? '#000' : '#94a3b8' }}>
                                        {env.name.toUpperCase()} DATA PLAN
                                    </span>
                                </div>
                                {env.enabled && (
                                    <button
                                        type="button"
                                        onClick={() => handleAddServer(envIndex)}
                                        style={{ background: '#f1f5f9', border: 'none', color: '#000', fontSize: '0.75rem', fontWeight: 800, padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}
                                    >
                                        + ADD ENDPOINT
                                    </button>
                                )}
                            </div>

                            {env.enabled && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                                    {env.servers.map((server, serverIndex) => (
                                        <div key={serverIndex} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                            <input
                                                type="text"
                                                placeholder="Infrastructure Hostname (e.g. vz-cluster-01)"
                                                style={{ flex: 1, padding: '0.875rem 1rem', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#fff', fontSize: '0.9rem', fontWeight: 600 }}
                                                value={server}
                                                onChange={(e) => handleServerChange(envIndex, serverIndex, e.target.value)}
                                                required={env.enabled}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveServer(envIndex, serverIndex)}
                                                style={{ width: '40px', height: '40px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '10px', color: '#ef4444', fontWeight: 900, cursor: 'pointer' }}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'flex-end', marginTop: '3.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '2.5rem' }}>
                        <button type="button" className="btn btn-ghost" style={{ width: '140px', height: '3.5rem' }} onClick={onClose}>
                            DISCARD
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ width: '220px', height: '3.5rem', letterSpacing: '0.05em' }}>
                            {initialData ? 'COMMIT CHANGES' : 'REGISTRY DEPLOYMENT'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AppForm;
