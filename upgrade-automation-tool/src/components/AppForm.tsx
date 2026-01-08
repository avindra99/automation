import React, { useState } from 'react';

interface EnvConfig {
    name: string;
    servers: string[];
}

interface AppFormProps {
    initialData?: { id: string; name: string; vastId: string };
    onSubmit: (data: any) => void;
    onClose: () => void;
}

const AppForm: React.FC<AppFormProps> = ({ initialData, onSubmit, onClose }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [vastId, setVastId] = useState(initialData?.vastId || '');
    const [envs, setEnvs] = useState<EnvConfig[]>([
        { name: 'Dev', servers: [''] },
        { name: 'QA', servers: [''] },
        { name: 'Staging', servers: [''] },
        { name: 'Production', servers: [''] },
    ]);

    const handleAddEnv = () => {
        setEnvs([...envs, { name: '', servers: [''] }]);
    };

    const handleEnvNameChange = (index: number, value: string) => {
        const newEnvs = [...envs];
        newEnvs[index].name = value;
        setEnvs(newEnvs);
    };

    const handleAddServer = (envIndex: number) => {
        const newEnvs = [...envs];
        newEnvs[envIndex].servers.push('');
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
            envs,
            action: initialData ? 'edit' : 'add'
        });
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="card" style={{
                width: '600px',
                maxHeight: '80vh',
                backgroundColor: 'white',
                padding: '2rem',
                overflowY: 'auto'
            }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>
                    {initialData ? 'Edit Application' : 'Upload New Application'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Application Name</label>
                        <input
                            type="text"
                            className="btn btn-ghost"
                            style={{ width: '100%', textAlign: 'left', padding: '0.6rem', color: '#333' }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>VAST ID</label>
                        <input
                            type="text"
                            className="btn btn-ghost"
                            style={{ width: '100%', textAlign: 'left', padding: '0.6rem', color: '#333' }}
                            value={vastId}
                            onChange={(e) => setVastId(e.target.value)}
                            required
                        />
                    </div>

                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Environments & Servers</h3>

                    {envs.map((env, envIndex) => (
                        <div key={envIndex} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #f0f0f0', borderRadius: '8px' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#666', marginBottom: '0.25rem' }}>Environment Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Prod, DR, Lab"
                                    className="btn btn-ghost"
                                    style={{ width: '100%', textAlign: 'left', padding: '0.4rem', color: '#333' }}
                                    value={env.name}
                                    onChange={(e) => handleEnvNameChange(envIndex, e.target.value)}
                                    required
                                />
                            </div>

                            <div style={{ marginLeft: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#666', marginBottom: '0.5rem' }}>Servers</label>
                                {env.servers.map((server, serverIndex) => (
                                    <div key={serverIndex} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <input
                                            type="text"
                                            placeholder="Hostname or IP"
                                            className="btn btn-ghost"
                                            style={{ flex: 1, textAlign: 'left', padding: '0.4rem', color: '#333', fontSize: '0.85rem' }}
                                            value={server}
                                            onChange={(e) => handleServerChange(envIndex, serverIndex, e.target.value)}
                                            required
                                        />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', marginTop: '0.25rem' }}
                                    onClick={() => handleAddServer(envIndex)}
                                >
                                    ➕ Add Server
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        className="btn btn-ghost"
                        style={{ width: '100%', marginBottom: '2rem', border: '1px dashed #ccc' }}
                        onClick={handleAddEnv}
                    >
                        ➕ Add More Environment
                    </button>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">
                            {initialData ? 'Save Changes' : 'Upload Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AppForm;
