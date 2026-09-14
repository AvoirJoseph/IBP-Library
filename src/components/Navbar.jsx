import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Building2,
  Bell,
  BookOpen,
  User,
  ChevronDown,
  Check,
  Home,
  Repeat,
  Users,
  FileCode,
  Newspaper,
  BarChart3,
  Settings
} from 'lucide-react';

export default function Navbar({
  systemPrefs,
  selectedBranch,
  setSelectedBranch,
  onNavigateHome,
  onDirectCheckOut,
  onDirectCheckIn,
  onSearchCatalog,
  onSearchPatrons,
  activeLoansCount = 0,
  activeLayoutSet = 'modern-sleek',
  onSelectLayoutSet,
  layoutSets = {},
  effectiveLayout,
  activeTab,
  setActiveTab,
  stats = {}
}) {
  // Universal search state
  const [searchScope, setSearchScope] = useState('catalog');
  const [searchValue, setSearchValue] = useState('');

  // Dropdown state for Layout Style Selector
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Notifications toggle state
  const [showNotices, setShowNotices] = useState(false);

  // Unified search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchValue.trim();
    if (!query) return;

    if (searchScope === 'checkout') {
      onDirectCheckOut(query);
    } else if (searchScope === 'checkin') {
      onDirectCheckIn(query);
    } else if (searchScope === 'patrons') {
      onSearchPatrons(query);
    } else {
      onSearchCatalog(query, 'all');
    }
  };

  const currentSet = layoutSets[activeLayoutSet] || {
    id: 'modern-sleek',
    name: 'Modern Sleek',
    icon: '✦',
    tagline: 'Minimalist whitespace & airy grid cards',
    badge: 'Popular'
  };

  return (
    <header className="modern-header">
      {/* Main Top Bar */}
      <div className="modern-top-bar">
        {/* Modern Brand Logo */}
        <div className="modern-brand" onClick={onNavigateHome} title="Return to Library Home">
          <div className="modern-brand-glyph">
            <BookOpen size={20} />
          </div>
          <div className="modern-brand-info">
            <span className="modern-brand-title">The Philippine Artisan</span>
            <span className="modern-brand-sub">Digital Library</span>
          </div>
        </div>

        {/* Unified Modern Search Input */}
        <form className="modern-search-bar" onSubmit={handleSearchSubmit}>
          <div className="modern-search-scope-wrapper">
            <select
              className="modern-search-scope-select"
              value={searchScope}
              onChange={(e) => setSearchScope(e.target.value)}
              title="Search Scope"
            >
              <option value="catalog">Catalog</option>
              <option value="patrons">Patrons</option>
              <option value="checkout">Check Out</option>
              <option value="checkin">Check In</option>
            </select>
            <ChevronDown size={12} className="modern-scope-chevron" />
          </div>

          <div className="modern-search-input-wrapper">
            <Search size={16} className="modern-search-icon" />
            <input
              type="text"
              className="modern-search-input"
              placeholder={
                searchScope === 'catalog'
                  ? 'Search titles, authors, ISBN, call numbers...'
                  : searchScope === 'patrons'
                  ? 'Search patrons by name, email, or card ID...'
                  : searchScope === 'checkout'
                  ? 'Enter patron card number to check out...'
                  : 'Scan or enter book barcode to return...'
              }
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          <button type="submit" className="modern-search-submit-btn" title="Search">
            <Search size={14} />
            <span>Search</span>
          </button>
        </form>

        {/* Right Utility Controls */}
        <div className="modern-top-right">
          {/* Layout Style Dropdown Selector */}
          <div className="layout-dropdown-wrapper" ref={dropdownRef}>
            <button
              type="button"
              className={`layout-dropdown-trigger ${isDropdownOpen ? 'active' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              title="Select Whole-App Layout Style"
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
            >
              <span className="layout-dropdown-icon">{currentSet.icon}</span>
              <div className="layout-dropdown-text-group">
                <span className="layout-dropdown-caption">Layout Style</span>
                <span className="layout-dropdown-current-name">{currentSet.name}</span>
              </div>
              <ChevronDown size={14} className={`layout-chevron ${isDropdownOpen ? 'rotated' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="layout-dropdown-menu" role="listbox">
                <div className="layout-dropdown-menu-header">
                  <span>SELECT WHOLE-APP LAYOUT</span>
                </div>
                <div className="layout-dropdown-options">
                  {Object.values(layoutSets).map((set) => {
                    const isSelected = activeLayoutSet === set.id;
                    return (
                      <button
                        key={set.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        className={`layout-dropdown-option ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          onSelectLayoutSet && onSelectLayoutSet(set.id);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <span className="option-icon">{set.icon}</span>
                        <div className="option-info">
                          <div className="option-name-row">
                            <span className="option-name">{set.name}</span>
                            <span className="option-badge">{set.badge}</span>
                          </div>
                          <span className="option-tagline">{set.tagline}</span>
                        </div>
                        {isSelected && <Check size={16} className="option-check" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Library Branch Selector */}
          <div className="modern-branch-pill" title="Active Branch">
            <Building2 size={14} className="modern-branch-icon" />
            <select
              className="modern-branch-select"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              {systemPrefs?.branches?.map((b) => (
                <option key={b.code} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="modern-branch-chevron" />
          </div>

          {/* System Notices Popover */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="modern-icon-btn"
              onClick={() => setShowNotices(!showNotices)}
              title="System Notices"
            >
              <Bell size={16} />
              <span className="modern-notice-indicator"></span>
            </button>
            {showNotices && (
              <div className="modern-notices-popover">
                <div className="modern-notices-header">
                  <strong>System Notices</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Today</span>
                </div>
                <div className="modern-notice-item">
                  <div className="modern-notice-item-title">System Health Normal</div>
                  <div className="modern-notice-item-desc">All circulation records and holdings are synced.</div>
                </div>
                <div className="modern-notice-item">
                  <div className="modern-notice-item-title">Active Loans Queue</div>
                  <div className="modern-notice-item-desc">{activeLoansCount} active loans tracked across branches.</div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="modern-user-pill" title="Logged in as Librarian Admin">
            <div className="modern-avatar">
              <User size={14} />
            </div>
            <div className="modern-user-meta">
              <span className="modern-user-name">Librarian</span>
              <span className="modern-user-role">Superuser</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Nav Shell Horizontal Module Navigation Bar */}
      {effectiveLayout?.shellLayout === 'top-nav' && (
        <nav className="modern-sub-nav">
          <div className="modern-sub-nav-inner">
            {[
              { id: 'dashboard', label: 'Home', icon: Home },
              { id: 'catalog', label: 'Catalog', icon: BookOpen, badge: stats?.totalBooks },
              { id: 'circulation', label: 'Circulation', icon: Repeat, badge: stats?.activeLoans },
              { id: 'patrons', label: 'Patrons', icon: Users, badge: stats?.totalPatrons },
              { id: 'marc', label: 'MARC21', icon: FileCode },
              { id: 'serials', label: 'Serials', icon: Newspaper },
              { id: 'reports', label: 'Reports', icon: BarChart3 },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`modern-nav-tab ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab && setActiveTab(item.id)}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge !== null && (
                    <span className="modern-tab-badge">{item.badge}</span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
