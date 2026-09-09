import React from 'react';
import { Library, Search, Building2, Bell, Sun, Moon, UserCheck } from 'lucide-react';

export default function Navbar({
  systemPrefs,
  selectedBranch,
  setSelectedBranch,
  darkMode,
  setDarkMode,
  searchQuery,
  setSearchQuery,
  searchCategory,
  setSearchCategory,
  onPerformSearch
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onPerformSearch();
    }
  };

  return (
    <header className="koha-navbar">
      {/* Logo and Koha Brand */}
      <div className="brand-section">
        <a href="#dashboard" className="logo-badge">
          <div className="logo-icon-box">
            <Library size={22} />
          </div>
          <div>
            <span>koha</span>
            <span className="logo-tag">NextGen ILS</span>
          </div>
        </a>
      </div>

      {/* Global Koha Quick Search Bar */}
      <div className="nav-search-bar">
        <select
          className="nav-search-select"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
        >
          <option value="catalog">Catalog (OPAC)</option>
          <option value="patron">Patrons</option>
          <option value="barcode">Item Barcode</option>
          <option value="isbn">ISBN / Call #</option>
        </select>
        <input
          type="text"
          className="nav-search-input"
          placeholder="Search Koha catalog, patrons, barcodes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="icon-btn" onClick={onPerformSearch} title="Search">
          <Search size={16} />
        </button>
      </div>

      {/* Header Right Tools */}
      <div className="header-actions">
        {/* Active Branch Selector */}
        <div className="branch-selector">
          <Building2 size={16} className="text-muted" />
          <select
            className="branch-select-dropdown"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            {systemPrefs.branches.map((b) => (
              <option key={b.code} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Notifications */}
        <button className="icon-btn" title="System Notices">
          <Bell size={18} />
          <span className="notification-badge">2</span>
        </button>

        {/* Dark / Light Toggle */}
        <button
          className="icon-btn"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle Theme"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Staff User Chip */}
        <div className="staff-user-chip">
          <div className="staff-avatar">LB</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, lineHeight: 1 }}>
              Librarian Admin
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
              Superuser (Staff)
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
