import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  CreditCard,
  Mail,
  Phone,
  Building2,
  AlertCircle,
  X,
  Printer,
  Grid,
  Table,
  CheckCircle2,
  Tag,
  ShieldCheck,
  Repeat
} from 'lucide-react';

export default function PatronsView({
  patrons = [],
  onAddPatron,
  systemPrefs = { branches: [] },
  showToast
}) {
  const [patronSearch, setPatronSearch] = useState('');
  const [patronViewMode, setPatronViewMode] = useState('cards'); // 'cards' | 'table'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPatron, setSelectedPatron] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Patron Form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCategory, setNewCategory] = useState('Student');
  const [newBranch, setNewBranch] = useState(systemPrefs.branches[0]?.name || 'Main Library');

  const categories = ['All', 'Student', 'Faculty', 'Research Fellow', 'Guest / Visitor'];

  const filteredPatrons = patrons.filter((p) => {
    const q = patronSearch.toLowerCase().trim();
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.cardNum.includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.branch.toLowerCase().includes(q);

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  const handleCreatePatron = (e) => {
    e.preventDefault();
    if (!newName || !newEmail) {
      if (showToast) showToast('Please fill in name and email!', 'warning');
      return;
    }

    const cardNum = '2390' + Math.floor(100000 + Math.random() * 900000);
    const newPatron = {
      id: 'P-' + Math.floor(1000 + Math.random() * 9000),
      cardNum,
      name: newName,
      email: newEmail,
      phone: newPhone || '+1 (555) 000-1122',
      category: newCategory,
      branch: newBranch,
      status: 'Active',
      borrowedCount: 0,
      expiryDate: '2027-12-31',
      avatarColor: 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
    };

    onAddPatron(newPatron);
    if (showToast) {
      showToast(`Issued new Koha library card #${cardNum} to ${newName}!`, 'success');
    }
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
  };

  const totalActiveLoans = patrons.reduce((sum, p) => sum + (Number(p.borrowedCount) || 0), 0);
  const facultyCount = patrons.filter((p) => p.category === 'Faculty').length;
  const studentCount = patrons.filter((p) => p.category === 'Student').length;

  return (
    <div className="patrons-module-container">
      {/* Page Header */}
      <div className="page-header patrons-header-showcase">
        <div>
          <h1 className="page-title">
            <Users size={28} className="text-primary" />
            <span>Koha Patron Registry & Member Cards</span>
          </h1>
          <p className="page-subtitle">
            Manage student & faculty library privileges, issue digital cards, and monitor active borrowing quotas
          </p>
        </div>

        <div className="patron-header-actions">
          {/* Patron View Mode Switcher */}
          <div className="catalog-view-switcher" role="radiogroup">
            <button
              type="button"
              className={`catalog-view-btn ${patronViewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setPatronViewMode('cards')}
              title="Digital Member Cards Grid"
            >
              <Grid size={14} />
              <span>Member Cards</span>
            </button>
            <button
              type="button"
              className={`catalog-view-btn ${patronViewMode === 'table' ? 'active' : ''}`}
              onClick={() => setPatronViewMode('table')}
              title="Registry Data Table"
            >
              <Table size={14} />
              <span>Registry Table</span>
            </button>
          </div>

          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <UserPlus size={16} />
            <span>Register New Patron</span>
          </button>
        </div>
      </div>

      {/* Patron Metric Banner */}
      <div className="catalog-metric-bar">
        <div className="catalog-metric-item">
          <span className="catalog-metric-label">Total Patrons</span>
          <span className="catalog-metric-value">{patrons.length}</span>
        </div>
        <div className="catalog-metric-divider" />
        <div className="catalog-metric-item">
          <span className="catalog-metric-label">Students Enrolled</span>
          <span className="catalog-metric-value text-primary">{studentCount}</span>
        </div>
        <div className="catalog-metric-divider" />
        <div className="catalog-metric-item">
          <span className="catalog-metric-label">Faculty Accounts</span>
          <span className="catalog-metric-value text-success">{facultyCount}</span>
        </div>
        <div className="catalog-metric-divider" />
        <div className="catalog-metric-item">
          <span className="catalog-metric-label">Current Borrowed Items</span>
          <span className="catalog-metric-value">{totalActiveLoans} volumes</span>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="koha-card catalog-search-card">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.6rem' }}
              placeholder="Search patron name, card number (e.g. 239014), email, or branch..."
              value={patronSearch}
              onChange={(e) => setPatronSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="catalog-subject-chips-row">
          <span className="catalog-subject-chip-label">
            <Tag size={13} />
            <span>Category:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`catalog-subject-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'All' ? 'All Member Tiers' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mode 1: Digital Member Cards Grid */}
      {patronViewMode === 'cards' && (
        <div className="patron-cards-grid">
          {filteredPatrons.map((patron) => (
            <div
              key={patron.id}
              className="patron-showcase-card"
              onClick={() => setSelectedPatron(patron)}
            >
              <div className="patron-card-sheen" />
              <div className="patron-showcase-header">
                <div className="patron-showcase-brand">
                  <span className="brand-title">Koha Library Card</span>
                  <span className="brand-sub">{patron.branch}</span>
                </div>
                <span className="patron-category-badge">{patron.category}</span>
              </div>

              {/* EMV Microchip */}
              <div className="patron-emv-chip">
                <div className="chip-lines" />
              </div>

              <div className="patron-showcase-body">
                <div
                  className="patron-showcase-avatar"
                  style={{
                    backgroundColor: patron.avatarColor || 'var(--primary)'
                  }}
                >
                  {patron.name.charAt(0)}
                </div>
                <div className="patron-showcase-info">
                  <h4 className="patron-showcase-name">{patron.name}</h4>
                  <span className="patron-showcase-email">{patron.email}</span>
                  <span className="patron-showcase-expiry">Expires: {patron.expiryDate}</span>
                </div>
              </div>

              <div className="patron-showcase-footer">
                <div className="patron-barcode-box">
                  <div className="barcode-lines">
                    <div className="barcode-bar" style={{ width: '3px' }} />
                    <div className="barcode-bar" style={{ width: '1px' }} />
                    <div className="barcode-bar" style={{ width: '4px' }} />
                    <div className="barcode-bar" style={{ width: '2px' }} />
                    <div className="barcode-bar" style={{ width: '5px' }} />
                    <div className="barcode-bar" style={{ width: '1px' }} />
                    <div className="barcode-bar" style={{ width: '3px' }} />
                  </div>
                  <span className="mono-text barcode-num">{patron.cardNum}</span>
                </div>
                <div className="patron-showcase-loans">
                  <span className="loans-label">Active Loans</span>
                  <span className="loans-count">{patron.borrowedCount} items</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mode 2: High-Density Table */}
      {patronViewMode === 'table' && (
        <div className="table-wrapper">
          <table className="koha-table">
            <thead>
              <tr>
                <th>Library Card #</th>
                <th>Patron Name</th>
                <th>Category</th>
                <th>Home Branch</th>
                <th>Active Loans</th>
                <th>Card Expiry</th>
                <th>Status</th>
                <th>Card Verification</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatrons.map((patron) => (
                <tr key={patron.id} onClick={() => setSelectedPatron(patron)} style={{ cursor: 'pointer' }}>
                  <td>
                    <span className="mono-text table-callno-badge">{patron.cardNum}</span>
                  </td>
                  <td style={{ fontWeight: 700 }}>{patron.name}</td>
                  <td>
                    <span className="badge badge-category">{patron.category}</span>
                  </td>
                  <td>{patron.branch}</td>
                  <td>
                    <strong>{patron.borrowedCount}</strong> items
                  </td>
                  <td>{patron.expiryDate}</td>
                  <td>
                    <span
                      className={`badge ${
                        patron.status === 'Active' ? 'badge-available' : 'badge-loaned'
                      }`}
                    >
                      {patron.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPatron(patron);
                      }}
                    >
                      <CreditCard size={14} />
                      <span>Inspect Card</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add New Patron Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Register New Koha Patron</span>
              <button className="icon-btn" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreatePatron}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Legal Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Maria Santos"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="e.g. msantos@univ.edu"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="+1 (555) 000-0000"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Patron Category</label>
                    <select
                      className="form-select"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    >
                      <option value="Student">Student (Limit: 5)</option>
                      <option value="Faculty">Faculty (Limit: 15)</option>
                      <option value="Research Fellow">Research Fellow</option>
                      <option value="Guest / Visitor">Guest / Visitor</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Home Library Branch</label>
                    <select
                      className="form-select"
                      value={newBranch}
                      onChange={(e) => setNewBranch(e.target.value)}
                    >
                      {systemPrefs.branches.map((b) => (
                        <option key={b.code} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <UserPlus size={16} /> Save & Issue Library Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deluxe Digital Library Card Modal */}
      {selectedPatron && (
        <div className="modal-overlay" onClick={() => setSelectedPatron(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <span className="modal-title">Koha Library Card Verification</span>
              <button className="icon-btn" onClick={() => setSelectedPatron(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="patron-digital-card-preview">
                <div className="patron-card-shine" />
                <div className="patron-card-header">
                  <div className="patron-card-brand">
                    <span className="brand-small">Koha Integrated Library System</span>
                    <span className="brand-branch">{selectedPatron.branch}</span>
                  </div>
                  <span className="patron-tier-badge">{selectedPatron.category}</span>
                </div>

                <div className="patron-emv-chip">
                  <div className="chip-lines" />
                </div>

                <div className="patron-card-body">
                  <div
                    className="patron-avatar-circle"
                    style={{ backgroundColor: selectedPatron.avatarColor || 'var(--primary)' }}
                  >
                    {selectedPatron.name.charAt(0)}
                  </div>
                  <div className="patron-identity-group">
                    <h3 className="patron-full-name">{selectedPatron.name}</h3>
                    <p className="patron-email-text">{selectedPatron.email}</p>
                    <span className="patron-card-expiry">Expires: {selectedPatron.expiryDate}</span>
                  </div>
                </div>

                <div className="patron-card-footer">
                  <div className="patron-barcode-box">
                    <div className="barcode-lines">
                      <div className="barcode-bar" style={{ width: '4px' }} />
                      <div className="barcode-bar" style={{ width: '2px' }} />
                      <div className="barcode-bar" style={{ width: '5px' }} />
                      <div className="barcode-bar" style={{ width: '1px' }} />
                      <div className="barcode-bar" style={{ width: '3px' }} />
                      <div className="barcode-bar" style={{ width: '4px' }} />
                      <div className="barcode-bar" style={{ width: '2px' }} />
                      <div className="barcode-bar" style={{ width: '6px' }} />
                      <div className="barcode-bar" style={{ width: '2px' }} />
                    </div>
                    <div className="mono-text barcode-num">{selectedPatron.cardNum}</div>
                  </div>
                  <div className="patron-quota-meter">
                    <span className="quota-label">Current Loans</span>
                    <span className="quota-val">{selectedPatron.borrowedCount} items</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  window.print();
                  if (showToast) showToast('Sending card to printer...', 'info');
                }}
              >
                <Printer size={16} /> Print Card
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setSelectedPatron(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
