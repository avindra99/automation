"use client";

import React, { useState, useEffect } from 'react';

interface SoftwareType {
    id: number;
    name: string;
    installPath: string;
    description: string;
}

interface ArtifactFormProps {
    onClose: () => void;
    onUploadSuccess: () => void;
}

const ArtifactForm: React.FC<ArtifactFormProps> = ({ onClose, onUploadSuccess }) => {
    const [softwareTypes, setSoftwareTypes] = useState<SoftwareType[]>([]);
    const [selectedTypeId, setSelectedTypeId] = useState<string>('');
    const [version, setVersion] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    // New Software Type State
    const [showNewTypeForm, setShowNewTypeForm] = useState(false);
    const [newTypeName, setNewTypeName] = useState('');
    const [newTypePath, setNewTypePath] = useState('');

    useEffect(() => {
        fetchSoftwareTypes();
    }, []);

    const fetchSoftwareTypes = async () => {
        try {
            const res = await fetch('http://localhost:8081/api/software-types');
            const data = await res.json();
            setSoftwareTypes(data);
            if (data.length > 0) setSelectedTypeId(data[0].id.toString());
        } catch (err) {
            console.error("Failed to fetch types", err);
        }
    };

    const handleCreateType = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8081/api/software-types', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newTypeName, installPath: newTypePath }),
            });
            const newType = await res.json();
            setSoftwareTypes([...softwareTypes, newType]);
            setSelectedTypeId(newType.id.toString());
            setShowNewTypeForm(false);
            setNewTypeName('');
            setNewTypePath('');
        } catch (err) {
            console.error("Failed to create type", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !selectedTypeId) return;

        setUploading(true);
        const selectedType = softwareTypes.find(t => t.id.toString() === selectedTypeId);

        const formData = new FormData();
        formData.append('name', selectedType?.name || '');
        formData.append('version', version);
        formData.append('type', selectedType?.name || '');
        formData.append('file', file);

        try {
            await fetch('http://localhost:8081/api/artifacts/upload', {
                method: 'POST',
                body: formData,
            });
            onUploadSuccess();
            onClose();
        } catch (error) {
            console.error('Upload failed', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ padding: '3rem', width: '100%', maxWidth: '580px', position: 'relative' }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '1.5rem', right: '1.5rem',
                        background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '50%',
                        width: '36px', height: '36px', cursor: 'pointer', color: '#64748b',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem'
                    }}
                >
                    &times;
                </button>

                <div style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#000', letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
                        Enterprise Software Hub
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 500 }}>
                        Deploy validated middleware binaries to the local Verizon automation cluster.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Software Category
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowNewTypeForm(true)}
                                style={{
                                    background: 'none', border: 'none', color: '#2563eb',
                                    fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', padding: 0
                                }}
                            >
                                + ADD NEW CATEGORY
                            </button>
                        </div>
                        <select
                            value={selectedTypeId}
                            onChange={(e) => setSelectedTypeId(e.target.value)}
                            style={{
                                width: '100%', padding: '0.875rem 1rem', border: '1px solid #e2e8f0',
                                borderRadius: '12px', outline: 'none', transition: 'all 0.2s',
                                background: '#f8fafc', fontSize: '0.95rem', fontWeight: 500
                            }}
                        >
                            {softwareTypes.map(t => (
                                <option key={t.id} value={t.id}>{t.name.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.625rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Release Version
                        </label>
                        <input
                            type="text"
                            value={version}
                            onChange={(e) => setVersion(e.target.value)}
                            placeholder="e.g. 17.0.9"
                            style={{
                                width: '100%', padding: '0.875rem 1rem', border: '1px solid #e2e8f0',
                                borderRadius: '12px', outline: 'none', background: '#f8fafc',
                                fontSize: '0.95rem', fontWeight: 500
                            }}
                            required
                        />
                    </div>

                    <div style={{
                        marginBottom: '2.5rem', padding: '3rem 2rem', border: '2px dashed #cbd5e1',
                        borderRadius: '20px', textAlign: 'center', background: '#ffffff',
                        cursor: 'pointer', transition: 'all 0.2s ease'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#000'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                        onClick={() => document.getElementById('fileInput')?.click()}>

                        <div style={{
                            width: '48px', height: '48px', background: '#f1f5f9', borderRadius: '12px',
                            margin: '0 auto 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <div style={{ width: '20px', height: '20px', border: '2px solid #64748b', borderRadius: '3px' }}></div>
                        </div>

                        {file ? (
                            <div>
                                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>{file.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, marginTop: '0.5rem', textTransform: 'uppercase' }}>
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB • READY FOR DEPLOYMENT
                                </div>
                            </div>
                        ) : (
                            <>
                                <div style={{ fontWeight: 800, color: '#334155', fontSize: '1rem' }}>Select Software Binary</div>
                                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem', fontWeight: 500 }}>
                                    TAR.GZ, ZIP, or EXE accepted
                                </div>
                            </>
                        )}
                        <input
                            id="fileInput"
                            type="file"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            style={{ display: 'none' }}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" className="btn btn-ghost" style={{ flex: 1, height: '3.5rem' }} onClick={onClose}>
                            CANCEL
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 2, height: '3.5rem', letterSpacing: '0.05em' }} disabled={uploading}>
                            {uploading ? 'UPLOADING...' : 'DEPLOY TO SERVER'}
                        </button>
                    </div>
                </form>

                {showNewTypeForm && (
                    <div className="modal-overlay" style={{ background: 'rgba(15, 23, 42, 0.4)' }}>
                        <div className="modal-content" style={{ padding: '2.5rem', width: '420px' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.025em' }}>
                                Register New Category
                            </h3>
                            <form onSubmit={handleCreateType}>
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                        Software Name
                                    </label>
                                    <input
                                        value={newTypeName}
                                        onChange={(e) => setNewTypeName(e.target.value)}
                                        placeholder="e.g. NGINX"
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#f8fafc', outline: 'none' }}
                                        required
                                    />
                                </div>
                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                        Target Install Path
                                    </label>
                                    <input
                                        value={newTypePath}
                                        onChange={(e) => setNewTypePath(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '10px', background: '#f8fafc', outline: 'none' }}
                                        placeholder="/apps/opt/mw/..."
                                        required
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowNewTypeForm(false)}>
                                        CANCEL
                                    </button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                        SAVE
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArtifactForm;
