import React from 'react';
import { Newspaper, BookOpen, PlusCircle, CheckCircle2, Layers } from 'lucide-react';

export default function SerialsView({ showToast }) {
  const serials = [
    { id: 'SER-101', title: 'Nature - Weekly International Journal', issn: '0028-0836', vendor: 'Springer Nature', status: 'Active Subscription', issuesReceived: 52, frequency: 'Weekly' },
    { id: 'SER-102', title: 'IEEE Spectrum Engineering', issn: '0018-9235', vendor: 'IEEE Press', status: 'Active Subscription', issuesReceived: 12, frequency: 'Monthly' },
    { id: 'SER-103', title: 'ACM Computing Surveys', issn: '0360-0300', vendor: 'ACM Digital', status: 'Renewal Pending', issuesReceived: 4, frequency: 'Quarterly' }
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Newspaper size={28} className="text-primary" />
            Koha Serials & Acquisitions
          </h1>
          <p className="page-subtitle">
            Manage serial subscriptions, journal holdings, issue arrivals, and periodical catalogs
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => showToast('Opened Subscription Wizard', 'info')}>
          <PlusCircle size={16} />
          New Subscription Order
        </button>
      </div>

      {/* Periodicals Summary Grid */}
      <div className="stats-grid">
        <div className="stat-card" style={{ '--stat-color': 'var(--primary)' }}>
          <div>
            <div className="stat-label">Active Periodicals</div>
            <div className="stat-value">3 Titles</div>
          </div>
          <div className="stat-icon">
            <Newspaper size={22} />
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': 'var(--success)' }}>
          <div>
            <div className="stat-label">Issues Received</div>
            <div className="stat-value">68 Issues</div>
          </div>
          <div className="stat-icon">
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': 'var(--warning)' }}>
          <div>
            <div className="stat-label">Active Serials</div>
            <div className="stat-value">3 Subscriptions</div>
          </div>
          <div className="stat-icon">
            <Newspaper size={22} />
          </div>
        </div>
      </div>

      {/* Serials Subscriptions Table */}
      <div className="koha-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          Active Journal & Periodical Subscriptions
        </h3>
        <div className="table-wrapper">
          <table className="koha-table">
            <thead>
              <tr>
                <th>Subscription ID</th>
                <th>Title Statement</th>
                <th>ISSN</th>
                <th>Vendor / Publisher</th>
                <th>Frequency</th>
                <th>Received Issues</th>
                <th>Status</th>
                <th>Claim Issue</th>
              </tr>
            </thead>
            <tbody>
              {serials.map((s) => (
                <tr key={s.id}>
                  <td><span className="mono-text">{s.id}</span></td>
                  <td style={{ fontWeight: 700 }}>{s.title}</td>
                  <td><span className="mono-text">{s.issn}</span></td>
                  <td>{s.vendor}</td>
                  <td>{s.frequency}</td>
                  <td><strong>{s.issuesReceived}</strong> issues</td>
                  <td>
                    <span className={`badge ${s.status.includes('Active') ? 'badge-available' : 'badge-loaned'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => showToast(`Claimed issue check-in for ${s.title}`, 'success')}
                    >
                      <CheckCircle2 size={14} /> Receive Issue
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
