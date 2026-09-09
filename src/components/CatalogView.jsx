import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Grid,
  List,
  PlusCircle,
  FileCode,
  CheckCircle2,
  X,
  Barcode as BarcodeIcon,
  Tag,
  MapPin,
  BookmarkPlus
} from 'lucide-react';

export default function CatalogView({
  books,
  searchQuery,
  setSearchQuery,
  onSelectBook,
  onOpenAddBook,
  onOpenCheckOutForItem,
  selectedBook,
  setSelectedBook,
  systemPrefs
}) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [filterType, setFilterType] = useState('All');
  const [filterBranch, setFilterBranch] = useState('All');
  const [filterAvailability, setFilterAvailability] = useState('All');
  const [activeModalTab, setActiveModalTab] = useState('details'); // 'details' | 'marc' | 'barcode'

  // Filter books logic
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.barcode.includes(searchQuery) ||
      book.callNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'All' || book.itemType === filterType;
    const matchesBranch = filterBranch === 'All' || book.branch === filterBranch;
    const matchesAvail =
      filterAvailability === 'All' ||
      (filterAvailability === 'Available' && book.availableCopies > 0) ||
      (filterAvailability === 'Loaned' && book.availableCopies === 0);

    return matchesSearch && matchesType && matchesBranch && matchesAvail;
  });

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <BookOpen size={28} className="text-primary" />
            Catalog Holdings & OPAC
          </h1>
          <p className="page-subtitle">
            Search, filter, and inspect MARC21 bibliographic items across all branches
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenAddBook}>
          <PlusCircle size={16} />
          New Bibliographic Record
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="koha-card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Main Search Input */}
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search by title, author, ISBN, call number, or barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Item Type */}
          <div style={{ width: '150px' }}>
            <select
              className="form-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Item Types</option>
              <option value="Book">Book</option>
              <option value="Journal">Journal</option>
              <option value="E-Book">E-Book</option>
            </select>
          </div>

          {/* Filter Branch */}
          <div style={{ width: '180px' }}>
            <select
              className="form-select"
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
            >
              <option value="All">All Library Branches</option>
              {systemPrefs.branches.map((b) => (
                <option key={b.code} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Availability */}
          <div style={{ width: '150px' }}>
            <select
              className="form-select"
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available Only</option>
              <option value="Loaned">Checked Out Only</option>
            </select>
          </div>

          {/* Grid vs Table View Mode Switcher */}
          <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: 'var(--bg-input)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button
              className={`icon-btn ${viewMode === 'grid' ? 'active' : ''}`}
              style={{ width: '32px', height: '32px' }}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid size={16} />
            </button>
            <button
              className={`icon-btn ${viewMode === 'table' ? 'active' : ''}`}
              style={{ width: '32px', height: '32px' }}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Catalog Display */}
      {viewMode === 'grid' ? (
        <div className="catalog-grid">
          {filteredBooks.map((book) => (
            <div key={book.id} className="catalog-card" onClick={() => onSelectBook(book)}>
              <div className="catalog-card-header">
                <div
                  className="catalog-card-cover book-cover"
                  style={{ background: book.coverColor }}
                >
                  <span style={{ fontSize: '0.6rem' }}>{book.itemType}</span>
                  <span style={{ fontSize: '0.55rem' }}>{book.year}</span>
                </div>
                <div className="catalog-card-info">
                  <h3 className="catalog-book-title">{book.title}</h3>
                  <div className="catalog-book-author">{book.author}</div>
                  <span className="mono-text" style={{ fontSize: '0.75rem' }}>
                    {book.callNumber}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className={`badge ${book.availableCopies > 0 ? 'badge-available' : 'badge-loaned'}`}>
                  {book.availableCopies > 0 ? `Available (${book.availableCopies}/${book.copies})` : 'On Loan'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {book.branch}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="koha-table">
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title / Subtitle</th>
                <th>Author</th>
                <th>ISBN</th>
                <th>Call Number</th>
                <th>Barcode</th>
                <th>Holding Branch</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id}>
                  <td>
                    <div className="book-cover" style={{ background: book.coverColor, width: '32px', height: '44px' }}>
                      <span style={{ fontSize: '0.45rem' }}>{book.itemType}</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700 }}>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.isbn}</td>
                  <td><span className="mono-text">{book.callNumber}</span></td>
                  <td><span className="mono-text">{book.barcode}</span></td>
                  <td>{book.branch}</td>
                  <td>
                    <span className={`badge ${book.availableCopies > 0 ? 'badge-available' : 'badge-loaned'}`}>
                      {book.availableCopies > 0 ? `Available (${book.availableCopies})` : 'On Loan'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onSelectBook(book)}
                    >
                      View MARC
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Book Detail & MARC Viewer Modal */}
      {selectedBook && (
        <div className="modal-overlay" onClick={() => setSelectedBook(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <BookOpen size={20} className="text-primary" />
                <span className="modal-title">Koha Bibliographic Record — {selectedBook.id}</span>
              </div>
              <button className="icon-btn" onClick={() => setSelectedBook(null)}>
                <X size={18} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="tabs-header" style={{ padding: '0 1.5rem', marginTop: '1rem', marginBottom: '1rem' }}>
              <button
                className={`tab-btn ${activeModalTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveModalTab('details')}
              >
                Bibliographic Summary
              </button>
              <button
                className={`tab-btn ${activeModalTab === 'marc' ? 'active' : ''}`}
                onClick={() => setActiveModalTab('marc')}
              >
                MARC21 Standard Tag View
              </button>
              <button
                className={`tab-btn ${activeModalTab === 'barcode' ? 'active' : ''}`}
                onClick={() => setActiveModalTab('barcode')}
              >
                Item Barcode & Tag
              </button>
            </div>

            <div className="modal-body">
              {activeModalTab === 'details' && (
                <div>
                  <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div
                      className="book-cover"
                      style={{ background: selectedBook.coverColor, width: '110px', height: '160px', flexShrink: 0, padding: '8px' }}
                    >
                      <span style={{ fontSize: '0.8rem' }}>{selectedBook.itemType}</span>
                      <span style={{ fontSize: '0.7rem' }}>{selectedBook.year}</span>
                    </div>

                    <div>
                      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.35rem', lineHeight: 1.2 }}>
                        {selectedBook.title}
                      </h2>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                        By <strong>{selectedBook.author}</strong> • Published by {selectedBook.publisher} ({selectedBook.year})
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: 'var(--bg-input)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '0.85rem' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ISBN</div>
                          <div style={{ fontWeight: 600 }}>{selectedBook.isbn}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Call Number</div>
                          <div className="mono-text">{selectedBook.callNumber}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Item Barcode</div>
                          <div className="mono-text">{selectedBook.barcode}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location / Shelving</div>
                          <div style={{ fontWeight: 600 }}>{selectedBook.location}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {selectedBook.subjects?.map((sub, i) => (
                          <span key={i} className="badge badge-category">
                            <Tag size={12} /> {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      Koha Copy Availability Details
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span>Holding Branch: <strong>{selectedBook.branch}</strong></span>
                        <br />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          Total Copies: {selectedBook.copies} • Available to Issue: {selectedBook.availableCopies}
                        </span>
                      </div>
                      <span className={`badge ${selectedBook.availableCopies > 0 ? 'badge-available' : 'badge-loaned'}`}>
                        {selectedBook.availableCopies > 0 ? 'In Library' : 'All Issued'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeModalTab === 'marc' && (
                <div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Koha MARC21 Bibliographic Field Tags (ISO 2709 standard format):
                  </p>
                  <table className="marc-table">
                    <thead>
                      <tr>
                        <th>Tag</th>
                        <th>Ind 1</th>
                        <th>Ind 2</th>
                        <th>Subfield Data ($a, $b, $c, $h, $p)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBook.marc?.map((m, idx) => (
                        <tr key={idx}>
                          <td className="marc-tag">{m.tag}</td>
                          <td>{m.ind1}</td>
                          <td>{m.ind2}</td>
                          <td style={{ color: 'var(--text-primary)' }}>{m.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeModalTab === 'barcode' && (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                    Koha Item Spine Label & Circulation Barcode
                  </h4>
                  <div className="barcode-visual">
                    <div className="barcode-lines">
                      <div className="barcode-bar" style={{ width: '3px' }}></div>
                      <div className="barcode-bar" style={{ width: '1px' }}></div>
                      <div className="barcode-bar" style={{ width: '4px' }}></div>
                      <div className="barcode-bar" style={{ width: '2px' }}></div>
                      <div className="barcode-bar" style={{ width: '5px' }}></div>
                      <div className="barcode-bar" style={{ width: '1px' }}></div>
                      <div className="barcode-bar" style={{ width: '3px' }}></div>
                      <div className="barcode-bar" style={{ width: '4px' }}></div>
                      <div className="barcode-bar" style={{ width: '2px' }}></div>
                      <div className="barcode-bar" style={{ width: '6px' }}></div>
                      <div className="barcode-bar" style={{ width: '1px' }}></div>
                      <div className="barcode-bar" style={{ width: '3px' }}></div>
                      <div className="barcode-bar" style={{ width: '2px' }}></div>
                    </div>
                    <div className="barcode-text">{selectedBook.barcode}</div>
                  </div>
                  <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Call #: <strong>{selectedBook.callNumber}</strong> • Location: <strong>{selectedBook.location}</strong>
                  </p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedBook(null)}>
                Close
              </button>
              {selectedBook.availableCopies > 0 && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    onOpenCheckOutForItem(selectedBook);
                    setSelectedBook(null);
                  }}
                >
                  <CheckCircle2 size={16} />
                  Issue / Check Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
