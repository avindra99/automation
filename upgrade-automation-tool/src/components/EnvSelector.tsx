import React from 'react';

interface EnvSelectorProps {
    environments: { id: string, name: string }[];
    selectedEnvIds: string[];
    onToggle: (envId: string) => void;
}

const EnvSelector: React.FC<EnvSelectorProps> = ({ environments, selectedEnvIds, onToggle }) => {
    return (
        <div className="sidebar-section">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4a5568' }}>Filter: </span>
                <select style={{ marginLeft: '10px', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '2px 5px', fontSize: '0.85rem' }}>
                    <option>Environment</option>
                </select>
            </div>
            <ul className="filter-list">
                {environments.map((env) => (
                    <li key={env.id} className="filter-item" onClick={() => onToggle(env.id)}>
                        <input
                            type="checkbox"
                            checked={selectedEnvIds.includes(env.id)}
                            onChange={() => { }} // Controlled by li click
                        />
                        {env.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EnvSelector;
