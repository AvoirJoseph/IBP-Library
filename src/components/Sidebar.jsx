import React from 'react';
import {
  Home,
  Repeat,
  BookOpen,
  FileCode,
  Users,
  Newspaper,
  BarChart3,
  Settings,
  HelpCircle,
  CheckCircle2,
  BookmarkCheck,
  PlusCircle,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  stats,
  circSubTab,
  setCircSubTab,
  onOpenAddBook,
  onOpenAddPatron
}) {
  const modules = [
    { id: 'dashboard', label: 'Koha Home', icon: Home, badge: null },
    { id: 'circulation', label: 'Circulation', icon: Repeat, badge: stats.activeLoans },
    { id: 'patrons', label: 'Patrons', icon: Users, badge: stats.totalPatrons },
    { id: 'catalog', label: 'Catalog (OPAC)', icon: BookOpen, badge: stats.totalBooks },
    { id: 'marc', label: 'MARC21 Cataloging', icon: FileCode, badge: 'MARC' },
    { id: 'serials', label: 'Serials & Acq.', icon: Newspaper, badge: 'Active' },
    { id: 'reports', label: 'Reports & SQL', icon: BarChart3, badge: null },
    { id: 'settings', label: 'Koha Admin', icon: Settings, badge: null }
  ];

  return (
    <aside className="koha-staff-sidebar">
      {/* Sidebar Header / Module Title */}
      <div className="koha-sidebar-heading">
        <span>STAFF MODULES</span>
      </div>

      {/* Main Module List */}
      <nav className="koha-nav-list">
        {modules.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div key={item.id} className="koha-nav-item-wrapper">
              <button
                type="button"
                className={`koha-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <div className="koha-nav-label-group">
                  <Icon size={17} className="koha-nav-icon" />
                  <span className="koha-nav-text">{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className="koha-nav-pill">{item.badge}</span>
                )}
              </button>

              {/* Contextual Submenu when active */}
              {isActive && item.id === 'circulation' && (
                <div className="koha-subnav-list">
                  <button
                    type="button"
                    className={`koha-subnav-item ${circSubTab === 'checkout' ? 'active' : ''}`}
                    onClick={() => setCircSubTab && setCircSubTab('checkout')}
                  >
                    <ChevronRight size={13} />
                    <span>Check out</span>
                  </button>
                  <button
                    type="button"
                    className={`koha-subnav-item ${circSubTab === 'checkin' ? 'active' : ''}`}
                    onClick={() => setCircSubTab && setCircSubTab('checkin')}
                  >
                    <ChevronRight size={13} />
                    <span>Check in</span>
                  </button>
                  <button
                    type="button"
                    className={`koha-subnav-item ${circSubTab === 'holds' ? 'active' : ''}`}
                    onClick={() => setCircSubTab && setCircSubTab('holds')}
                  >
                    <ChevronRight size={13} />
                    <span>Holds queue</span>
                  </button>
                </div>
              )}

              {isActive && item.id === 'catalog' && (
                <div className="koha-subnav-list">
                  <button
                    type="button"
                    className="koha-subnav-item"
                    onClick={() => onOpenAddBook && onOpenAddBook()}
                  >
                    <PlusCircle size={13} />
                    <span>+ New MARC Record</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer with Koha System Details */}
      <div className="koha-sidebar-footer">
        <div className="koha-system-info-card">
          <div className="koha-system-info-title">
            <span>Koha ILS 24.05.00</span>
          </div>
          <div className="koha-system-info-meta">
            <span>Database: ISO 2709 / SQL</span>
            <span>Staff Client Intranet</span>
          </div>
          <a
            href="https://koha-community.org"
            target="_blank"
            rel="noreferrer"
            className="koha-community-link"
          >
            <span>Koha Community</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </aside>
  );
}
