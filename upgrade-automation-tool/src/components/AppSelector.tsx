"use client";

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
        <div style={{ marginBottom: '2rem' }}>
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
                Application Registry
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {applications.length === 0 && (
                    <div style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center' }}>
                        No records identified
                    </div>
                )}
                {applications.map((app) => (
                    <div
                        key={app.id}
                        className={selectedAppId === app.id ? 'active' : ''}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            background: selectedAppId === app.id ? '#000000' : 'transparent',
                            color: selectedAppId === app.id ? '#ffffff' : '#64748b'
                        }}
                        onClick={() => onSelect(app.id)}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                                {app.name}
                            </span>
                            <span style={{ fontSize: '0.65rem', opacity: 0.7, fontWeight: 600 }}>ID: {app.vastId}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(app); }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                    color: selectedAppId === app.id ? '#fff' : '#64748b',
                                    padding: '4px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.025em'
                                }}
                            >
                                EDIT
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm(`Confirm deletion of ${app.name} from registry?`)) {
                                        onDelete(app.id);
                                    }
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                    color: selectedAppId === app.id ? 'rgba(255,255,255,0.6)' : '#ef4444',
                                    padding: '4px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.025em'
                                }}
                            >
                                DELETE
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AppSelector;
