import React, { useState } from 'react';
import {
  Search,
  Building2,
  Bell,
  Sun,
  Moon,
  Repeat,
  CheckCircle2,
  RefreshCw,
  Users,
  BookOpen,
  HelpCircle,
  ShoppingCart,
  ListFilter,
  User
} from 'lucide-react';

export default function Navbar({
  systemPrefs,
  selectedBranch,
  setSelectedBranch,
  darkMode,
  setDarkMode,
  onNavigateHome,
  onDirectCheckOut,
  onDirectCheckIn,
  onDirectRenew,
  onSearchCatalog,
  onSearchPatrons,
  activeLoansCount = 0
}) {
  // Koha Staff Search Bar Tabs: 'checkout' | 'checkin' | 'renew' | 'catalog' | 'patrons'
  const [activeSearchTab, setActiveSearchTab] = useState('catalog');

  // Input states for each search tab
  const [checkoutInput, setCheckoutInput] = useState('');
  const [checkinInput, setCheckinInput] = useState('');
  const [renewInput, setRenewInput] = useState('');
  const [catalogInput, setCatalogInput] = useState('');
  const [catalogField, setCatalogField] = useState('all');
  const [patronInput, setPatronInput] = useState('');

  // Notifications toggle/popover state
  const [showNotices, setShowNotices] = useState(false);

  // Form submission handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (activeSearchTab === 'checkout') {
      if (checkoutInput.trim()) {
        onDirectCheckOut(checkoutInput.trim());
      }
    } else if (activeSearchTab === 'checkin') {
      if (checkinInput.trim()) {
        onDirectCheckIn(checkinInput.trim());
      }
    } else if (activeSearchTab === 'renew') {
      if (renewInput.trim()) {
        onDirectRenew(renewInput.trim());
      }
    } else if (activeSearchTab === 'catalog') {
      onSearchCatalog(catalogInput.trim(), catalogField);
    } else if (activeSearchTab === 'patrons') {
      onSearchPatrons(patronInput.trim());
    }
  };

  return (
    <header className="koha-staff-header">
      {/* Top Utility Bar */}
      <div className="koha-top-utility">
        {/* Koha Logo & Brand */}
        <div className="koha-brand-container" onClick={onNavigateHome} title="Go to Koha Staff Home">
          <div className="koha-logo">
            <span className="koha-text">koha</span>
            <span className="koha-dot"></span>
          </div>
          <div className="koha-brand-meta">
            <span className="koha-tagline">staff client</span>
            <span className="koha-ver">v24.05 ILS</span>
          </div>
        </div>

        {/* Top Center Quick Info / Branch Selector */}
        <div className="koha-top-center">
          <div className="koha-location-badge" title="Active Koha Circulation Branch">
            <Building2 size={15} className="koha-location-icon" />
            <span className="koha-location-label">Library:</span>
            <select
              className="koha-branch-dropdown"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              {systemPrefs.branches.map((b) => (
                <option key={b.code} value={b.name}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Top Right Staff Tools */}
        <div className="koha-top-right">
          {/* Quick Staff Links: Cart & Lists */}
          <div className="koha-header-links">
            <button
              className="koha-top-btn"
              onClick={() => onSearchCatalog('', 'all')}
              title="View Library Cart"
            >
              <ShoppingCart size={15} />
              <span>Cart</span>
              <span className="koha-mini-pill">0</span>
            </button>

            <button
              className="koha-top-btn"
              onClick={() => onSearchCatalog('', 'all')}
              title="Public and Staff Lists"
            >
              <ListFilter size={15} />
              <span>Lists</span>
            </button>
          </div>

          {/* System Notices Notification */}
          <div style={{ position: 'relative' }}>
            <button
              className="koha-icon-tool-btn"
              onClick={() => setShowNotices(!showNotices)}
              title="Staff System Notices"
            >
              <Bell size={16} />
              <span className="koha-notice-badge">2</span>
            </button>
            {showNotices && (
              <div className="koha-notices-dropdown">
                <div className="koha-notices-header">
                  <strong>Staff Notices & Broadcasts</strong>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>Today</span>
                </div>
                <div className="koha-notice-item">
                  <div className="koha-notice-title">Koha Nightly Cron Completed</div>
                  <div className="koha-notice-desc">Circulation logs synced; catalog records refreshed automatically.</div>
                </div>
                <div className="koha-notice-item">
                  <div className="koha-notice-title">Hold Requests Pending</div>
                  <div className="koha-notice-desc">{activeLoansCount} active loans tracked at {selectedBranch}.</div>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle (Classic Koha Light / Modern Dark) */}
          <button
            className="koha-icon-tool-btn"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch to Classic Koha Light Theme' : 'Switch to Dark Theme'}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Koha Manual Help */}
          <a
            href="https://koha-community.org/documentation/"
            target="_blank"
            rel="noreferrer"
            className="koha-top-btn"
            title="Open Koha Staff Manual"
          >
            <HelpCircle size={15} />
            <span>Help</span>
          </a>

          {/* Logged in Staff Badge */}
          <div className="koha-staff-badge" title="Logged in as Superuser Staff">
            <div className="koha-staff-avatar">
              <User size={14} />
            </div>
            <div className="koha-staff-info">
              <span className="koha-staff-name">Librarian Admin</span>
              <span className="koha-staff-role">Superuser</span>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Multi-Tab Koha Staff Search Bar */}
      <div className="koha-persistent-search">
        <div className="koha-search-tabs">
          <button
            type="button"
            className={`koha-tab-btn ${activeSearchTab === 'checkout' ? 'active' : ''}`}
            onClick={() => setActiveSearchTab('checkout')}
          >
            <Repeat size={14} />
            <span>Check out</span>
          </button>

          <button
            type="button"
            className={`koha-tab-btn ${activeSearchTab === 'checkin' ? 'active' : ''}`}
            onClick={() => setActiveSearchTab('checkin')}
          >
            <CheckCircle2 size={14} />
            <span>Check in</span>
          </button>

          <button
            type="button"
            className={`koha-tab-btn ${activeSearchTab === 'renew' ? 'active' : ''}`}
            onClick={() => setActiveSearchTab('renew')}
          >
            <RefreshCw size={14} />
            <span>Renew</span>
          </button>

          <button
            type="button"
            className={`koha-tab-btn ${activeSearchTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveSearchTab('catalog')}
          >
            <BookOpen size={14} />
            <span>Search the catalog</span>
          </button>

          <button
            type="button"
            className={`koha-tab-btn ${activeSearchTab === 'patrons' ? 'active' : ''}`}
            onClick={() => setActiveSearchTab('patrons')}
          >
            <Users size={14} />
            <span>Search patrons</span>
          </button>
        </div>

        {/* Tab Search Form Inputs */}
        <form className="koha-search-form" onSubmit={handleSearchSubmit}>
          {activeSearchTab === 'checkout' && (
            <div className="koha-form-row">
              <label htmlFor="checkout-input" className="koha-input-prefix">
                Check out to:
              </label>
              <input
                id="checkout-input"
                type="text"
                className="koha-search-input"
                placeholder="Enter patron card number (e.g. 2390100491) or surname..."
                value={checkoutInput}
                onChange={(e) => setCheckoutInput(e.target.value)}
                autoFocus
              />
              <button type="submit" className="koha-btn-submit koha-btn-checkout">
                <Repeat size={15} />
                <span>Check out</span>
              </button>
            </div>
          )}

          {activeSearchTab === 'checkin' && (
            <div className="koha-form-row">
              <label htmlFor="checkin-input" className="koha-input-prefix">
                Scan barcode:
              </label>
              <input
                id="checkin-input"
                type="text"
                className="koha-search-input"
                placeholder="Scan or enter item barcode (e.g. 399990148201)..."
                value={checkinInput}
                onChange={(e) => setCheckinInput(e.target.value)}
                autoFocus
              />
              <button type="submit" className="koha-btn-submit koha-btn-checkin">
                <CheckCircle2 size={15} />
                <span>Check in</span>
              </button>
            </div>
          )}

          {activeSearchTab === 'renew' && (
            <div className="koha-form-row">
              <label htmlFor="renew-input" className="koha-input-prefix">
                Renew barcode:
              </label>
              <input
                id="renew-input"
                type="text"
                className="koha-search-input"
                placeholder="Scan or enter item barcode to renew loan..."
                value={renewInput}
                onChange={(e) => setRenewInput(e.target.value)}
                autoFocus
              />
              <button type="submit" className="koha-btn-submit koha-btn-renew">
                <RefreshCw size={15} />
                <span>Renew</span>
              </button>
            </div>
          )}

          {activeSearchTab === 'catalog' && (
            <div className="koha-form-row">
              <select
                className="koha-field-select"
                value={catalogField}
                onChange={(e) => setCatalogField(e.target.value)}
              >
                <option value="all">Keyword</option>
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="subject">Subject</option>
                <option value="isbn">ISBN</option>
                <option value="callnum">Call Number</option>
              </select>
              <input
                type="text"
                className="koha-search-input"
                placeholder="Search the Koha catalog (e.g., Computer Science, Gatsby, 978-013)..."
                value={catalogInput}
                onChange={(e) => setCatalogInput(e.target.value)}
              />
              <button type="submit" className="koha-btn-submit koha-btn-search">
                <Search size={15} />
                <span>Search</span>
              </button>
            </div>
          )}

          {activeSearchTab === 'patrons' && (
            <div className="koha-form-row">
              <input
                type="text"
                className="koha-search-input"
                placeholder="Search patrons by name, card number (e.g. 2390100491), or email..."
                value={patronInput}
                onChange={(e) => setPatronInput(e.target.value)}
                autoFocus
              />
              <button type="submit" className="koha-btn-submit koha-btn-search">
                <Search size={15} />
                <span>Search patrons</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </header>
  );
}
