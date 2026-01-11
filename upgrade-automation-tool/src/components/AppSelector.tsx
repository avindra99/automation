import React from 'react';
import { Application } from '@/data/mockData';

interface AppSelectorProps {
    applications: Application[];
    selectedAppId: number | null;
    onSelect: (appId: number) => void;
    onEdit: (app: Application) => void;
    onDelete: (appId: number) => void;
}

const AppSelector: React.FC<AppSelectorProps> = ({ applications, selectedAppId, onSelect, onEdit, onDelete }) => {
    return (
        <div className="sidebar-section">
            <h3 className="sidebar-title" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                Application Inventory
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {applications.length === 0 && (
                    <div style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center' }}>
                        No applications found
                    </div>
                )}
                {applications.map((app) => (
                    <div
                        key={app.id}
                        className={`app-item ${selectedAppId === app.id ? 'active' : ''}`}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            backgroundColor: selectedAppId === app.id ? '#f1f5f9' : 'transparent'
                        }}
                        onClick={() => onSelect(app.id)}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: selectedAppId === app.id ? 700 : 500, color: selectedAppId === app.id ? '#1e293b' : '#64748b', fontSize: '0.9rem' }}>
                                {app.name}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>ID: {app.vastId}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(app); }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', opacity: 0.6, color: '#64748b', padding: '2px' }}
                                title="Edit Inventory"
                                className="action-button"
                            >
                                ⚙️
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm(`Are you sure you want to delete ${app.name}?`)) {
                                        onDelete(app.id);
                                    }
                                }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', opacity: 0.6, color: '#ef4444', padding: '2px' }}
                                title="Delete Application"
                                className="action-button"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <style jsx>{`
                .app-item:hover {
                    background-color: #f8fafc;
                }
                .app-item.active {
                    border-left: 4px solid #2563eb;
                }
                .action-button:hover {
                    opacity: 1 !important;
                    transform: scale(1.1);
                }
            `}</style>
        </div>
    );
};

export default AppSelector;
