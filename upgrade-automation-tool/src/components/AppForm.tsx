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

    // Initialize with Non-Prod and Prod fixed
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
                        components: [] // Backend will add default if empty
                    }))
            })),
            action: initialData ? 'edit' : 'add'
        });
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
            <div className="card" style={{
                width: '750px',
                maxHeight: '90vh',
                backgroundColor: 'white',
                padding: '2.5rem',
                overflowY: 'auto',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
                <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 800, color: '#1a202c', borderBottom: '2px solid #edf2f7', paddingBottom: '1rem' }}>
                    {initialData ? 'Update Enterprise Application' : 'Register New Application'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#4a5568', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Application Name</label>
                            <input
                                type="text"
                                className="btn btn-ghost"
                                style={{ width: '100%', textAlign: 'left', padding: '0.75rem', color: '#2d3748', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. My Global App"
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#4a5568', marginBottom: '0.5rem', textTransform: 'uppercase' }}>VAST ID (Enterprise Identifier)</label>
                            <input
                                type="text"
                                className="btn btn-ghost"
                                style={{ width: '100%', textAlign: 'left', padding: '0.75rem', color: '#2d3748', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                                value={vastId}
                                onChange={(e) => setVastId(e.target.value)}
                                placeholder="e.g. V00123"
                                required
                            />
                        </div>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: '#2d3748' }}>Environment Setup</h3>

                    {envs.map((env, envIndex) => (
                        <div key={env.name} style={{
                            marginBottom: '2rem',
                            padding: '1.5rem',
                            border: env.enabled ? '2px solid #ebf4ff' : '1px solid #edf2f7',
                            borderRadius: '12px',
                            backgroundColor: env.enabled ? '#f7fafc' : '#ffffff'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <input
                                        type="checkbox"
                                        checked={env.enabled}
                                        onChange={() => handleToggleEnv(envIndex)}
                                        style={{ width: '1.2rem', height: '1.2rem' }}
                                    />
                                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: env.enabled ? '#2b6cb0' : '#a0aec0' }}>{env.name}</span>
                                </div>
                                {env.enabled && (
                                    <button
                                        type="button"
                                        className="btn btn-ghost"
                                        style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', backgroundColor: '#edf2f7', color: '#4a5568' }}
                                        onClick={() => handleAddServer(envIndex)}
                                    >
                                        + Add Server
                                    </button>
                                )}
                            </div>

                            {env.enabled && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {env.servers.map((server, serverIndex) => (
                                        <div key={serverIndex} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                            <div style={{ flex: 1 }}>
                                                <input
                                                    type="text"
                                                    placeholder="Server Hostname (e.g. vz-web-01)"
                                                    className="btn btn-ghost"
                                                    style={{ width: '100%', textAlign: 'left', padding: '0.75rem', color: '#2d3748', border: '1px solid #cbd5e0', borderRadius: '6px', backgroundColor: 'white' }}
                                                    value={server}
                                                    onChange={(e) => handleServerChange(envIndex, serverIndex, e.target.value)}
                                                    required={env.enabled}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveServer(envIndex, serverIndex)}
                                                style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #fee2e2',
                                                    backgroundColor: '#fef2f2',
                                                    color: '#ef4444',
                                                    fontSize: '1.25rem',
                                                    fontWeight: 800,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.2s'
                                                }}
                                                title="Remove Server"
                                            >
                                                -
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2.5rem', borderTop: '2px solid #edf2f7', paddingTop: '1.5rem' }}>
                        <button type="button" className="btn btn-ghost" style={{ fontWeight: 600 }} onClick={onClose}>Discard</button>
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontWeight: 700, borderRadius: '8px' }}>
                            {initialData ? 'Apply Updates' : 'Register Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AppForm;
