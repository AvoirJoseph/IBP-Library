import React, { useState, useEffect } from 'react';
import {
  Repeat,
  CheckCircle2,
  UserCheck,
  Barcode as BarcodeIcon,
  Calendar,
  Zap,
  CreditCard,
  BookOpen,
  MapPin,
  Clock,
  ShieldCheck,
  Tag,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export default function CirculationView({
  books = [],
  patrons = [],
  transactions = [],
  onCheckOutItem,
  onCheckInItem,
  preselectedBook,
  showToast,
  circSubTab = 'checkout',
  setCircSubTab,
  incomingBarcode = '',
  incomingPatron = ''
}) {
  const [internalTab, setInternalTab] = useState('checkout');
  const activeCircTab = circSubTab || internalTab;
  const switchTab = (t) => {
    if (setCircSubTab) setCircSubTab(t);
    setInternalTab(t);
  };

  // Check out Form state
  const [selectedPatronId, setSelectedPatronId] = useState(
    incomingPatron
      ? patrons.find(
          (p) =>
            p.cardNum === incomingPatron ||
            p.name.toLowerCase().includes(incomingPatron.toLowerCase())
        )?.id || patrons[0]?.id || ''
      : patrons[0]?.id || ''
  );
  const [selectedBookId, setSelectedBookId] = useState(
    preselectedBook ? preselectedBook.id : books[0]?.id || ''
  );
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });

  // Check in Form state
  const [returnBarcode, setReturnBarcode] = useState(incomingBarcode || '');
  const [isLaserScanning, setIsLaserScanning] = useState(false);

  // Keep incoming states updated
  useEffect(() => {
    if (incomingBarcode) {
      setReturnBarcode(incomingBarcode);
    }
  }, [incomingBarcode]);

  useEffect(() => {
    if (incomingPatron) {
      const match = patrons.find(
        (p) =>
          p.cardNum === incomingPatron ||
          p.name.toLowerCase().includes(incomingPatron.toLowerCase())
      );
      if (match) setSelectedPatronId(match.id);
    }
  }, [incomingPatron, patrons]);

  const activePatron = patrons.find((p) => p.id === selectedPatronId);
  const activeBook = books.find((b) => b.id === selectedBookId);

  // Active loans currently issued across the library
  const activeTransactions = transactions.filter(
    (t) => t.status === 'Issued' || t.status === 'Overdue'
  );

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (!activePatron || !activeBook) return;

    if (activeBook.availableCopies <= 0) {
      if (showToast) showToast('No available copies left for this item!', 'danger');
      return;
    }

    onCheckOutItem(activePatron, activeBook, dueDate);
    if (showToast) {
      showToast(
        `Successfully issued "${activeBook.title}" to ${activePatron.name}. Due: ${dueDate}`,
        'success'
      );
    }
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    const barcode = returnBarcode.trim();
    if (!barcode) {
      if (showToast) showToast('Please enter or scan an item barcode!', 'warning');
      return;
    }

    setIsLaserScanning(true);
    setTimeout(() => {
      setIsLaserScanning(false);
      const tx = transactions.find(
        (t) => t.itemBarcode === barcode && t.status !== 'Returned'
      );
      if (!tx) {
        if (showToast) showToast(`No active loan record found for barcode: ${barcode}`, 'danger');
        return;
      }

      onCheckInItem(tx);
      if (showToast) {
        showToast(
          `Laser Verified Return: "${tx.bookTitle}" is back on shelf!`,
          'success'
        );
      }
      setReturnBarcode('');
    }, 450);
  };

  const handleSimulateGunScan = (barcode) => {
    setReturnBarcode(barcode);
    setIsLaserScanning(true);
    setTimeout(() => {
      setIsLaserScanning(false);
      const tx = transactions.find((t) => t.itemBarcode === barcode && t.status !== 'Returned');
      if (tx) {
        onCheckInItem(tx);
        if (showToast) showToast(`Hardware Gun Simulated: Returned "${tx.bookTitle}"!`, 'success');
        setReturnBarcode('');
      }
    }, 450);
  };

  return (
    <div className="circulation-desk-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Repeat size={28} className="text-primary" />
            <span>Circulation & Loan Workstation</span>
          </h1>
          <p className="page-subtitle">
            Issue loans, process returns with barcode verification, track reserves, and inspect patron accounts
          </p>
        </div>
      </div>

      {/* Circulation Tabs Switcher */}
      <div className="tabs-header">
        <button
          type="button"
          className={`tab-btn ${activeCircTab === 'checkout' ? 'active' : ''}`}
          onClick={() => switchTab('checkout')}
        >
          Check Out (Issue)
        </button>
        <button
          type="button"
          className={`tab-btn ${activeCircTab === 'checkin' ? 'active' : ''}`}
          onClick={() => switchTab('checkin')}
        >
          Check In (Return)
        </button>
        <button
          type="button"
          className={`tab-btn ${activeCircTab === 'holds' ? 'active' : ''}`}
          onClick={() => switchTab('holds')}
        >
          Holds & Priority Reserves
        </button>
      </div>

      {/* =========================================================================
          1. CHECK OUT / ISSUE LOAN WORKBENCH
          ========================================================================= */}
      {activeCircTab === 'checkout' && (
        <div className="circ-checkout-layout">
          {/* Left: Issue Form */}
          <div className="koha-card circ-form-card">
            <div className="circ-card-header">
              <UserCheck size={20} className="text-primary" />
              <h3 className="circ-card-title">1. Circulation Issue Form</h3>
            </div>

            <form onSubmit={handleIssueSubmit}>
              {/* Select Patron */}
              <div className="form-group">
                <label className="form-label">Select Registered Patron Card</label>
                <select
                  className="form-select circ-select"
                  value={selectedPatronId}
                  onChange={(e) => setSelectedPatronId(e.target.value)}
                >
                  {patrons.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.cardNum}) — {p.category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Book */}
              <div className="form-group">
                <label className="form-label">Select Bibliographic Volume to Loan</label>
                <select
                  className="form-select circ-select"
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                >
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} (BC: {b.barcode}) — Avail: {b.availableCopies}/{b.copies}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date Picker */}
              <div className="form-group">
                <label className="form-label">Calculated Return Due Date</label>
                <div style={{ position: 'relative' }}>
                  <Calendar
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)'
                    }}
                  />
                  <input
                    type="date"
                    className="form-input"
                    style={{ paddingLeft: '2.6rem' }}
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginTop: '1.75rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary circ-submit-btn"
                  disabled={!activeBook || activeBook.availableCopies <= 0}
                >
                  <CheckCircle2 size={18} />
                  <span>Execute Circulation Issue</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Tactile Physical Visualizer (Digital Patron ID Card & 3D Book Cover) */}
          <div className="circ-preview-column">
            {/* Patron ID Card Visualizer */}
            {activePatron && (
              <div className="patron-digital-card-preview">
                <div className="patron-card-shine" />
                <div className="patron-card-header">
                  <div className="patron-card-brand">
                    <span className="brand-small">Koha Integrated Library System</span>
                    <span className="brand-branch">{activePatron.branch}</span>
                  </div>
                  <span className="patron-tier-badge">{activePatron.category}</span>
                </div>

                {/* Metallic Smart Chip */}
                <div className="patron-emv-chip">
                  <div className="chip-lines" />
                </div>

                <div className="patron-card-body">
                  <div
                    className="patron-avatar-circle"
                    style={{ backgroundColor: activePatron.avatarColor || 'var(--primary)' }}
                  >
                    {activePatron.name.charAt(0)}
                  </div>
                  <div className="patron-identity-group">
                    <h4 className="patron-full-name">{activePatron.name}</h4>
                    <span className="patron-email-text">{activePatron.email}</span>
                    <span className="patron-card-expiry">Expires: {activePatron.expiryDate}</span>
                  </div>
                </div>

                <div className="patron-card-footer">
                  <div className="patron-barcode-box">
                    <div className="barcode-lines">
                      <div className="barcode-bar" style={{ width: '4px' }} />
                      <div className="barcode-bar" style={{ width: '2px' }} />
                      <div className="barcode-bar" style={{ width: '5px' }} />
                      <div className="barcode-bar" style={{ width: '1px' }} />
                      <div className="barcode-bar" style={{ width: '4px' }} />
                      <div className="barcode-bar" style={{ width: '2px' }} />
                      <div className="barcode-bar" style={{ width: '6px' }} />
                      <div className="barcode-bar" style={{ width: '2px' }} />
                    </div>
                    <span className="mono-text barcode-num">{activePatron.cardNum}</span>
                  </div>
                  <div className="patron-quota-meter">
                    <span className="quota-label">Current Loans</span>
                    <span className="quota-val">{activePatron.borrowedCount} items</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3D Selected Book Cover Preview */}
            {activeBook && (
              <div className="circ-book-loan-model-card">
                <div
                  className="circ-book-3d-model"
                  style={{ background: activeBook.coverColor }}
                >
                  <div className="circ-book-spine-crease" />
                  <div className="circ-book-sheen" />
                  <span className="circ-book-type-pill">{activeBook.itemType}</span>
                  <div className="circ-book-title-overlay">{activeBook.title}</div>
                  <span className="circ-book-year-pill">{activeBook.year}</span>
                </div>

                <div className="circ-book-loan-details">
                  <div className="circ-loan-status-tag">
                    <span
                      className={`badge ${
                        activeBook.availableCopies > 0 ? 'badge-available' : 'badge-loaned'
                      }`}
                    >
                      {activeBook.availableCopies > 0
                        ? `${activeBook.availableCopies} of ${activeBook.copies} Available`
                        : 'All Copies Currently Checked Out'}
                    </span>
                  </div>
                  <h4 className="circ-book-title-main">{activeBook.title}</h4>
                  <div className="circ-book-author-line">by {activeBook.author}</div>
                  <div className="circ-book-meta-pills">
                    <span className="mono-text pill-callno">{activeBook.callNumber}</span>
                    <span className="mono-text pill-barcode">BC: {activeBook.barcode}</span>
                    <span className="pill-branch">{activeBook.branch}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          2. CHECK IN / FAST RETURN WORKBENCH
          ========================================================================= */}
      {activeCircTab === 'checkin' && (
        <div className="circ-checkin-wrapper">
          <div className="koha-card circ-checkin-scanner-card">
            <div className="checkin-scanner-header">
              <div className="checkin-icon-circle">
                <Zap size={22} className={isLaserScanning ? 'laser-pulsing' : ''} />
              </div>
              <div>
                <h3 className="checkin-title">Laser Barcode Return Station</h3>
                <p className="checkin-sub">
                  Scan book barcode to immediately restore item availability and clear patron liability
                </p>
              </div>
            </div>

            <form onSubmit={handleReturnSubmit} className="checkin-scan-form">
              <div className="checkin-input-wrapper">
                <BarcodeIcon size={18} className="checkin-barcode-icon" />
                <input
                  type="text"
                  className="form-input checkin-text-input"
                  placeholder="Scan or enter book barcode (e.g. 399990148201)..."
                  value={returnBarcode}
                  onChange={(e) => setReturnBarcode(e.target.value)}
                />
                {isLaserScanning && <div className="checkin-laser-scanner-line" />}
              </div>

              <button
                type="submit"
                className="btn btn-primary checkin-execute-btn"
                disabled={isLaserScanning}
              >
                <CheckCircle2 size={16} />
                <span>{isLaserScanning ? 'Verifying...' : 'Process Return'}</span>
              </button>
            </form>

            {/* Simulated hardware guns for one-click testing */}
            {activeTransactions.length > 0 && (
              <div className="checkin-active-fast-buttons">
                <span className="fast-scan-label">Fast Hardware Scanner Simulator:</span>
                <div className="fast-scan-pills">
                  {activeTransactions.slice(0, 3).map((tx) => (
                    <button
                      key={tx.id}
                      type="button"
                      className="fast-scan-pill-btn"
                      onClick={() => handleSimulateGunScan(tx.itemBarcode)}
                      title={`Simulate scan for ${tx.bookTitle}`}
                    >
                      <Zap size={12} />
                      <span>{tx.bookTitle.slice(0, 22)}...</span>
                      <strong className="mono-text">({tx.itemBarcode.slice(-4)})</strong>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Active Checked Out Items Live Table */}
          <div className="koha-card" style={{ marginTop: '1.5rem', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} className="text-primary" />
              <span>Outstanding Borrowed Items ({activeTransactions.length})</span>
            </h3>

            <div className="table-wrapper">
              <table className="koha-table">
                <thead>
                  <tr>
                    <th>Barcode</th>
                    <th>Book Title</th>
                    <th>Borrowing Patron</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        All circulating library items are presently in the stacks!
                      </td>
                    </tr>
                  ) : (
                    activeTransactions.map((tx) => (
                      <tr key={tx.id}>
                        <td className="mono-text">{tx.itemBarcode}</td>
                        <td style={{ fontWeight: 700 }}>{tx.bookTitle}</td>
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
                            className={`badge ${
                              tx.status === 'Overdue' ? 'badge-loaned' : 'badge-available'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => onCheckInItem(tx)}
                          >
                            Check In
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. HOLDS & PRIORITY RESERVES QUEUE
          ========================================================================= */}
      {activeCircTab === 'holds' && (
        <div className="koha-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Campus Holds & Reservation Queue</h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Priority queue for titles currently checked out or transferred between branch libraries
              </p>
            </div>
            <span className="badge badge-category">3 Pending Holds</span>
          </div>

          <div className="table-wrapper">
            <table className="koha-table">
              <thead>
                <tr>
                  <th>Queue #</th>
                  <th>Title Reserved</th>
                  <th>Patron</th>
                  <th>Pickup Branch</th>
                  <th>Date Placed</th>
                  <th>Priority Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="badge badge-available">#1 in line</span></td>
                  <td style={{ fontWeight: 700 }}>Introduction to Algorithms (4th Edition)</td>
                  <td>Elena Rostova</td>
                  <td>Main Library Desk</td>
                  <td>2026-09-12</td>
                  <td><span className="badge badge-available">Ready for Pickup</span></td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        if (showToast) showToast('Notified Elena Rostova via Email & SMS!', 'success');
                      }}
                    >
                      Notify Patron
                    </button>
                  </td>
                </tr>
                <tr>
                  <td><span className="badge badge-category">#2 in line</span></td>
                  <td style={{ fontWeight: 700 }}>Designing Data-Intensive Applications</td>
                  <td>Carlos Mendoza</td>
                  <td>Science & Tech Branch</td>
                  <td>2026-09-13</td>
                  <td><span className="badge badge-category">In Transit</span></td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        if (showToast) showToast('Transit confirmed to Science & Tech Branch', 'info');
                      }}
                    >
                      Receive Transit
                    </button>
                  </td>
                </tr>
                <tr>
                  <td><span className="badge badge-category">#3 in line</span></td>
                  <td style={{ fontWeight: 700 }}>Clean Code: A Handbook of Agile Software Craftsmanship</td>
                  <td>Marcus Thorne</td>
                  <td>Law & Graduate Annex</td>
                  <td>2026-09-14</td>
                  <td><span className="badge badge-category">Waiting for Item Return</span></td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        if (showToast) showToast('Reservation queue updated', 'info');
                      }}
                    >
                      Manage Hold
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
