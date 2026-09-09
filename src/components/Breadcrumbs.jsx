import React from 'react';
import { Home, ChevronRight } from 'lucide-react';

export default function Breadcrumbs({
  activeTab,
  onNavigateHome,
  circSubTab,
  selectedBookTitle
}) {
  const tabNames = {
    dashboard: 'Koha Home',
    circulation: 'Circulation',
    patrons: 'Patrons',
    catalog: 'Catalog (OPAC)',
    marc: 'MARC21 Cataloging',
    serials: 'Serials & Acquisitions',
    reports: 'Reports & Guided SQL',
    settings: 'Koha Administration'
  };

  const circSubTabNames = {
    checkout: 'Check Out (Issue)',
    checkin: 'Check In (Return)',
    holds: 'Holds & Reserves Queue'
  };

  return (
    <nav className="koha-breadcrumbs-bar" aria-label="Breadcrumb">
      <div className="koha-breadcrumbs-container">
        {/* Home button */}
        <button
          type="button"
          className="koha-crumb-link"
          onClick={onNavigateHome}
          title="Return to Koha Staff Home"
        >
          <Home size={14} />
          <span>Home</span>
        </button>

        {activeTab !== 'dashboard' && (
          <>
            <ChevronRight size={13} className="koha-crumb-sep" />
            <span
              className={`koha-crumb-item ${
                !circSubTab || activeTab !== 'circulation' ? 'active' : ''
              }`}
            >
              {tabNames[activeTab] || activeTab}
            </span>
          </>
        )}

        {activeTab === 'circulation' && circSubTab && (
          <>
            <ChevronRight size={13} className="koha-crumb-sep" />
            <span className="koha-crumb-item active">
              {circSubTabNames[circSubTab] || circSubTab}
            </span>
          </>
        )}

        {activeTab === 'catalog' && selectedBookTitle && (
          <>
            <ChevronRight size={13} className="koha-crumb-sep" />
            <span className="koha-crumb-item active" style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {selectedBookTitle}
            </span>
          </>
        )}
      </div>
    </nav>
  );
}
