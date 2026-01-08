import React from 'react';
import { Application } from '@/data/mockData';

interface AppSelectorProps {
    applications: Application[];
    selectedAppId: string | null;
    onSelect: (appId: string) => void;
    onEdit: (app: Application) => void;
}

const APP_ICONS: Record<string, string> = {
    "vzweb": "🌐",
    "corpweb": "🏢",
    "privacy-policy": "📄",
    "inside-verizon": "🏠",
    "about-you": "👤",
    "about-you-todos": "✅",
    "profile-pantry": "🍱",
    "profile-picture": "🖼️",
    "orgtree": "🌳",
    "one-profile": "🆔",
};

const AppSelector: React.FC<AppSelectorProps> = ({ applications, selectedAppId, onSelect, onEdit }) => {
    return (
        <div className="sidebar-section">
            <h3 className="sidebar-title">Select Application</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {applications.map((app) => (
                    <div
                        key={app.id}
                        className={`app-item ${selectedAppId === app.id ? 'active' : ''}`}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        onClick={() => onSelect(app.id)}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '10px' }}>{APP_ICONS[app.id] || "📦"}</span>
                            {app.name}
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(app); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', opacity: 0.6 }}
                            title="Edit Application"
                        >
                            📝
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AppSelector;
