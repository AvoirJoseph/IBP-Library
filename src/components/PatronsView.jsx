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
  Printer
} from 'lucide-react';

export default function PatronsView({
  patrons,
  onAddPatron,
  onPayFine,
  systemPrefs,
  showToast
}) {
  const [patronSearch, setPatronSearch] = useState('');
  const [selectedPatron, setSelectedPatron] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Patron Form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCategory, setNewCategory] = useState('Student');
  const [newBranch, setNewBranch] = useState(systemPrefs.branches[0].name);

  const filteredPatrons = patrons.filter((p) =>
    p.name.toLowerCase().includes(patronSearch.toLowerCase()) ||
    p.cardNum.includes(patronSearch) ||
    p.email.toLowerCase().includes(patronSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(patronSearch.toLowerCase())
  );

  const handleCreatePatron = (e) => {
    e.preventDefault();
    if (!newName || !newEmail) {
      showToast('Please fill in name and email!', 'warning');
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
      fineBalance: 0.00,
      expiryDate: '2027-12-31',
      avatarColor: '#0ea5e9'
    };

    onAddPatron(newPatron);
    showToast(`Registered new patron ${newName} with card #${cardNum}!`, 'success');
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Users size={28} className="text-primary" />
            Koha Patron Records & Categories
          </h1>
          <p className="page-subtitle">
            Manage library members, issue cards, track loan privileges and fine balances
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <UserPlus size={16} />
          Register New Patron
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="koha-card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={18}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search patron name, card number, email, or category..."
            value={patronSearch}
            onChange={(e) => setPatronSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Patron Table */}
      <div className="table-wrapper">
        <table className="koha-table">
          <thead>
            <tr>
              <th>Library Card #</th>
              <th>Patron Name</th>
              <th>Category</th>
              <th>Home Branch</th>
              <th>Active Loans</th>
              <th>Fine Balance</th>
              <th>Card Expiry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatrons.map((patron) => (
              <tr key={patron.id}>
                <td><span className="mono-text">{patron.cardNum}</span></td>
                <td style={{ fontWeight: 700 }}>{patron.name}</td>
                <td><span className="badge badge-category">{patron.category}</span></td>
                <td>{patron.branch}</td>
                <td><strong>{patron.borrowedCount}</strong> items</td>
                <td>
                  <span style={{ color: patron.fineBalance > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 700 }}>
                    ${patron.fineBalance.toFixed(2)}
                  </span>
                </td>
                <td>{patron.expiryDate}</td>
                <td>
                  <span className={`badge ${patron.status === 'Active' ? 'badge-available' : 'badge-overdue'}`}>
                    {patron.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedPatron(patron)}
                  >
                    <CreditCard size={14} /> Library Card
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
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

      {/* Digital Library Card Visualizer Modal */}
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
              <div
                style={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                  border: '1px solid #38bdf8',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  color: 'white',
                  position: 'relative',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#38bdf8', fontWeight: 800 }}>
                      Koha Integrated Library System
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 800 }}>{selectedPatron.branch}</div>
                  </div>
                  <span className="badge badge-category">{selectedPatron.category}</span>
                </div>

                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: selectedPatron.avatarColor || '#0ea5e9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.4rem'
                    }}
                  >
                    {selectedPatron.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedPatron.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{selectedPatron.email}</p>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Expires: {selectedPatron.expiryDate}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'center', backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: '8px' }}>
                  <div className="barcode-lines">
                    <div className="barcode-bar" style={{ width: '4px' }}></div>
                    <div className="barcode-bar" style={{ width: '2px' }}></div>
                    <div className="barcode-bar" style={{ width: '5px' }}></div>
                    <div className="barcode-bar" style={{ width: '1px' }}></div>
                    <div className="barcode-bar" style={{ width: '3px' }}></div>
                    <div className="barcode-bar" style={{ width: '4px' }}></div>
                    <div className="barcode-bar" style={{ width: '2px' }}></div>
                    <div className="barcode-bar" style={{ width: '6px' }}></div>
                    <div className="barcode-bar" style={{ width: '2px' }}></div>
                  </div>
                  <div className="barcode-text">{selectedPatron.cardNum}</div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  window.print();
                  showToast('Printing Library Card...', 'info');
                }}
              >
                <Printer size={16} /> Print Card
              </button>
              <button className="btn btn-primary" onClick={() => setSelectedPatron(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
