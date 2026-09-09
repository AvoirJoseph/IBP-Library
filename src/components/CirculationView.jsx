import React, { useState } from 'react';
import {
  Repeat,
  CheckCircle2,
  UserCheck,
  Barcode as BarcodeIcon,
  Calendar
} from 'lucide-react';

export default function CirculationView({
  books,
  patrons,
  transactions,
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
    incomingPatron ? (patrons.find(p => p.cardNum === incomingPatron || p.name.toLowerCase().includes(incomingPatron.toLowerCase()))?.id || patrons[0]?.id || '') : (patrons[0]?.id || '')
  );
  const [selectedBookId, setSelectedBookId] = useState(
    preselectedBook ? preselectedBook.id : books[0]?.id || ''
  );
  const [dueDate, setDueDate] = useState('2026-09-15');

  // Check in Form state
  const [returnBarcode, setReturnBarcode] = useState(incomingBarcode || '');

  // Keep incoming states updated
  React.useEffect(() => {
    if (incomingBarcode) {
      setReturnBarcode(incomingBarcode);
    }
  }, [incomingBarcode]);

  React.useEffect(() => {
    if (incomingPatron) {
      const match = patrons.find(p => p.cardNum === incomingPatron || p.name.toLowerCase().includes(incomingPatron.toLowerCase()));
      if (match) setSelectedPatronId(match.id);
    }
  }, [incomingPatron, patrons]);

  const activePatron = patrons.find((p) => p.id === selectedPatronId);
  const activeBook = books.find((b) => b.id === selectedBookId);

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (!activePatron || !activeBook) return;

    if (activeBook.availableCopies <= 0) {
      showToast('No available copies left for this item!', 'danger');
      return;
    }

    onCheckOutItem(activePatron, activeBook, dueDate);
    showToast(`Successfully checked out "${activeBook.title}" to ${activePatron.name}. Due date: ${dueDate}`, 'success');
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    if (!returnBarcode) {
      showToast('Please enter or scan an item barcode!', 'warning');
      return;
    }

    const tx = transactions.find((t) => t.itemBarcode === returnBarcode.trim() && t.status !== 'Returned');
    if (!tx) {
      showToast(`No active loan record found for barcode: ${returnBarcode}`, 'danger');
      return;
    }

    onCheckInItem(tx);
    showToast(`Successfully returned "${tx.bookTitle}". Item status restored to Available!`, 'success');
    setReturnBarcode('');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Repeat size={28} className="text-primary" />
            Circulation & Loan Workstation
          </h1>
          <p className="page-subtitle">
            Manage check-outs, returns, renewals, and hold reserves
          </p>
        </div>
      </div>

      {/* Circulation Tabs */}
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeCircTab === 'checkout' ? 'active' : ''}`}
          onClick={() => switchTab('checkout')}
        >
          Check Out (Issue)
        </button>
        <button
          className={`tab-btn ${activeCircTab === 'checkin' ? 'active' : ''}`}
          onClick={() => switchTab('checkin')}
        >
          Check In (Return)
        </button>
        <button
          className={`tab-btn ${activeCircTab === 'holds' ? 'active' : ''}`}
          onClick={() => switchTab('holds')}
        >
          Holds & Reserves Queue
        </button>
      </div>

      {/* Circulation Content */}
      {activeCircTab === 'checkout' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
          {/* Check out Form */}
          <div className="koha-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserCheck size={18} className="text-primary" />
              1. Patron & Item Issue Form
            </h3>

            <form onSubmit={handleIssueSubmit}>
              {/* Select Patron */}
              <div className="form-group">
                <label className="form-label">Select Patron Card / Name</label>
                <select
                  className="form-select"
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

              {/* Select Book / Item */}
              <div className="form-group">
                <label className="form-label">Select Catalog Item / Barcode</label>
                <select
                  className="form-select"
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
                <label className="form-label">Calculated Due Date</label>
                <div style={{ position: 'relative' }}>
                  <Calendar
                    size={16}
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  />
                  <input
                    type="date"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.85rem' }}
                  disabled={!activeBook || activeBook.availableCopies <= 0}
                >
                  <CheckCircle2 size={18} />
                  Confirm & Execute Check Out
                </button>
              </div>
            </form>
          </div>

          {/* Issue Summary Preview */}
          <div className="koha-card" style={{ backgroundColor: 'var(--bg-input)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              Transaction Summary Preview
            </h3>

            {activePatron && (
              <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Patron Record</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '0.2rem' }}>{activePatron.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Card #: <span className="mono-text">{activePatron.cardNum}</span> • Category: {activePatron.category}
                </div>
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  <span className="badge badge-category">Active Loans: {activePatron.borrowedCount}</span>
                </div>
              </div>
            )}

            {activeBook && (
              <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Selected Holdings Item</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '0.2rem' }}>{activeBook.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Author: {activeBook.author}</div>
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  <span className="mono-text">BC: {activeBook.barcode}</span>
                  <span className={`badge ${activeBook.availableCopies > 0 ? 'badge-available' : 'badge-loaned'}`}>
                    {activeBook.availableCopies} Copies Available
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeCircTab === 'checkin' && (
        <div style={{ maxWidth: '650px', margin: '0 auto' }}>
          <div className="koha-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={18} className="text-primary" />
              Check In (Item Return Station)
            </h3>

            <form onSubmit={handleReturnSubmit}>
              <div className="form-group">
                <label className="form-label">Scan or Enter Item Barcode</label>
                <div style={{ position: 'relative' }}>
                  <BarcodeIcon
                    size={18}
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '2.5rem', fontSize: '1.05rem' }}
                    placeholder="Scan item barcode (e.g. 399990148203)..."
                    value={returnBarcode}
                    onChange={(e) => setReturnBarcode(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  Or click one of the currently active issued barcodes below:
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {transactions.filter((t) => t.status !== 'Returned').map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setReturnBarcode(t.itemBarcode)}
                    >
                      {t.itemBarcode} ({t.status})
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-success" style={{ width: '100%', padding: '0.85rem' }}>
                <CheckCircle2 size={18} />
                Process Book Return
              </button>
            </form>
          </div>
        </div>
      )}

      {activeCircTab === 'holds' && (
        <div className="koha-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
            Pending Koha Holds & Reserves Queue
          </h3>
          <div className="table-wrapper">
            <table className="koha-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Title</th>
                  <th>Patron</th>
                  <th>Request Date</th>
                  <th>Priority</th>
                  <th>Pickup Branch</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="mono-text">HOLD-401</span></td>
                  <td style={{ fontWeight: 700 }}>Designing Data-Intensive Applications</td>
                  <td>Dr. Eleanor Vance</td>
                  <td>2026-08-28</td>
                  <td><span className="badge badge-category">Priority 1</span></td>
                  <td>Science Branch</td>
                  <td>
                    <button className="btn btn-primary btn-sm" onClick={() => showToast('Hold notification sent to patron!', 'info')}>
                      Notify Patron
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
