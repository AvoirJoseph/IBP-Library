import React, { useState } from 'react';
import { Settings, Save, Building2, ShieldAlert, Sliders } from 'lucide-react';

export default function SettingsView({ systemPrefs, setSystemPrefs, showToast }) {
  const [prefs, setPrefs] = useState({ ...systemPrefs });

  const handleSave = (e) => {
    e.preventDefault();
    setSystemPrefs(prefs);
    showToast('Koha System Preferences updated successfully!', 'success');
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Settings size={28} className="text-primary" />
            Koha System Administration
          </h1>
          <p className="page-subtitle">
            Configure circulation rules, loan durations, library branches, and global preferences
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={16} /> Save System Preferences
        </button>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Circulation Policy Rules */}
          <div className="koha-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sliders size={18} className="text-primary" />
              Circulation Policy Rules
            </h3>

            <div className="form-group">
              <label className="form-label">Library System Identification Name</label>
              <input
                type="text"
                className="form-input"
                value={prefs.libraryName}
                onChange={(e) => setPrefs({ ...prefs, libraryName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Default Loan Duration (Days)</label>
              <input
                type="number"
                className="form-input"
                value={prefs.loanDurationDays}
                onChange={(e) => setPrefs({ ...prefs, loanDurationDays: Number(e.target.value) })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Student Max Loan Limit</label>
                <input
                  type="number"
                  className="form-input"
                  value={prefs.maxLoansStudent}
                  onChange={(e) => setPrefs({ ...prefs, maxLoansStudent: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Faculty Max Loan Limit</label>
                <input
                  type="number"
                  className="form-input"
                  value={prefs.maxLoansFaculty}
                  onChange={(e) => setPrefs({ ...prefs, maxLoansFaculty: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* Library Branches Config */}
          <div className="koha-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={18} style={{ color: 'var(--accent-teal)' }} />
              Active Library Branches
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {prefs.branches.map((b, idx) => (
                <div
                  key={b.code}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div>
                    <span className="mono-text" style={{ fontWeight: 700 }}>{b.code}</span>
                    <div style={{ fontWeight: 600, marginTop: '0.1rem' }}>{b.name}</div>
                  </div>
                  <span className="badge badge-available">Active Branch</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
