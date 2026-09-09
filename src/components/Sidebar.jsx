import React from 'react';
import {
  LayoutDashboard,
  Repeat,
  BookOpen,
  FileCode,
  Users,
  Newspaper,
  BarChart3,
  Settings,
  HelpCircle
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, stats }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'circulation', label: 'Circulation', icon: Repeat, badge: stats.activeLoans },
    { id: 'catalog', label: 'Catalog (OPAC)', icon: BookOpen, badge: stats.totalBooks },
    { id: 'marc', label: 'MARC21 Cataloging', icon: FileCode, badge: 'ILS' },
    { id: 'patrons', label: 'Patrons', icon: Users, badge: stats.totalPatrons },
    { id: 'serials', label: 'Serials & Acq.', icon: Newspaper, badge: 'New' },
    { id: 'reports', label: 'Reports & SQL', icon: BarChart3, badge: null },
    { id: 'settings', label: 'Koha Admin', icon: Settings, badge: null }
  ];

  return (
    <aside className="koha-sidebar">
      <div className="nav-group-label">Koha Modules</div>
      {menuItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = activeTab === item.id;
        return (
          <div
            key={item.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <div className="nav-item-left">
              <IconComponent size={18} />
              <span>{item.label}</span>
            </div>
            {item.badge !== null && (
              <span className="nav-item-badge">{item.badge}</span>
            )}
          </div>
        );
      })}

      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <div className="nav-group-label">Koha Documentation</div>
        <a
          href="https://koha-community.org"
          target="_blank"
          rel="noreferrer"
          className="nav-item"
          style={{ textDecoration: 'none' }}
        >
          <div className="nav-item-left">
            <HelpCircle size={18} />
            <span>Koha Manual 24.05</span>
          </div>
        </a>
      </div>
    </aside>
  );
}
