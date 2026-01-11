import React, { useEffect, useState } from 'react';

interface HistoryModalProps {
    onClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ onClose }) => {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8081/api/history')
            .then(res => res.json())
            .then(data => {
                setHistory(data);
                setLoading(false);
            });
    }, []);

    return (
        <div className="modal-overlay" style={{
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div className="history-modal" style={{
                background: 'rgba(255, 255, 255, 0.98)',
                padding: '2.5rem',
                borderRadius: '24px',
                width: '95%',
                maxWidth: '1100px',
                maxHeight: '90vh',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                animation: 'modalSlideIn 0.3s ease-out'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: '1.5rem', right: '1.5rem',
                    background: '#f1f5f9', border: 'none', borderRadius: '50%',
                    width: '32px', height: '32px', cursor: 'pointer', color: '#64748b',
                    fontSize: '1.2rem'
                }}>&times;</button>

                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{
                        fontSize: '1.75rem', fontWeight: 800, color: '#1e293b',
                        margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem'
                    }}>
                        <span style={{ background: '#e0f2fe', padding: '0.5rem', borderRadius: '12px' }}>📊</span>
                        Enterprise Audit Trail
                    </h2>
                    <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Immutable record of all software migrations and deployment builds</p>
                </div>

                <div style={{
                    flex: 1, overflowY: 'auto', borderRadius: '16px',
                    border: '1px solid #e2e8f0', background: '#ffffff'
                }}>
                    {loading ? (
                        <div style={{ padding: '3rem', textAlign: 'center' }}>
                            <div className="spinner"></div>
                            <p style={{ color: '#64748b', marginTop: '1rem' }}>Sequencing audit data...</p>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 10 }}>
                                <tr>
                                    <th style={headerStyle}>Timestamp</th>
                                    <th style={headerStyle}>Target Host</th>
                                    <th style={headerStyle}>Software</th>
                                    <th style={headerStyle}>Migration path</th>
                                    <th style={headerStyle}>Status</th>
                                    <th style={headerStyle}>Operator</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
                                            No automated builds recorded in the current lifecycle.
                                        </td>
                                    </tr>
                                ) : (
                                    history.map((log) => (
                                        <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ ...cellStyle, color: '#64748b', fontSize: '0.8rem' }}>
                                                {new Date(log.timestamp).toLocaleString(undefined, {
                                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </td>
                                            <td style={{ ...cellStyle, fontWeight: 700, color: '#334155' }}>{log.hostname}</td>
                                            <td style={cellStyle}>
                                                <span style={{ background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                                                    {log.softwareName}
                                                </span>
                                            </td>
                                            <td style={cellStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span style={{ color: '#94a3b8' }}>{log.fromVersion}</span>
                                                    <span style={{ color: '#3b82f6' }}>→</span>
                                                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{log.toVersion}</span>
                                                </div>
                                            </td>
                                            <td style={cellStyle}>
                                                <span className={`badge ${log.status === 'SUCCESS' ? 'status-uptodate' : 'status-vulnerable'}`} style={{
                                                    borderRadius: '20px', padding: '0.25rem 0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em'
                                                }}>
                                                    {log.status === 'SUCCESS' ? '● Completed' : '○ Failed'}
                                                </span>
                                            </td>
                                            <td style={cellStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div style={{ width: '24px', height: '24px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>👤</div>
                                                    {log.triggeredBy}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn btn-primary" style={{ padding: '0.75rem 2rem', borderRadius: '12px' }} onClick={onClose}>Close Registry</button>
                </div>
            </div>
            <style jsx>{`
                @keyframes modalSlideIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #3b82f6;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

const headerStyle: React.CSSProperties = {
    padding: '1rem 1.5rem',
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: 800,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const cellStyle: React.CSSProperties = {
    padding: '1.25rem 1.5rem',
    fontSize: '0.9rem'
};

export default HistoryModal;
