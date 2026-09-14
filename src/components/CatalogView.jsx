import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  PlusCircle,
  FileCode,
  CheckCircle2,
  X,
  Barcode as BarcodeIcon,
  Tag,
  MapPin,
  Repeat,
  Building2,
  Library,
  Sparkles,
  Grid,
  Table,
  Check,
  Bookmark,
  Layers,
  ArrowRight,
  Filter,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

export default function CatalogView({
  books = [],
  searchQuery,
  setSearchQuery,
  onSelectBook,
  onOpenAddBook,
  onOpenCheckOutForItem,
  selectedBook,
  setSelectedBook,
  systemPrefs = { branches: [] },
  effectiveLayout,
  activeLayoutSet
}) {
  // View mode initialized to the active layout set's preferred style, but freely switchable
  const [viewMode, setViewMode] = useState(() => {
    return effectiveLayout?.catalogLayout || 'bookshelf';
  });

  // When user switches layout set via the top navbar, adapt default view mode smoothly
  useEffect(() => {
    if (effectiveLayout?.catalogLayout) {
      setViewMode(effectiveLayout.catalogLayout);
    }
  }, [activeLayoutSet, effectiveLayout?.catalogLayout]);

  // Filter States
  const [filterType, setFilterType] = useState('All');
  const [filterBranch, setFilterBranch] = useState('All');
  const [filterAvailability, setFilterAvailability] = useState('All');
  const [filterSubject, setFilterSubject] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');

  // Modal State
  const [activeModalTab, setActiveModalTab] = useState('details'); // 'details' | 'marc' | 'barcode'
  const [hoveredSpineId, setHoveredSpineId] = useState(null);

  // Extract unique subjects for interactive subject chips
  const allSubjects = Array.from(
    new Set(books.flatMap((b) => b.subjects || []))
  ).slice(0, 7);

  // Filter books logic
  const filteredBooks = books
    .filter((book) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        book.isbn.toLowerCase().includes(q) ||
        book.barcode.includes(q) ||
        book.callNumber.toLowerCase().includes(q) ||
        (book.subjects && book.subjects.some((s) => s.toLowerCase().includes(q)));

      const matchesType = filterType === 'All' || book.itemType === filterType;
      const matchesBranch = filterBranch === 'All' || book.branch === filterBranch;
      const matchesAvail =
        filterAvailability === 'All' ||
        (filterAvailability === 'Available' && book.availableCopies > 0) ||
        (filterAvailability === 'Loaned' && book.availableCopies === 0);

      const matchesSubject =
        filterSubject === 'All' ||
        (book.subjects && book.subjects.includes(filterSubject));

      return matchesSearch && matchesType && matchesBranch && matchesAvail && matchesSubject;
    })
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'author') return a.author.localeCompare(b.author);
      if (sortBy === 'callNumber') return a.callNumber.localeCompare(b.callNumber);
      if (sortBy === 'available') return b.availableCopies - a.availableCopies;
      return 0; // relevance
    });

  // Calculate Collection Statistics
  const totalPhysicalCopies = books.reduce((sum, b) => sum + (Number(b.copies) || 1), 0);
  const totalAvailableCopies = books.reduce((sum, b) => sum + (Number(b.availableCopies) || 0), 0);
  const totalLoanedCopies = totalPhysicalCopies - totalAvailableCopies;

  // Split books for 3D Bookshelf tiers
  const tier1Books = filteredBooks.slice(0, Math.ceil(filteredBooks.length / 2));
  const tier2Books = filteredBooks.slice(Math.ceil(filteredBooks.length / 2));

  return (
    <div className="catalog-experience-container">
      {/* Page Header */}
      <div className="page-header catalog-header-showcase">
        <div className="catalog-header-left">
          <div className="catalog-header-badge">
            <Sparkles size={13} className="catalog-badge-icon" />
            <span>Koha ILS Holdings & Curated OPAC</span>
          </div>
          <h1 className="page-title">
            <BookOpen size={28} className="text-primary" />
            <span>Catalog Holdings & Curated OPAC</span>
          </h1>
          <p className="page-subtitle">
            Explore, inspect, and circulation-issue MARC21 bibliographic records across all campus libraries
          </p>
        </div>

        <div className="catalog-header-actions">
          {/* Universal View Mode Switcher */}
          <div className="catalog-view-switcher" role="radiogroup" aria-label="Catalog Display Mode">
            <button
              type="button"
              className={`catalog-view-btn ${viewMode === 'bookshelf' ? 'active' : ''}`}
              onClick={() => setViewMode('bookshelf')}
              title="Virtual 3D Bookshelf Gallery"
            >
              <Sparkles size={14} />
              <span>3D Bookshelf</span>
              <span className="view-mode-pill">Curated</span>
            </button>
            <button
              type="button"
              className={`catalog-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Curated Showcase Grid Cards"
            >
              <Grid size={14} />
              <span>Gallery Cards</span>
            </button>
            <button
              type="button"
              className={`catalog-view-btn ${viewMode === 'opac' ? 'active' : ''}`}
              onClick={() => setViewMode('opac')}
              title="Academic OPAC Bibliographic Records"
            >
              <BookOpen size={14} />
              <span>OPAC Citation</span>
            </button>
            <button
              type="button"
              className={`catalog-view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="High-Density Executive Data Table"
            >
              <Table size={14} />
              <span>Data Table</span>
            </button>
          </div>

          <button className="btn btn-primary btn-add-record" onClick={onOpenAddBook}>
            <PlusCircle size={16} />
            <span>New Record</span>
          </button>
        </div>
      </div>

      {/* Collection Quick Metric Highlights */}
      <div className="catalog-metric-bar">
        <div className="catalog-metric-item">
          <span className="catalog-metric-label">Bibliographic Titles</span>
          <span className="catalog-metric-value">{books.length}</span>
        </div>
        <div className="catalog-metric-divider" />
        <div className="catalog-metric-item">
          <span className="catalog-metric-label">Total Volumes</span>
          <span className="catalog-metric-value">{totalPhysicalCopies}</span>
        </div>
        <div className="catalog-metric-divider" />
        <div className="catalog-metric-item">
          <span className="catalog-metric-label">Available on Shelf</span>
          <span className="catalog-metric-value text-success">{totalAvailableCopies}</span>
        </div>
        <div className="catalog-metric-divider" />
        <div className="catalog-metric-item">
          <span className="catalog-metric-label">Active Patron Loans</span>
          <span className="catalog-metric-value text-primary">{totalLoanedCopies}</span>
        </div>
        <div className="catalog-metric-divider" />
        <div className="catalog-metric-item">
          <span className="catalog-metric-label">Library Branches</span>
          <span className="catalog-metric-value">{systemPrefs.branches.length || 3}</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="koha-card catalog-search-card">
        <div className="catalog-filter-grid">
          {/* Main Search Input */}
          <div className="catalog-search-field">
            <Search size={18} className="catalog-search-icon" />
            <input
              type="text"
              className="form-input catalog-search-input"
              placeholder="Search by title, author, ISBN, call number, barcode, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="catalog-search-clear-btn"
                onClick={() => setSearchQuery('')}
                title="Clear Search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Item Type */}
          <div className="catalog-select-field">
            <select
              className="form-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              title="Filter by item format"
            >
              <option value="All">All Formats</option>
              <option value="Book">Printed Books</option>
              <option value="Journal">Serials / Journals</option>
              <option value="E-Book">Digital / E-Books</option>
            </select>
          </div>

          {/* Filter Branch */}
          <div className="catalog-select-field">
            <select
              className="form-select"
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              title="Filter by holding branch"
            >
              <option value="All">All Campus Branches</option>
              {systemPrefs.branches.map((b) => (
                <option key={b.code} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Availability */}
          <div className="catalog-select-field">
            <select
              className="form-select"
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value)}
              title="Filter by circulation availability"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available for Loan</option>
              <option value="Loaned">Currently Checked Out</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="catalog-select-field">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              title="Sort Holdings"
            >
              <option value="relevance">Sort: Default Order</option>
              <option value="title">Sort: Title (A-Z)</option>
              <option value="author">Sort: Author (A-Z)</option>
              <option value="callNumber">Sort: Call Number</option>
              <option value="available">Sort: Highest Copies</option>
            </select>
          </div>
        </div>

        {/* Interactive Subject Tag Chips */}
        <div className="catalog-subject-chips-row">
          <span className="catalog-subject-chip-label">
            <Tag size={13} />
            <span>Subject Themes:</span>
          </span>
          <button
            type="button"
            className={`catalog-subject-pill ${filterSubject === 'All' ? 'active' : ''}`}
            onClick={() => setFilterSubject('All')}
          >
            All Themes
          </button>
          {allSubjects.map((sub) => (
            <button
              key={sub}
              type="button"
              className={`catalog-subject-pill ${filterSubject === sub ? 'active' : ''}`}
              onClick={() => setFilterSubject(filterSubject === sub ? 'All' : sub)}
            >
              #{sub}
            </button>
          ))}

          {(filterType !== 'All' ||
            filterBranch !== 'All' ||
            filterAvailability !== 'All' ||
            filterSubject !== 'All' ||
            searchQuery) && (
            <button
              type="button"
              className="catalog-reset-filters-btn"
              onClick={() => {
                setSearchQuery('');
                setFilterType('All');
                setFilterBranch('All');
                setFilterAvailability('All');
                setFilterSubject('All');
              }}
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Header Count */}
      <div className="catalog-results-counter-bar">
        <span>
          Showing <strong>{filteredBooks.length}</strong> of {books.length} bibliographic records
          {filterSubject !== 'All' && <span> under <em>#{filterSubject}</em></span>}
          {filterBranch !== 'All' && <span> at <em>{filterBranch}</em></span>}
        </span>
        <span className="catalog-active-view-indicator">
          View: <strong>{viewMode.toUpperCase()}</strong> mode
        </span>
      </div>

      {/* Empty State when no books match filters */}
      {filteredBooks.length === 0 && (
        <div className="koha-card catalog-empty-state">
          <div className="catalog-empty-icon-wrapper">
            <BookOpen size={48} className="catalog-empty-icon" />
          </div>
          <h3 className="catalog-empty-title">No Bibliographic Holdings Found</h3>
          <p className="catalog-empty-text">
            No library holdings matched your search criteria{' '}
            {searchQuery && <strong>"{searchQuery}"</strong>}. Try modifying keywords, switching
            branches, or resetting active filters.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setSearchQuery('');
              setFilterType('All');
              setFilterBranch('All');
              setFilterAvailability('All');
              setFilterSubject('All');
            }}
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ✦ DISPLAY MODE 1: VIRTUAL 3D BOOKSHELF (Available across ALL styles!)     */}
      {/* ========================================================================= */}
      {filteredBooks.length > 0 && viewMode === 'bookshelf' && (
        <div className="bookshelf-stage">
          {[
            {
              tierName: 'Tier 1 — Core Collection & Systems Architecture',
              booksList: tier1Books,
              tierBadge: 'Main Stacks'
            },
            {
              tierName: 'Tier 2 — Advanced Engineering & Research Holdings',
              booksList: tier2Books,
              tierBadge: 'Research Stacks'
            }
          ].map((tier, tierIdx) => {
            if (tier.booksList.length === 0) return null;
            return (
              <div key={tierIdx} className="bookshelf-tier">
                {/* Shelf Tier Header with Plaque */}
                <div className="bookshelf-shelf-label">
                  <div className="bookshelf-tier-icon-box">
                    <Library size={16} />
                  </div>
                  <div className="bookshelf-tier-text">
                    <span className="bookshelf-tier-title">{tier.tierName}</span>
                    <span className="bookshelf-tier-badge">{tier.tierBadge}</span>
                  </div>
                  <span className="bookshelf-tier-count">
                    {tier.booksList.length} volumes on shelf
                  </span>
                </div>

                {/* The Upright 3D Book Spines Row */}
                <div className="bookshelf-row">
                  {tier.booksList.map((b) => {
                    const spineHeight = 185 + (b.title.length % 5) * 10; // 185px - 225px
                    const spineWidth = 42 + (b.copies % 4) * 4; // 42px - 54px
                    const authorAbbr = b.author
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 3);
                    const isHovered = hoveredSpineId === b.id;

                    return (
                      <div
                        key={b.id}
                        className="book-spine-wrapper"
                        onMouseEnter={() => setHoveredSpineId(b.id)}
                        onMouseLeave={() => setHoveredSpineId(null)}
                        onClick={() => onSelectBook(b)}
                        title={`Click to inspect MARC record for ${b.title}`}
                      >
                        {/* 3D Book Spine */}
                        <div
                          className="book-spine"
                          style={{
                            background: b.coverColor,
                            height: `${spineHeight}px`,
                            width: `${spineWidth}px`
                          }}
                        >
                          <div className="spine-top-accent" />
                          <div className="spine-author-code">{authorAbbr}</div>
                          <div className="spine-vertical-title">{b.title}</div>
                          <div className="spine-callno-sticker">{b.callNumber.slice(0, 8)}</div>
                          <div
                            className={`spine-status-dot ${b.availableCopies > 0 ? 'avail' : 'loan'}`}
                            title={b.availableCopies > 0 ? `${b.availableCopies} available` : 'Checked out'}
                          />
                        </div>

                        {/* Interactive Hover Pullout Floating Card with Direct Actions */}
                        {isHovered && (
                          <div
                            className="bookshelf-floating-card"
                            style={{
                              bottom: `${spineHeight + 14}px`
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="floating-card-header">
                              <div
                                className="floating-card-mini-cover"
                                style={{ background: b.coverColor }}
                              >
                                <span>{b.itemType}</span>
                              </div>
                              <div className="floating-card-title-group">
                                <h4 className="floating-card-title">{b.title}</h4>
                                <div className="floating-card-author">by {b.author}</div>
                              </div>
                            </div>

                            <div className="floating-card-meta-grid">
                              <div className="floating-card-meta-cell">
                                <span className="cell-label">Call Number</span>
                                <span className="cell-val mono-text">{b.callNumber}</span>
                              </div>
                              <div className="floating-card-meta-cell">
                                <span className="cell-label">Location</span>
                                <span className="cell-val">{b.branch}</span>
                              </div>
                              <div className="floating-card-meta-cell">
                                <span className="cell-label">Format / Year</span>
                                <span className="cell-val">{b.itemType} ({b.year})</span>
                              </div>
                              <div className="floating-card-meta-cell">
                                <span className="cell-label">Circulation</span>
                                <span
                                  className="cell-val"
                                  style={{
                                    fontWeight: 700,
                                    color: b.availableCopies > 0 ? 'var(--success)' : 'var(--danger)'
                                  }}
                                >
                                  {b.availableCopies > 0
                                    ? `${b.availableCopies} of ${b.copies} available`
                                    : 'All copies issued'}
                                </span>
                              </div>
                            </div>

                            {/* Direct Action Buttons on Floating Card */}
                            <div className="floating-card-actions">
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectBook(b);
                                }}
                                title="Inspect MARC21 Fields"
                              >
                                <FileCode size={13} />
                                <span>MARC</span>
                              </button>
                              {b.availableCopies > 0 ? (
                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenCheckOutForItem(b);
                                  }}
                                  title="Check out copy to patron"
                                >
                                  <Repeat size={13} />
                                  <span>Issue</span>
                                </button>
                              ) : (
                                <span className="floating-card-loaned-notice">Checked Out</span>
                              )}
                            </div>

                            <div
                              className="floating-card-footer-tip"
                              onClick={() => onSelectBook(b)}
                            >
                              <span>Click spine to view full Koha record</span>
                              <ArrowRight size={11} />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Solid Theme-Adaptive Shelf Base */}
                <div className="bookshelf-wood-shelf">
                  <div className="bookshelf-shelf-lip" />
                  <div className="bookshelf-shelf-glow" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ⊞ DISPLAY MODE 2: CURATED SHOWCASE GRID CARDS (With Wow-Factor Polish)   */}
      {/* ========================================================================= */}
      {filteredBooks.length > 0 && viewMode === 'grid' && (
        <div className="catalog-grid catalog-grid-showcase">
          {filteredBooks.map((book) => {
            const availPct = Math.round((book.availableCopies / (book.copies || 1)) * 100);
            return (
              <div
                key={book.id}
                className="catalog-card catalog-showcase-card"
                onClick={() => onSelectBook(book)}
              >
                {/* Card Top Banner / Badges */}
                <div className="catalog-card-top-bar">
                  <span className="catalog-card-type-chip">{book.itemType}</span>
                  <span
                    className={`badge ${book.availableCopies > 0 ? 'badge-available' : 'badge-loaned'}`}
                  >
                    {book.availableCopies > 0 ? `${book.availableCopies} in library` : 'Checked out'}
                  </span>
                </div>

                {/* 3D Perspective Book Cover & Details */}
                <div className="catalog-card-header">
                  <div className="catalog-card-3d-cover" style={{ background: book.coverColor }}>
                    <div className="cover-spine-edge" />
                    <div className="cover-sheen-overlay" />
                    <span className="cover-item-type">{book.itemType}</span>
                    <span className="cover-year-badge">{book.year}</span>
                  </div>

                  <div className="catalog-card-info">
                    <h3 className="catalog-book-title" title={book.title}>
                      {book.title}
                    </h3>
                    <div className="catalog-book-author">by {book.author}</div>
                    <div className="catalog-book-callno mono-text">{book.callNumber}</div>
                    <div className="catalog-book-branch">
                      <MapPin size={12} />
                      <span>{book.branch}</span>
                    </div>
                  </div>
                </div>

                {/* Holdings Progress Bar */}
                <div className="catalog-card-holdings-bar">
                  <div className="holdings-bar-labels">
                    <span>Available Copies</span>
                    <strong>{book.availableCopies} of {book.copies}</strong>
                  </div>
                  <div className="holdings-bar-track">
                    <div
                      className="holdings-bar-fill"
                      style={{
                        width: `${availPct}%`,
                        background:
                          availPct > 50
                            ? 'var(--success)'
                            : availPct > 0
                            ? 'var(--warning)'
                            : 'var(--danger)'
                      }}
                    />
                  </div>
                </div>

                {/* Subject Chips */}
                {book.subjects && book.subjects.length > 0 && (
                  <div className="catalog-card-subjects">
                    {book.subjects.slice(0, 2).map((s, idx) => (
                      <span key={idx} className="catalog-card-subject-tag">
                        #{s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons Footer */}
                <div className="catalog-card-actions-footer">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm card-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectBook(book);
                    }}
                  >
                    <FileCode size={13} />
                    <span>MARC</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm card-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCheckOutForItem(book);
                    }}
                    disabled={book.availableCopies === 0}
                  >
                    <Repeat size={13} />
                    <span>Issue Loan</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ❖ DISPLAY MODE 3: EXECUTIVE HIGH-DENSITY DATA TABLE                      */}
      {/* ========================================================================= */}
      {filteredBooks.length > 0 && viewMode === 'table' && (
        <div className="table-wrapper catalog-table-showcase-wrapper">
          <table className="koha-table catalog-executive-table">
            <thead>
              <tr>
                <th style={{ width: '48px' }}>Spine</th>
                <th>Title / Publication</th>
                <th>Author</th>
                <th>ISBN</th>
                <th>Call Number</th>
                <th>Barcode</th>
                <th>Holding Branch</th>
                <th>Availability</th>
                <th style={{ width: '150px' }}>Circulation</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr
                  key={book.id}
                  className="catalog-table-row"
                  onClick={() => onSelectBook(book)}
                >
                  <td>
                    {/* Mini 3D Book Spine Thumbnail */}
                    <div
                      className="table-book-mini-spine"
                      style={{ background: book.coverColor }}
                      title={`Open record for ${book.title}`}
                    >
                      <span className="mini-spine-type">{book.itemType[0]}</span>
                    </div>
                  </td>
                  <td>
                    <div className="table-title-cell">
                      <span className="table-book-title">{book.title}</span>
                      <span className="table-book-meta">
                        {book.publisher} ({book.year}) • {book.itemType}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="table-author">{book.author}</span>
                  </td>
                  <td>
                    <span className="mono-text table-isbn">{book.isbn}</span>
                  </td>
                  <td>
                    <span className="mono-text table-callno-badge">{book.callNumber}</span>
                  </td>
                  <td>
                    <span className="mono-text table-barcode">{book.barcode}</span>
                  </td>
                  <td>
                    <span className="table-branch-pill">{book.branch}</span>
                  </td>
                  <td>
                    <span
                      className={`badge table-status-badge ${
                        book.availableCopies > 0 ? 'badge-available' : 'badge-loaned'
                      }`}
                    >
                      <span
                        className={`badge-status-dot ${
                          book.availableCopies > 0 ? 'dot-avail' : 'dot-loan'
                        }`}
                      />
                      {book.availableCopies > 0
                        ? `${book.availableCopies}/${book.copies} Avail`
                        : 'On Loan'}
                    </span>
                  </td>
                  <td>
                    <div className="table-action-btns" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm table-btn"
                        onClick={() => onSelectBook(book)}
                        title="View MARC Bibliographic Record"
                      >
                        MARC
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm table-btn"
                        onClick={() => onOpenCheckOutForItem(book)}
                        disabled={book.availableCopies === 0}
                        title="Issue Loan to Patron"
                      >
                        Issue
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🏛 DISPLAY MODE 4: OPAC DETAILED SCHOLARLY CITATIONS                     */}
      {/* ========================================================================= */}
      {filteredBooks.length > 0 && viewMode === 'opac' && (
        <div className="catalog-opac-view catalog-opac-showcase-view">
          {filteredBooks.map((book) => (
            <div key={book.id} className="koha-opac-card catalog-opac-card-showcase">
              {/* Left Hardcover Column */}
              <div className="opac-cover-col">
                <div
                  className="opac-book-cover opac-hardcover-3d"
                  style={{ background: book.coverColor }}
                  onClick={() => onSelectBook(book)}
                  title={`Open record for ${book.title}`}
                >
                  <div className="opac-cover-ribbon" />
                  <span className="opac-item-pill">{book.itemType}</span>
                  <span className="opac-cover-year">{book.year}</span>
                </div>
                <div className="opac-callno-badge" title={`Call No: ${book.callNumber}`}>
                  {book.callNumber}
                </div>
              </div>

              {/* Right Detailed Metadata Column */}
              <div className="opac-details-col">
                <div className="opac-title-row">
                  <div>
                    <h3
                      className="opac-book-title"
                      onClick={() => onSelectBook(book)}
                      title="Click to view full MARC record"
                    >
                      {book.title}
                    </h3>
                    <div className="opac-author-line">
                      by <strong>{book.author}</strong>
                    </div>
                  </div>
                  <span
                    className={`badge ${book.availableCopies > 0 ? 'badge-available' : 'badge-loaned'}`}
                  >
                    {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Checked out'}
                  </span>
                </div>

                {/* Imprint & Publication Metadata */}
                <div className="opac-meta-line">
                  <span className="opac-meta-item">
                    <Building2 size={13} />
                    <span>{book.publisher || 'Koha Imprint'} ({book.year})</span>
                  </span>
                  <span className="opac-meta-item">
                    <BarcodeIcon size={13} />
                    <span className="mono-text">{book.barcode}</span>
                  </span>
                  <span className="opac-meta-item">
                    <MapPin size={13} />
                    <span>{book.branch} — {book.location || 'General Stacks'}</span>
                  </span>
                  <span className="opac-meta-item">
                    <span>ISBN: {book.isbn}</span>
                  </span>
                </div>

                {/* Subject Tags (Clicking a tag filters the catalog!) */}
                {book.subjects && book.subjects.length > 0 && (
                  <div className="opac-subjects-row">
                    {book.subjects.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`opac-subject-chip ${filterSubject === s ? 'active-chip' : ''}`}
                        onClick={() => setFilterSubject(filterSubject === s ? 'All' : s)}
                        title={`Filter holdings by #${s}`}
                      >
                        #{s}
                      </button>
                    ))}
                  </div>
                )}

                {/* Description Snippet */}
                {book.description && (
                  <p className="opac-desc-snippet">{book.description}</p>
                )}

                {/* Action Footer */}
                <div className="opac-actions-footer">
                  <div className="opac-holdings-tag">
                    <span style={{ color: 'var(--text-muted)' }}>Holdings Status:</span>
                    <strong
                      style={{
                        color: book.availableCopies > 0 ? 'var(--success)' : 'var(--danger)'
                      }}
                    >
                      {book.availableCopies > 0
                        ? `${book.availableCopies} of ${book.copies} copies available at ${book.branch}`
                        : `All ${book.copies} copies currently on loan`}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => onSelectBook(book)}
                    >
                      <FileCode size={14} />
                      <span>MARC Record</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => onOpenCheckOutForItem(book)}
                      disabled={book.availableCopies === 0}
                    >
                      <Repeat size={14} />
                      <span>Check Out Item</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* Book Detail & MARC Viewer Modal                                           */}
      {/* ========================================================================= */}
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
                      style={{
                        background: selectedBook.coverColor,
                        width: '110px',
                        height: '160px',
                        flexShrink: 0,
                        padding: '8px'
                      }}
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

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '0.75rem',
                          background: 'var(--bg-input)',
                          padding: '0.85rem',
                          borderRadius: 'var(--radius-md)',
                          marginBottom: '0.85rem'
                        }}
                      >
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

                  <div
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem'
                    }}
                  >
                    <h4
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: 'var(--text-secondary)',
                        marginBottom: '0.5rem'
                      }}
                    >
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
                      <span
                        className={`badge ${
                          selectedBook.availableCopies > 0 ? 'badge-available' : 'badge-loaned'
                        }`}
                      >
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
