import React, { useState, useEffect } from 'react';
import {
  Home,
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
  Calendar,
  AlertTriangle,
  Activity,
  Sparkles,
  Zap,
  Layers,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Building2,
  Tag
} from 'lucide-react';

export default function DashboardView({
  books = [],
  patrons = [],
  transactions = [],
  setActiveTab,
  onNavigateModule,
  onOpenCheckOut,
  onOpenCheckIn,
  onOpenAddBook,
  onOpenAddPatron,
  onSelectBook,
  onOpenCheckOutForItem,
  onCheckInItem,
  selectedBranch,
  systemPrefs = {},
  effectiveLayout,
  activeLayoutSet,
  showToast
}) {
  // Allow switching dashboard presentation directly while syncing with active layout set
  const [dashboardMode, setDashboardMode] = useState(() => {
    return effectiveLayout?.dashboardLayout || 'analytics';
  });

  useEffect(() => {
    if (effectiveLayout?.dashboardLayout) {
      setDashboardMode(effectiveLayout.dashboardLayout);
    }
  }, [activeLayoutSet, effectiveLayout?.dashboardLayout]);

  // Fast Barcode Scanner Simulation state
  const [scannerInput, setScannerInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const totalTitles = books?.length || 0;
  const activeLoansList = (transactions || []).filter(
    (t) => t.status === 'Issued' || t.status === 'Overdue'
  );
  const activeLoansCount = activeLoansList.length;
  const overdueLoansList = (transactions || []).filter((t) => t.status === 'Overdue');
  const overdueCount = overdueLoansList.length;
  const totalPatronsCount = patrons?.length || 0;
  const totalCopies = (books || []).reduce((acc, b) => acc + (Number(b.copies) || 1), 0);
  const totalAvailableCopies = (books || []).reduce((acc, b) => acc + (Number(b.availableCopies) || 0), 0);
  const loanPeriodDays = systemPrefs?.loanDurationDays ?? systemPrefs?.loanPeriodDays ?? 14;

  // Analytics derivations
  const loanVelocityPct = totalCopies > 0 ? Math.round((activeLoansCount / totalCopies) * 100) : 0;
  const overdueRatePct = activeLoansCount > 0 ? Math.round((overdueCount / (activeLoansCount || 1)) * 100) : 0;

  // Subject distribution
  const subjectCounts = {};
  (books || []).forEach((b) => {
    (b.subjects || [b.itemType || 'General']).forEach((s) => {
      subjectCounts[s] = (subjectCounts[s] || 0) + 1;
    });
  });
  const topSubjects = Object.entries(subjectCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Branch distribution
  const branchCounts = {};
  (books || []).forEach((b) => {
    const br = b.branch || 'Main Library';
    branchCounts[br] = (branchCounts[br] || 0) + 1;
  });

  // Spotlight featured books (top 3 for the exhibition pedestals)
  const spotlightBooks = books.slice(0, 3);

  // Today's formatted date
  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Fast Barcode Scanner execution
  const handleFastScanSubmit = (e) => {
    e.preventDefault();
    const barcode = scannerInput.trim();
    if (!barcode) {
      if (showToast) showToast('Please scan or enter a barcode!', 'warning');
      return;
    }

    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Check if it's an active loan barcode -> check in
      const tx = transactions.find((t) => t.itemBarcode === barcode && t.status !== 'Returned');
      if (tx) {
        onCheckInItem(tx);
        if (showToast) showToast(`Laser scanned & returned "${tx.bookTitle}"!`, 'success');
        setScannerInput('');
        return;
      }

      // Check if it's a book barcode -> open check out or select book
      const book = books.find((b) => b.barcode === barcode);
      if (book) {
        if (onOpenCheckOutForItem && book.availableCopies > 0) {
          onOpenCheckOutForItem(book);
        } else if (onSelectBook) {
          onSelectBook(book);
          onNavigateModule('catalog');
        }
        if (showToast) showToast(`Identified "${book.title}" in catalog!`, 'info');
        setScannerInput('');
        return;
      }

      if (showToast) showToast(`Barcode ${barcode} not recognized in active database`, 'danger');
    }, 450);
  };

  // Simulate scanning the first active transaction barcode
  const handleSimulateScan = () => {
    const sampleBarcode = activeLoansList[0]?.itemBarcode || books[0]?.barcode || '399990148201';
    setScannerInput(sampleBarcode);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const tx = transactions.find((t) => t.itemBarcode === sampleBarcode && t.status !== 'Returned');
      if (tx) {
        onCheckInItem(tx);
        if (showToast) showToast(`Simulated Scan: Checked in "${tx.bookTitle}"!`, 'success');
        setScannerInput('');
      } else {
        if (showToast) showToast(`Simulated Scan: Loaded barcode ${sampleBarcode}`, 'info');
      }
    }, 450);
  };

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
      {/* Top Header & Dashboard Mode Switcher */}
      <div className="dashboard-top-header">
        <div className="dashboard-title-group">
          <div className="dashboard-badge">
            <Sparkles size={13} className="dashboard-badge-icon" />
            <span>Koha ILS Command Center • {selectedBranch}</span>
          </div>
          <h1 className="dashboard-main-title">
            <Home size={26} className="text-primary" />
            <span>Library Workstation & Exhibition Hub</span>
          </h1>
          <p className="dashboard-subtitle">
            {todayStr} • Operating branch: <strong>{selectedBranch}</strong> • System Status:{' '}
            <span className="status-pill-online">Online & Synced</span>
          </p>
        </div>

        {/* Dashboard Presentation Mode Selector */}
        <div className="dashboard-mode-switcher-wrapper">
          <span className="dashboard-mode-caption">Dashboard View</span>
          <div className="dashboard-layout-selector" role="radiogroup">
            <button
              type="button"
              className={`dashboard-layout-btn ${dashboardMode === 'analytics' ? 'active' : ''}`}
              onClick={() => setDashboardMode('analytics')}
              title="Curated Showcase Exhibition & Analytics"
            >
              <Sparkles size={14} />
              <span>Showcase Analytics</span>
            </button>
            <button
              type="button"
              className={`dashboard-layout-btn ${dashboardMode === 'launchpad' ? 'active' : ''}`}
              onClick={() => setDashboardMode('launchpad')}
              title="Staff Client Module Launchpad"
            >
              <Layers size={14} />
              <span>Launchpad Hub</span>
            </button>
            <button
              type="button"
              className={`dashboard-layout-btn ${dashboardMode === 'operational' ? 'active' : ''}`}
              onClick={() => setDashboardMode('operational')}
              title="Dual-Column Circulation Desk Operations"
            >
              <Repeat size={14} />
              <span>Circulation Desk</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Laser Scanner Bar (Accessible Across Dashboard Views) */}
      <div className="koha-card fast-scanner-card">
        <div className="fast-scanner-content">
          <div className="fast-scanner-icon-box">
            <Zap size={20} className={isScanning ? 'laser-pulsing' : ''} />
          </div>
          <div className="fast-scanner-info">
            <h4 className="fast-scanner-title">Rapid Circulation Barcode Scanner</h4>
            <p className="fast-scanner-desc">
              Instantly scan item barcodes for automated check-in or patron checkout processing
            </p>
          </div>
          <form className="fast-scanner-form" onSubmit={handleFastScanSubmit}>
            <div className="fast-scanner-input-box">
              <Search size={16} className="scanner-input-icon" />
              <input
                type="text"
                className="form-input fast-scanner-input"
                placeholder="Scan or enter barcode (e.g. 399990148201)..."
                value={scannerInput}
                onChange={(e) => setScannerInput(e.target.value)}
              />
              {isScanning && <div className="scanner-laser-line" />}
            </div>
            <button type="submit" className="btn btn-primary btn-scan-execute" disabled={isScanning}>
              <Zap size={15} />
              <span>{isScanning ? 'Scanning...' : 'Execute Scan'}</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-simulate-scan"
              onClick={handleSimulateScan}
              title="Simulate hardware barcode gun scan"
            >
              Simulate Gun
            </button>
          </form>
        </div>
      </div>

      {/* =========================================================================
          ✦ LAYOUT STYLE 1: CURATED SHOWCASE EXHIBITION & VISUAL ANALYTICS (FLAGSHIP)
          ========================================================================= */}
      {dashboardMode === 'analytics' && (
        <div className="dashboard-analytics-grid">
          {/* 3D EXHIBITION SPOTLIGHT PEDESTALS (Hero Showcase Section) */}
          <div className="koha-card exhibition-pedestal-section">
            <div className="exhibition-header">
              <div>
                <div className="exhibition-tag">
                  <Sparkles size={13} />
                  <span>Curated Acquisitions Spotlight</span>
                </div>
                <h2 className="exhibition-title">Featured Holdings on Exhibition</h2>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => onNavigateModule('catalog')}
              >
                <span>Explore Full 3D Bookshelf</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Pedestal Stage */}
            <div className="pedestal-stage">
              {spotlightBooks.map((book, idx) => (
                <div key={book.id} className="pedestal-item">
                  {/* Spotlight Cone Glow */}
                  <div className="pedestal-light-cone" />

                  {/* 3D Hardcover Book Model */}
                  <div
                    className="pedestal-book-model"
                    style={{ background: book.coverColor }}
                    onClick={() => {
                      if (onSelectBook) onSelectBook(book);
                      onNavigateModule('catalog');
                    }}
                    title={`Inspect ${book.title}`}
                  >
                    <div className="pedestal-book-spine-line" />
                    <div className="pedestal-book-sheen" />
                    <div className="pedestal-book-ribbon" />
                    <div className="pedestal-book-content">
                      <span className="pedestal-book-type">{book.itemType}</span>
                      <h4 className="pedestal-book-title">{book.title}</h4>
                      <span className="pedestal-book-author">by {book.author}</span>
                      <span className="pedestal-book-year">{book.year}</span>
                    </div>
                  </div>

                  {/* Illuminated Pedestal Column */}
                  <div className="pedestal-column">
                    <div className="pedestal-top-surface" />
                    <div className="pedestal-body">
                      <span className="pedestal-num">0{idx + 1}</span>
                      <span className="pedestal-label">
                        {book.availableCopies > 0 ? 'AVAILABLE' : 'ISSUED'}
                      </span>
                    </div>
                    <div className="pedestal-base-glow" />
                  </div>

                  {/* Pedestal Info Card & Quick Actions */}
                  <div className="pedestal-card-info">
                    <span className="pedestal-callno mono-text">{book.callNumber}</span>
                    <div className="pedestal-actions">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          if (onSelectBook) onSelectBook(book);
                          onNavigateModule('catalog');
                        }}
                      >
                        MARC Record
                      </button>
                      {book.availableCopies > 0 ? (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            if (onOpenCheckOutForItem) onOpenCheckOutForItem(book);
                          }}
                        >
                          Quick Issue
                        </button>
                      ) : (
                        <span className="pedestal-loaned-chip">Checked Out</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top KPI Metrics Strip (Curated Holographic Glow) */}
          <div className="analytics-metric-grid">
            <div className="analytics-metric-tile tile-emerald">
              <div className="metric-tile-header">
                <span className="metric-tile-label">Holdings Inventory</span>
                <BookOpen size={16} className="text-primary" />
              </div>
              <div className="analytics-metric-num">{totalTitles}</div>
              <span className="analytics-metric-sub">{totalCopies} physical & digital volumes</span>
              <div className="metric-tile-progress">
                <div
                  className="metric-tile-progress-fill"
                  style={{ width: '100%', background: 'var(--primary)' }}
                />
              </div>
            </div>

            <div className="analytics-metric-tile tile-blue">
              <div className="metric-tile-header">
                <span className="metric-tile-label">Circulation Velocity</span>
                <TrendingUp size={16} style={{ color: '#0284c7' }} />
              </div>
              <div className="analytics-metric-num" style={{ color: '#0284c7' }}>
                {loanVelocityPct}%
              </div>
              <span className="analytics-metric-sub">{activeLoansCount} active loans circulating</span>
              <div className="metric-tile-progress">
                <div
                  className="metric-tile-progress-fill"
                  style={{ width: `${loanVelocityPct}%`, background: '#0284c7' }}
                />
              </div>
            </div>

            <div className="analytics-metric-tile tile-amber">
              <div className="metric-tile-header">
                <span className="metric-tile-label">Overdue Loan Rate</span>
                <AlertTriangle
                  size={16}
                  style={{ color: overdueRatePct > 15 ? 'var(--danger)' : '#d97706' }}
                />
              </div>
              <div
                className="analytics-metric-num"
                style={{ color: overdueRatePct > 15 ? 'var(--danger)' : '#d97706' }}
              >
                {overdueRatePct}%
              </div>
              <span className="analytics-metric-sub">
                {overdueCount} overdue of {activeLoansCount || 1} issued
              </span>
              <div className="metric-tile-progress">
                <div
                  className="metric-tile-progress-fill"
                  style={{
                    width: `${Math.min(100, overdueRatePct * 3)}%`,
                    background: overdueRatePct > 15 ? 'var(--danger)' : '#d97706'
                  }}
                />
              </div>
            </div>

            <div className="analytics-metric-tile tile-purple">
              <div className="metric-tile-header">
                <span className="metric-tile-label">Registered Borrowers</span>
                <Users size={16} style={{ color: '#7c3aed' }} />
              </div>
              <div className="analytics-metric-num" style={{ color: '#7c3aed' }}>
                {totalPatronsCount}
              </div>
              <span className="analytics-metric-sub">Active faculty, students, and guests</span>
              <div className="metric-tile-progress">
                <div
                  className="metric-tile-progress-fill"
                  style={{ width: '85%', background: '#7c3aed' }}
                />
              </div>
            </div>
          </div>

          {/* Charts & Breakdown Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {/* Subject Distribution Breakdown Bar Chart */}
            <div className="analytics-bars-card">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Tag size={16} className="text-primary" />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Holdings Classification</h3>
                </div>
                <span className="mono-text" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Top 5 Subject Areas
                </span>
              </div>

              {topSubjects.map(([subject, count]) => {
                const pct = Math.round((count / (books.length || 1)) * 100);
                return (
                  <div key={subject} className="analytics-bar-row">
                    <div className="analytics-bar-label" title={subject}>
                      {subject}
                    </div>
                    <div className="analytics-bar-track">
                      <div className="analytics-bar-fill" style={{ width: `${Math.max(14, pct)}%` }} />
                    </div>
                    <div className="analytics-bar-val">{count}</div>
                  </div>
                );
              })}
            </div>

            {/* Branch Allocation & System Diagnostics */}
            <div className="analytics-bars-card">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building2 size={16} className="text-primary" />
                  <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Campus Branch Allocation</h3>
                </div>
                <span className="mono-text" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Branches
                </span>
              </div>

              {Object.entries(branchCounts).map(([branch, count]) => {
                const pct = Math.round((count / (books.length || 1)) * 100);
                return (
                  <div key={branch} className="analytics-bar-row">
                    <div className="analytics-bar-label" title={branch}>
                      {branch}
                    </div>
                    <div className="analytics-bar-track">
                      <div
                        className="analytics-bar-fill"
                        style={{
                          width: `${Math.max(14, pct)}%`,
                          background: 'linear-gradient(90deg, #10b981, #34d399)'
                        }}
                      />
                    </div>
                    <div className="analytics-bar-val">{count}</div>
                  </div>
                );
              })}

              <div
                style={{
                  marginTop: '1.5rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-subtle)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.78rem',
                    marginBottom: '0.45rem'
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>Standard Loan Duration:</span>
                  <strong>{loanPeriodDays} calendar days</strong>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.78rem',
                    marginBottom: '0.45rem'
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>ILS Version:</span>
                  <span className="mono-text">v24.05.00 Community Edition</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.78rem'
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>System Diagnostics:</span>
                  <span style={{ color: 'var(--success)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <ShieldCheck size={14} /> Online • All Services Healthy
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Circulation Activity Log */}
          <div className="koha-card" style={{ padding: '1.5rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}
            >
              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Activity size={18} className="text-primary" />
                <span>Live Circulation Activity Stream</span>
              </h3>
              <button className="koha-btn-link" onClick={() => onNavigateModule('reports')}>
                Run SQL Report &rarr;
              </button>
            </div>

            <div className="koha-table-responsive">
              <table className="koha-data-table">
                <thead>
                  <tr>
                    <th>Loan ID</th>
                    <th>Item Barcode</th>
                    <th>Book Title</th>
                    <th>Patron Name</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Quick Return</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 6).map((tx) => (
                    <tr key={tx.id}>
                      <td className="mono-text">{tx.id}</td>
                      <td className="mono-text">{tx.itemBarcode}</td>
                      <td style={{ fontWeight: 600 }}>{tx.bookTitle}</td>
                      <td>{tx.patronName}</td>
                      <td>{tx.issueDate}</td>
                      <td
                        style={{
                          color: tx.status === 'Overdue' ? 'var(--danger)' : 'inherit',
                          fontWeight: tx.status === 'Overdue' ? 700 : 400
                        }}
                      >
                        {tx.dueDate}
                      </td>
                      <td>
                        <span
                          className={`koha-badge ${
                            tx.status === 'Overdue'
                              ? 'koha-badge-overdue'
                              : tx.status === 'Returned'
                              ? 'koha-badge-returned'
                              : 'koha-badge-issued'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td>
                        {tx.status !== 'Returned' && (
                          <button
                            type="button"
                            className="koha-btn-action-sm"
                            onClick={() => onCheckInItem(tx)}
                            title="Return item"
                          >
                            Check In
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          LAYOUT STYLE 2: LAUNCHPAD HUB (AUTHENTIC KOHA STAFF CLIENT)
          ========================================================================= */}
      {dashboardMode === 'launchpad' && (
        <>
          <div className="koha-home-top-grid">
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

            <div className="koha-news-card">
              <div className="koha-news-heading">
                <Calendar size={15} />
                <span>Koha Library News & Notices</span>
              </div>
              <div className="koha-news-body">
                <div className="koha-news-alert">
                  <strong>Branch Operations:</strong> Full circulation active for {selectedBranch}.
                  Default loan period: {loanPeriodDays} days.
                </div>
                <div className="koha-news-footer">
                  <span>Shift: Main Desk • Superuser Staff</span>
                </div>
              </div>
            </div>
          </div>

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
              <div className="koha-stat-number stat-highlight-amber">{totalAvailableCopies}</div>
              <div className="koha-stat-label">Available Items</div>
            </div>
          </div>

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
        </>
      )}

      {/* =========================================================================
          LAYOUT STYLE 3: OPERATIONAL CIRCULATION DESK (HIGH DENSITY)
          ========================================================================= */}
      {dashboardMode === 'operational' && (
        <div className="dashboard-operational-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="desk-station-card">
              <div className="desk-station-header">
                <div className="desk-station-title">
                  <Repeat size={18} className="text-primary" />
                  <span>Immediate Circulation Log</span>
                </div>
                <button
                  type="button"
                  className="koha-btn-primary btn-sm"
                  onClick={() => onNavigateModule('circulation', 'checkout')}
                >
                  <PlusCircle size={14} /> Issue Loan
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
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeLoansList.slice(0, 6).map((tx) => (
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
                          >
                            Check in
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="koha-card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.85rem' }}>
                Shift Counters • {selectedBranch}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div
                  style={{
                    background: 'var(--bg-input)',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Active Loans</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {activeLoansCount}
                  </div>
                </div>
                <div
                  style={{
                    background: 'var(--bg-input)',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Overdue Items</div>
                  <div
                    style={{
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      color: overdueCount > 0 ? 'var(--danger)' : 'var(--text-primary)'
                    }}
                  >
                    {overdueCount}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
