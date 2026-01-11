import React from 'react';

interface EnvSelectorProps {
    environments: { id: number, name: string }[];
    selectedEnvNames: string[];
    onToggle: (envName: string) => void;
}

const EnvSelector: React.FC<EnvSelectorProps> = ({ environments, selectedEnvNames, onToggle }) => {
    return (
        <div className="sidebar-section">
            <h3 className="sidebar-title">Select Environments</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {environments.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i).map((env) => {
                    const isActive = selectedEnvNames.includes(env.name);
                    return (
                        <button
                            key={env.id}
                            onClick={() => onToggle(env.name)}
                            className={`btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                            style={{
                                width: '100%',
                                justifyContent: 'flex-start',
                                textAlign: 'left',
                                padding: '0.6rem 1rem',
                                border: isActive ? 'none' : '1px solid #e2e8f0',
                                boxShadow: isActive ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                                fontWeight: isActive ? 600 : 500
                            }}
                        >
                            <span style={{ marginRight: '8px' }}>{isActive ? '●' : '○'}</span>
                            {env.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default EnvSelector;
