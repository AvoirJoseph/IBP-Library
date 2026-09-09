import React from 'react';
import {
  Repeat,
  Users,
  Search,
  BookOpen,
  FileCode,
  Newspaper,
  BarChart3,
  Wrench,
  Settings,
  Info,
  Clock,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  Calendar
} from 'lucide-react';

export default function DashboardView({
  books = [],
  patrons = [],
  transactions = [],
  onNavigateModule,
  onOpenCheckIn,
  onOpenAddBook,
  onSelectBook,
  onCheckInItem,
  selectedBranch,
  systemPrefs = {}
}) {
  const totalTitles = books?.length || 0;
  const activeLoansList = (transactions || []).filter(
    (t) => t.status === 'Issued' || t.status === 'Overdue'
  );
  const activeLoansCount = activeLoansList.length;
  const overdueCount = (transactions || []).filter((t) => t.status === 'Overdue').length;
  const totalPatronsCount = patrons?.length || 0;
  const totalAvailableCopies = (books || []).reduce((acc, b) => acc + (Number(b.availableCopies) || 0), 0);
  const loanPeriodDays = systemPrefs?.loanDurationDays ?? systemPrefs?.loanPeriodDays ?? 14;

  // Today's formatted date
  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Authentic Koha Staff Launchpad Modules
  const kohaModules = [
    {
      id: 'circulation',
      title: 'Circulation',
      icon: Repeat,
      color: '#0284c7',
      links: [
        { label: 'Check out', action: () => onNavigateModule('circulation', 'checkout') },
        { label: 'Check in', action: () => onNavigateModule('circulation', 'checkin') },
        { label: 'Holds queue', action: () => onNavigateModule('circulation', 'holds') },
        { label: 'Overdue loans queue', action: () => onNavigateModule('circulation', 'checkout') }
      ]
    },
    {
      id: 'patrons',
      title: 'Patrons',
      icon: Users,
      color: '#059669',
      links: [
        { label: 'Search patrons', action: () => onNavigateModule('patrons') },
        { label: 'Register new patron', action: () => onOpenAddPatron() },
        { label: 'Print patron cards', action: () => onNavigateModule('patrons') }
      ]
    },
    {
      id: 'catalog',
      title: 'Advanced Search / Catalog',
      icon: Search,
      color: '#0891b2',
      links: [
        { label: 'Search catalog (OPAC)', action: () => onNavigateModule('catalog') },
        { label: 'Item barcode search', action: () => onNavigateModule('catalog') },
        { label: '+ Add new MARC record', action: () => onOpenAddBook() }
      ]
    },
    {
      id: 'marc',
      title: 'Authorities & MARC21',
      icon: FileCode,
      color: '#7c3aed',
      links: [
        { label: 'MARC21 bibliographic editor', action: () => onNavigateModule('marc') },
        { label: 'Manage standard tags (020, 100, 245)', action: () => onNavigateModule('marc') },
        { label: 'Export ISO 2709 JSON', action: () => onNavigateModule('marc') }
      ]
    },
    {
      id: 'serials',
      title: 'Serials & Acquisitions',
      icon: Newspaper,
      color: '#d97706',
      links: [
        { label: 'Periodical subscriptions', action: () => onNavigateModule('serials') },
        { label: 'Receive serial issues', action: () => onNavigateModule('serials') },
        { label: 'Library budgets & orders', action: () => onNavigateModule('serials') }
      ]
    },
    {
      id: 'reports',
      title: 'Reports & SQL Analytics',
      icon: BarChart3,
      color: '#4f46e5',
      links: [
        { label: 'Guided reports wizard', action: () => onNavigateModule('reports') },
        { label: 'Saved SQL query runner', action: () => onNavigateModule('reports') },
        { label: 'Circulation statistics & exports', action: () => onNavigateModule('reports') }
      ]
    },
    {
      id: 'settings',
      title: 'Koha Administration',
      icon: Settings,
      color: '#475569',
      links: [
        { label: 'System preferences', action: () => onNavigateModule('settings') },
        { label: 'Circulation & loan rules', action: () => onNavigateModule('settings') },
        { label: 'Manage library branches', action: () => onNavigateModule('settings') }
      ]
    },
    {
      id: 'tools',
      title: 'Tools & Utilities',
      icon: Wrench,
      color: '#db2777',
      links: [
        { label: 'Patron card generator', action: () => onNavigateModule('patrons') },
        { label: 'Batch bibliographic export', action: () => onNavigateModule('marc') },
        { label: 'Check in fast-return barcode', action: () => onOpenCheckIn() }
      ]
    },
    {
      id: 'about',
      title: 'About Koha',
      icon: Info,
      color: '#0d9488',
      links: [
        { label: 'Koha version 24.05.00', action: () => onNavigateModule('settings') },
        { label: 'Server diagnostics: Operational', action: () => onNavigateModule('settings') },
        { label: 'Documentation & community', action: () => window.open('https://koha-community.org', '_blank') }
      ]
    }
  ];

  return (
    <div className="koha-staff-home">
      {/* Koha Welcome & Staff News Board */}
      <div className="koha-home-top-grid">
        {/* Welcome Greeting Banner */}
        <div className="koha-welcome-banner">
          <div className="koha-welcome-header">
            <div>
              <h1 className="koha-welcome-title">Koha Staff Client</h1>
              <p className="koha-welcome-subtitle">
                Logged in at: <strong>{selectedBranch}</strong> • {todayStr}
              </p>
            </div>
            <div className="koha-welcome-actions">
              <button
                className="koha-btn-primary"
                onClick={() => onNavigateModule('circulation', 'checkout')}
              >
                <Repeat size={15} />
                <span>Check out</span>
              </button>
              <button
                className="koha-btn-secondary"
                onClick={() => onNavigateModule('circulation', 'checkin')}
              >
                <CheckCircle2 size={15} />
                <span>Check in</span>
              </button>
              <button className="koha-btn-secondary" onClick={onOpenAddBook}>
                <PlusCircle size={15} />
                <span>Add Record</span>
              </button>
            </div>
          </div>
        </div>

        {/* Koha News & Operational Notice Widget */}
        <div className="koha-news-card">
          <div className="koha-news-heading">
            <Calendar size={15} />
            <span>Koha Library News & Notices</span>
          </div>
          <div className="koha-news-body">
            <div className="koha-news-alert">
              <strong>Branch Operations:</strong> Full circulation active for {selectedBranch}. Default loan period: {loanPeriodDays} days.
            </div>
            <div className="koha-news-footer">
              <span>Shift: Main Desk • Superuser Staff</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Operational Counters Strip */}
      <div className="koha-stat-ribbon">
        <div
          className="koha-stat-tile"
          onClick={() => onNavigateModule('catalog')}
          title="Click to view Catalog"
        >
          <div className="koha-stat-number">{totalTitles}</div>
          <div className="koha-stat-label">Catalog Titles</div>
        </div>

        <div
          className="koha-stat-tile"
          onClick={() => onNavigateModule('circulation', 'checkout')}
          title="Click to view Active Loans"
        >
          <div className="koha-stat-number stat-highlight-blue">{activeLoansCount}</div>
          <div className="koha-stat-label">Active Loans</div>
        </div>

        <div
          className="koha-stat-tile"
          onClick={() => onNavigateModule('circulation', 'checkout')}
          title="Click to view Overdue Items"
        >
          <div className="koha-stat-number stat-highlight-red">{overdueCount}</div>
          <div className="koha-stat-label">Overdue Loans</div>
        </div>

        <div
          className="koha-stat-tile"
          onClick={() => onNavigateModule('patrons')}
          title="Click to view Patrons"
        >
          <div className="koha-stat-number stat-highlight-green">{totalPatronsCount}</div>
          <div className="koha-stat-label">Patrons</div>
        </div>

        <div
          className="koha-stat-tile"
          onClick={() => onNavigateModule('catalog')}
          title="Click to view Available Catalog Items"
        >
          <div className="koha-stat-number stat-highlight-amber">
            {totalAvailableCopies}
          </div>
          <div className="koha-stat-label">Available Items</div>
        </div>
      </div>

      {/* Iconic Koha Staff Module Launchpad Grid */}
      <div className="koha-launchpad-section">
        <div className="koha-section-header">
          <h2 className="koha-section-title">Koha Main Modules</h2>
          <span className="koha-section-meta">Select a module or workflow link below</span>
        </div>

        <div className="koha-module-grid">
          {kohaModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div key={mod.id} className="koha-module-card">
                <div className="koha-module-card-header">
                  <div
                    className="koha-module-icon-box"
                    style={{ backgroundColor: `${mod.color}18`, color: mod.color }}
                  >
                    <Icon size={20} />
                  </div>
                  <h3
                    className="koha-module-name"
                    onClick={() => onNavigateModule(mod.id)}
                    title={`Open ${mod.title}`}
                  >
                    {mod.title}
                  </h3>
                </div>

                <ul className="koha-module-links">
                  {mod.links.map((link, idx) => (
                    <li key={idx} className="koha-module-link-item">
                      <span className="koha-bullet">•</span>
                      <button
                        type="button"
                        className="koha-module-link-btn"
                        onClick={link.action}
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Active Circulation Log & Recent Catalog */}
      <div className="koha-home-bottom-grid">
        {/* Active Circulation Table */}
        <div className="koha-panel">
          <div className="koha-panel-header">
            <div className="koha-panel-title-group">
              <Clock size={16} className="text-primary" />
              <h3 className="koha-panel-title">Active Circulation & Checked Out Items</h3>
            </div>
            <button
              className="koha-btn-link"
              onClick={() => onNavigateModule('circulation')}
            >
              View Circulation Workstation &rarr;
            </button>
          </div>

          <div className="koha-table-responsive">
            <table className="koha-data-table">
              <thead>
                <tr>
                  <th>Barcode</th>
                  <th>Title</th>
                  <th>Patron</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {activeLoansList.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-secondary)' }}>
                      No active items currently issued.
                    </td>
                  </tr>
                ) : (
                  activeLoansList.slice(0, 5).map((tx) => (
                    <tr key={tx.id}>
                      <td className="mono-text">{tx.itemBarcode}</td>
                      <td style={{ fontWeight: 600 }}>{tx.bookTitle}</td>
                      <td>{tx.patronName}</td>
                      <td>{tx.dueDate}</td>
                      <td>
                        <span
                          className={`koha-badge ${
                            tx.status === 'Overdue' ? 'koha-badge-overdue' : 'koha-badge-issued'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="koha-btn-action-sm"
                          onClick={() => onCheckInItem(tx)}
                          title="Check In Item"
                        >
                          Check in
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Featured Catalog Shelf */}
        <div className="koha-panel">
          <div className="koha-panel-header">
            <div className="koha-panel-title-group">
              <BookOpen size={16} className="text-primary" />
              <h3 className="koha-panel-title">Recent Catalog Additions</h3>
            </div>
            <button
              className="koha-btn-link"
              onClick={() => onNavigateModule('catalog')}
            >
              Browse OPAC &rarr;
            </button>
          </div>

          <div className="koha-book-mini-list">
            {books.slice(0, 4).map((b) => (
              <div
                key={b.id}
                className="koha-book-mini-row"
                onClick={() => {
                  onSelectBook(b);
                  onNavigateModule('catalog');
                }}
              >
                <div
                  className="koha-book-mini-cover"
                  style={{ background: b.coverColor }}
                >
                  <span>{b.itemType.slice(0, 4)}</span>
                </div>
                <div className="koha-book-mini-meta">
                  <div className="koha-book-mini-title">{b.title}</div>
                  <div className="koha-book-mini-author">{b.author}</div>
                  <div className="koha-book-mini-sub">
                    <span className="mono-text" style={{ fontSize: '0.72rem' }}>
                      {b.callNumber}
                    </span>
                    <span
                      className={`koha-avail-text ${
                        b.availableCopies > 0 ? 'text-success' : 'text-danger'
                      }`}
                    >
                      {b.availableCopies > 0
                        ? `${b.availableCopies} available`
                        : 'Checked out'}
                    </span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
