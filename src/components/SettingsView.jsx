import React, { useState } from 'react';
import { Settings, Save, Building2, ShieldAlert, Sparkles, CheckCircle2, Sliders } from 'lucide-react';

export default function SettingsView({
  systemPrefs,
  setSystemPrefs,
  showToast,
  activeLayoutSet = 'modern-sleek',
  onSelectLayoutSet,
  layoutSets = {}
}) {
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

        {/* Unified Whole-App Layout Design Sets Card */}
        <div className="koha-card" style={{ marginTop: '1.5rem', padding: '1.75rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Sparkles size={20} className="text-primary" />
              Unified Library Design Sets (Whole-App Layout Styles)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Select a spacious, modern sleek layout set. Switching sets transforms the global navigation shell, density, card geometry, catalog display, and dashboard layout harmoniously as an integrated whole.
            </p>
          </div>

          <div className="settings-layout-sets-grid">
            {layoutSets && Object.values(layoutSets).map((set) => {
              const isActive = activeLayoutSet === set.id;
              return (
                <div
                  key={set.id}
                  className={`settings-layout-card ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectLayoutSet && onSelectLayoutSet(set.id)}
                >
                  <div className="settings-layout-card-header">
                    <span className="settings-layout-icon">{set.icon}</span>
                    <div style={{ flex: 1 }}>
                      <h4 className="settings-layout-name">{set.name}</h4>
                      <span className="settings-layout-badge">{set.badge}</span>
                    </div>
                    {isActive && (
                      <span className="settings-layout-active-pill">
                        <CheckCircle2 size={13} /> Active
                      </span>
                    )}
                  </div>
                  <p className="settings-layout-tagline">{set.tagline}</p>
                  <div className="settings-layout-specs">
                    <span className="settings-spec-item">
                      <strong>Shell:</strong> {set.shellLayout === 'top-nav' ? 'Top Navigation' : set.shellLayout === 'compact-rail' ? '68px Rail' : '240px Sidebar'}
                    </span>
                    <span className="settings-spec-item">
                      <strong>Catalog:</strong> {set.catalogLayout.toUpperCase()}
                    </span>
                    <span className="settings-spec-item">
                      <strong>Dashboard:</strong> {set.dashboardLayout === 'launchpad' ? 'Module Hub' : set.dashboardLayout === 'operational' ? 'Circulation Desk' : 'Analytics'}
                    </span>
                    <span className="settings-spec-item">
                      <strong>Density:</strong> Spacious
                    </span>
                  </div>
                  <button
                    type="button"
                    className={`settings-layout-activate-btn ${isActive ? 'is-active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLayoutSet && onSelectLayoutSet(set.id);
                    }}
                  >
                    {isActive ? 'Current Design Set' : 'Activate Design Set'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
}
