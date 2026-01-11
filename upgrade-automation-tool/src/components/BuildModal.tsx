import React, { useState, useEffect } from 'react';

interface Artifact {
    id: number;
    name: string;
    version: string;
    type: string;
    filename: string;
}

interface BuildModalProps {
    serverId: number | string;
    componentName: string;
    onClose: () => void;
    onExecute: (version: string, artifactId: number) => Promise<void>;
}

const BuildModal: React.FC<BuildModalProps> = ({ serverId, componentName, onClose, onExecute }) => {
    const [artifacts, setArtifacts] = useState<Artifact[]>([]);
    const [selectedArtifactId, setSelectedArtifactId] = useState<number | null>(null);
    const [executing, setExecuting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtifacts = async () => {
            try {
                const res = await fetch('http://localhost:8081/api/artifacts');
                const data = await res.json();
                // Filter artifacts by component type if needed, but for now show all related
                const filtered = data.filter((a: Artifact) =>
                    a.type.toLowerCase() === componentName.toLowerCase() ||
                    a.name.toLowerCase() === componentName.toLowerCase()
                );
                setArtifacts(filtered);
                if (filtered.length > 0) {
                    setSelectedArtifactId(filtered[0].id);
                }
            } catch (err) {
                console.error("Failed to fetch artifacts", err);
            } finally {
                setLoading(false);
            }
        };
        fetchArtifacts();
    }, [componentName]);

    const handleExecute = async () => {
        if (!selectedArtifactId) return;
        const selected = artifacts.find(a => a.id === selectedArtifactId);
        if (!selected) return;

        setExecuting(true);
        try {
            await onExecute(selected.version, selected.id);
            onClose();
        } catch (err) {
            console.error("Execution failed", err);
        } finally {
            setExecuting(false);
        }
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1100, backdropFilter: 'blur(4px)'
        }}>
            <div className="card" style={{
                width: '500px',
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a202c' }}>Configure Build Task</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#a0aec0' }}>&times;</button>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4a5568', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Target System / Component</div>
                    <div style={{ padding: '0.75rem', background: '#f7fafc', borderRadius: '8px', border: '1px solid #edf2f7', color: '#2d3748', fontSize: '1rem', fontWeight: 600 }}>
                        {componentName} on Server {serverId}
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#4a5568', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Select Artifact from Artifactory</label>
                    {loading ? (
                        <div style={{ padding: '1rem', textAlign: 'center', color: '#718096' }}>Loading artifacts...</div>
                    ) : artifacts.length > 0 ? (
                        <select
                            value={selectedArtifactId || ''}
                            onChange={(e) => setSelectedArtifactId(Number(e.target.value))}
                            style={{
                                width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0',
                                borderRadius: '8px', outline: 'none', fontSize: '1rem'
                            }}
                        >
                            {artifacts.map(a => (
                                <option key={a.id} value={a.id}>Version {a.version} - {a.filename}</option>
                            ))}
                        </select>
                    ) : (
                        <div style={{ padding: '1rem', background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: '8px', color: '#c53030', fontSize: '0.9rem' }}>
                            No compatible artifacts found in Artifactory. Please upload an artifact for "{componentName}" first.
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '2px solid #edf2f7', paddingTop: '1.5rem' }}>
                    <button type="button" className="btn btn-ghost" onClick={onClose} disabled={executing}>Cancel</button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleExecute}
                        disabled={executing || !selectedArtifactId}
                        style={{ padding: '0.75rem 2rem', fontWeight: 700, borderRadius: '8px', background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', border: 'none' }}
                    >
                        {executing ? 'Executing Ansible...' : 'Execute Build'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BuildModal;
