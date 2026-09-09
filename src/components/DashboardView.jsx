import React from 'react';
import {
  BookOpen,
  Repeat,
  AlertTriangle,
  Users,
  DollarSign,
  PlusCircle,
  Search,
  ArrowRight,
  BookmarkCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function DashboardView({
  books,
  patrons,
  transactions,
  setActiveTab,
  onOpenCheckOut,
  onOpenCheckIn,
  onOpenAddBook,
  onOpenAddPatron,
  onSelectBook
}) {
  const totalTitles = books.length;
  const activeLoansCount = transactions.filter((t) => t.status === 'Issued' || t.status === 'Overdue').length;
  const overdueCount = transactions.filter((t) => t.status === 'Overdue').length;
  const totalPatronsCount = patrons.length;
  const totalFines = patrons.reduce((acc, p) => acc + p.fineBalance, 0);

  return (
    <div>
      {/* Page Title & Quick Actions */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <BookOpen size={28} className="text-primary" />
            Library Executive Dashboard
          </h1>
          <p className="page-subtitle">
            Koha Integrated Library System • Main Campus & Branch Operations
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={onOpenCheckOut}>
            <Repeat size={16} />
            Quick Check Out
          </button>

          <button className="btn btn-secondary" onClick={onOpenCheckIn}>
            <CheckCircle2 size={16} />
            Check In Item
          </button>

          <button className="btn btn-secondary" onClick={onOpenAddBook}>
            <PlusCircle size={16} />
            Add MARC Title
          </button>
        </div>
      </div>

      {/* Quick Search Banner */}
      <div className="koha-search-hero">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={18} style={{ color: 'var(--primary)' }} />
            Koha Universal OPAC & Circulation Search
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Search by Barcode, ISBN, Patron Card # or Keyword
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Type book title, barcode (e.g. 399990148201) or patron card (e.g. 2390100491)..."
            style={{ fontSize: '1rem', padding: '0.75rem 1rem' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setActiveTab('catalog');
              }
            }}
          />
          <button className="btn btn-primary" onClick={() => setActiveTab('catalog')}>
            Search Catalog
          </button>
        </div>
      </div>

      {/* Key Metric Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card" style={{ '--stat-color': 'var(--primary)' }}>
          <div>
            <div className="stat-label">Total Catalog Titles</div>
            <div className="stat-value">{totalTitles}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              MARC21 Records in System
            </span>
          </div>
          <div className="stat-icon">
            <BookOpen size={22} />
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': 'var(--warning)' }}>
          <div>
            <div className="stat-label">Active Book Loans</div>
            <div className="stat-value">{activeLoansCount}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Checked out to patrons
            </span>
          </div>
          <div className="stat-icon">
            <Repeat size={22} />
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': 'var(--danger)' }}>
          <div>
            <div className="stat-label">Overdue Circulation</div>
            <div className="stat-value">{overdueCount}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>
              Requires patron notice
            </span>
          </div>
          <div className="stat-icon">
            <AlertTriangle size={22} />
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': 'var(--success)' }}>
          <div>
            <div className="stat-label">Registered Patrons</div>
            <div className="stat-value">{totalPatronsCount}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Students, Faculty, Staff
            </span>
          </div>
          <div className="stat-icon">
            <Users size={22} />
          </div>
        </div>

        <div className="stat-card" style={{ '--stat-color': 'var(--accent-teal)' }}>
          <div>
            <div className="stat-label">Outstanding Fines</div>
            <div className="stat-value">${totalFines.toFixed(2)}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Uncollected balances
            </span>
          </div>
          <div className="stat-icon">
            <DollarSign size={22} />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Transactions & Popular Catalog */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Active Circulation & Overdues Table */}
        <div className="koha-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} className="text-primary" />
              Active Circulation & Overdue Items
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('circulation')}>
              View All
            </button>
          </div>

          <div className="table-wrapper">
            <table className="koha-table">
              <thead>
                <tr>
                  <th>Item Barcode</th>
                  <th>Title</th>
                  <th>Patron</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <span className="mono-text">{tx.itemBarcode}</span>
                    </td>
                    <td style={{ fontWeight: 600, maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tx.bookTitle}
                    </td>
                    <td>{tx.patronName}</td>
                    <td>{tx.dueDate}</td>
                    <td>
                      <span
                        className={`badge ${
                          tx.status === 'Overdue' ? 'badge-overdue' : 'badge-loaned'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Featured Catalog Items Grid */}
        <div className="koha-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookmarkCheck size={18} style={{ color: 'var(--accent-teal)' }} />
              Featured Catalog Holdings
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('catalog')}>
              Explore Catalog
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {books.slice(0, 4).map((book) => (
              <div
                key={book.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
                onClick={() => onSelectBook(book)}
              >
                <div
                  className="book-cover"
                  style={{ background: book.coverColor, flexShrink: 0 }}
                >
                  <span>{book.itemType}</span>
                  <span style={{ fontSize: '0.5rem' }}>{book.year}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {book.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {book.author}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <span className="mono-text" style={{ fontSize: '0.7rem' }}>
                      {book.callNumber}
                    </span>
                    <span className={`badge ${book.availableCopies > 0 ? 'badge-available' : 'badge-loaned'}`}>
                      {book.availableCopies > 0 ? `${book.availableCopies} Copies Available` : 'All Checked Out'}
                    </span>
                  </div>
                </div>
                <ArrowRight size={16} className="text-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
