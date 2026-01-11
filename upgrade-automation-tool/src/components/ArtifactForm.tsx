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
        <div className="modal-overlay" style={{
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div className="artifact-modal" style={{
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '2.5rem',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '600px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                position: 'relative',
                animation: 'modalSlideIn 0.3s ease-out'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: '1.5rem', right: '1.5rem',
                    background: '#f1f5f9', border: 'none', borderRadius: '50%',
                    width: '32px', height: '32px', cursor: 'pointer', color: '#64748b'
                }}>&times;</button>

                <h2 style={{
                    fontSize: '1.75rem', fontWeight: 800, color: '#1e293b',
                    marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem'
                }}>
                    <span style={{ fontSize: '2rem' }}></span> Artifact Upload
                </h2>
                <p style={{ color: '#64748b', marginBottom: '2rem' }}>Deploy new software versions to the enterprise repository</p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={{ fontWeight: 600, color: '#334155' }}>Software Classification</label>
                            <button type="button" onClick={() => setShowNewTypeForm(true)} style={{
                                background: 'none', border: 'none', color: '#3b82f6',
                                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
                            }}>+ New Type</button>
                        </div>
                        <select
                            value={selectedTypeId}
                            onChange={(e) => setSelectedTypeId(e.target.value)}
                            style={{
                                width: '100%', padding: '0.8rem 1rem', border: '2px solid #e2e8f0',
                                borderRadius: '12px', outline: 'none', transition: 'border-color 0.2s'
                            }}
                        >
                            {softwareTypes.map(t => (
                                <option key={t.id} value={t.id}>{t.name} (Target: {t.installPath})</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#334155' }}>Release Version</label>
                        <input
                            type="text"
                            value={version}
                            onChange={(e) => setVersion(e.target.value)}
                            placeholder="e.g. 11.0.21, 3.4.1"
                            style={{
                                width: '100%', padding: '0.8rem 1rem', border: '2px solid #e2e8f0',
                                borderRadius: '12px', outline: 'none'
                            }}
                            required
                        />
                    </div>

                    <div style={{
                        marginBottom: '2rem', padding: '2rem', border: '2px dashed #cbd5e0',
                        borderRadius: '16px', textAlign: 'center', background: '#f8fafc',
                        cursor: 'pointer'
                    }} onClick={() => document.getElementById('fileInput')?.click()}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📂</div>
                        <div style={{ fontWeight: 600, color: '#475569' }}>{file ? file.name : "Select Software Binary"}</div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>Drag and drop or click to browse</div>
                        <input
                            id="fileInput"
                            type="file"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            style={{ display: 'none' }}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" className="btn btn-ghost" style={{ flex: 1, padding: '0.8rem' }} onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" style={{
                            flex: 2, padding: '0.8rem', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                            border: 'none', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)', fontWeight: 700
                        }} disabled={uploading}>
                            {uploading ? 'Processing Deployment...' : 'Deploy to Artifactory'}
                        </button>
                    </div>
                </form>

                {showNewTypeForm && (
                    <div className="modal-overlay" style={{ backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001 }}>
                        <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ marginTop: 0 }}>Register New Software Type</h3>
                            <form onSubmit={handleCreateType}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Name (e.g. ANSIBLE)</label>
                                    <input value={newTypeName} onChange={(e) => setNewTypeName(e.target.value)} style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} required />
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Base Install Path</label>
                                    <input value={newTypePath} onChange={(e) => setNewTypePath(e.target.value)} style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} placeholder="/opt/verizon/..." required />
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowNewTypeForm(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Type</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            <style jsx>{`
                @keyframes modalSlideIn {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default ArtifactForm;
