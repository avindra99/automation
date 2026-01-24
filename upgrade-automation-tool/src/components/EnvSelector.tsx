"use client";

import React from 'react';

interface EnvSelectorProps {
    environments: { id: number, name: string }[];
    selectedEnvNames: string[];
    onToggle: (envName: string) => void;
}

const EnvSelector: React.FC<EnvSelectorProps> = ({ environments, selectedEnvNames, onToggle }) => {
    // Unique list of environment names
    const uniqueEnvs = environments.filter((v, i, a) => a.findIndex(t => t.name === v.name) === i);

    return (
        <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '1rem',
                borderBottom: '1px solid #f1f5f9',
                paddingBottom: '0.5rem'
            }}>
                Deployment Scopes
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {uniqueEnvs.map((env) => {
                    const isActive = selectedEnvNames.includes(env.name);
                    return (
                        <div
                            key={env.id}
                            onClick={() => onToggle(env.name)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem 1rem',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                background: isActive ? '#f8fafc' : 'transparent',
                                border: `1px solid ${isActive ? '#e2e8f0' : 'transparent'}`,
                                transition: 'all 0.15s ease'
                            }}
                        >
                            <div style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '4px',
                                border: `2px solid ${isActive ? '#000' : '#cbd5e1'}`,
                                background: isActive ? '#000' : 'transparent',
                                position: 'relative',
                                transition: 'all 0.1s ease'
                            }}>
                                {isActive && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '6px',
                                        height: '6px',
                                        background: '#fff',
                                        borderRadius: '1px'
                                    }}></div>
                                )}
                            </div>
                            <span style={{
                                fontSize: '0.875rem',
                                fontWeight: isActive ? 700 : 500,
                                color: isActive ? '#000' : '#64748b'
                            }}>
                                {env.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EnvSelector;
