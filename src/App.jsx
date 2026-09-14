import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Breadcrumbs from './components/Breadcrumbs';
import DashboardView from './components/DashboardView';
import CatalogView from './components/CatalogView';
import CirculationView from './components/CirculationView';
import MarcEditorView from './components/MarcEditorView';
import PatronsView from './components/PatronsView';
import SerialsView from './components/SerialsView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import AddBookModal from './components/AddBookModal';
import Toast from './components/Toast';

import {
  INITIAL_BOOKS,
  INITIAL_PATRONS,
  INITIAL_TRANSACTIONS,
  KOHA_SYSTEM_PREFS
} from './mockData';

export const LAYOUT_SETS = {
  'showcase': {
    id: 'showcase',
    name: 'Curated Showcase',
    icon: '✦',
    tagline: 'Contemporary gallery layout, 3D virtual bookshelf, illuminated pedestals, and visual analytics',
    shellLayout: 'top-nav',
    density: 'spacious',
    themeStyle: 'emerald',
    catalogLayout: 'bookshelf',
    dashboardLayout: 'analytics',
    badge: 'Flagship'
  },
  'modern-sleek': {
    id: 'modern-sleek',
    name: 'Modern Sleek',
    icon: '❖',
    tagline: 'Minimalist whitespace, floating top navigation, and airy modern grid cards',
    shellLayout: 'top-nav',
    density: 'spacious',
    themeStyle: 'modern-sleek',
    catalogLayout: 'grid',
    dashboardLayout: 'launchpad',
    badge: 'Popular'
  },
  'executive': {
    id: 'executive',
    name: 'Executive Workspace',
    icon: '◈',
    tagline: 'Streamlined 68px rail, circulation desk operations, and clean tabular data',
    shellLayout: 'compact-rail',
    density: 'spacious',
    themeStyle: 'oxford',
    catalogLayout: 'table',
    dashboardLayout: 'operational',
    badge: 'Productivity'
  },
  'academic': {
    id: 'academic',
    name: 'Academic Editorial',
    icon: '🏛',
    tagline: 'Classic 240px sidebar, regal plum palette, and detailed OPAC MARC citations',
    shellLayout: 'sidebar',
    density: 'spacious',
    themeStyle: 'plum',
    catalogLayout: 'opac',
    dashboardLayout: 'launchpad',
    badge: 'Scholarly'
  }
};

export default function App() {
  // Main Data States
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [patrons, setPatrons] = useState(INITIAL_PATRONS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [systemPrefs, setSystemPrefs] = useState(KOHA_SYSTEM_PREFS);

  // App Unified Layout Set State with LocalStorage Persistence (Defaults to Curated Showcase)
  const [activeLayoutSet, setActiveLayoutSet] = useState(() => {
    try {
      const saved = localStorage.getItem('koha_active_layout_set');
      // If user had previous default or not saved, default to showcase
      if (!saved || saved === 'modern-sleek') {
        return 'showcase';
      }
      return LAYOUT_SETS[saved] ? saved : 'showcase';
    } catch {
      return 'showcase';
    }
  });

  const effectiveLayout = LAYOUT_SETS[activeLayoutSet] || LAYOUT_SETS['showcase'];

  useEffect(() => {
    try {
      localStorage.setItem('koha_active_layout_set', activeLayoutSet);
    } catch (err) {
      console.error(err);
    }
  }, [activeLayoutSet]);

  // App UI States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [circSubTab, setCircSubTab] = useState('checkout');
  const [incomingBarcode, setIncomingBarcode] = useState('');
  const [incomingPatron, setIncomingPatron] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('Main Library');

  // Search Bar States
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Selected Objects
  const [selectedBook, setSelectedBook] = useState(null);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [preselectedCheckOutBook, setPreselectedCheckOutBook] = useState(null);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleSelectLayoutSet = (setId) => {
    if (LAYOUT_SETS[setId]) {
      setActiveLayoutSet(setId);
      showToast(`Activated layout style: ${LAYOUT_SETS[setId].name}`, 'info');
    }
  };

  // Enforce Light Mode on body with active palette and layout set
  useEffect(() => {
    const bodyClasses = document.body.classList;
    bodyClasses.add('light-theme');
    bodyClasses.remove('dark-theme');

    // Remove previous theme-* and layout-set-* classes
    ['theme-modern-sleek', 'theme-plum', 'theme-oxford', 'theme-emerald', 'theme-archival', 'theme-amber', 'theme-midnight'].forEach((c) =>
      bodyClasses.remove(c)
    );
    ['layout-set-modern-sleek', 'layout-set-executive', 'layout-set-academic', 'layout-set-showcase'].forEach((c) =>
      bodyClasses.remove(c)
    );

    bodyClasses.add(`theme-${effectiveLayout.themeStyle}`);
    bodyClasses.add(`layout-set-${activeLayoutSet}`);
  }, [activeLayoutSet, effectiveLayout.themeStyle]);

  // Navigate module helper (used by launchpad, search bar, etc.)
  const handleNavigateModule = (moduleId, subAction = null) => {
    setActiveTab(moduleId);
    if (moduleId === 'circulation' && subAction) {
      setCircSubTab(subAction);
    }
  };

  // Top Search Bar Direct Handlers
  const handleDirectCheckOut = (patronQuery) => {
    setIncomingPatron(patronQuery);
    setCircSubTab('checkout');
    setActiveTab('circulation');
    showToast(`Loading check out for patron: "${patronQuery}"`, 'info');
  };

  const handleDirectCheckIn = (barcode) => {
    const tx = transactions.find(
      (t) => t.itemBarcode === barcode.trim() && t.status !== 'Returned'
    );
    if (tx) {
      handleCheckInItem(tx);
      showToast(`Quick check-in: Returned "${tx.bookTitle}" (Barcode ${barcode})`, 'success');
    } else {
      setIncomingBarcode(barcode);
      setCircSubTab('checkin');
      setActiveTab('circulation');
      showToast(`Loading check-in station for barcode "${barcode}"`, 'info');
    }
  };

  const handleDirectRenew = (barcode) => {
    const tx = transactions.find(
      (t) => t.itemBarcode === barcode.trim() && t.status !== 'Returned'
    );
    if (tx) {
      const parts = tx.dueDate.split('-');
      const dueDateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      dueDateObj.setDate(dueDateObj.getDate() + 14);
      const newDue = dueDateObj.toISOString().split('T')[0];

      setTransactions((prev) =>
        prev.map((t) => (t.id === tx.id ? { ...t, dueDate: newDue, status: 'Issued' } : t))
      );
      showToast(`Renewed "${tx.bookTitle}". New due date: ${newDue}`, 'success');
      setActiveTab('circulation');
      setCircSubTab('checkout');
    } else {
      showToast(`No active issued loan found for barcode: "${barcode}"`, 'warning');
    }
  };

  const handleSearchCatalog = (query, _field = 'all') => {
    setSearchQuery(query);
    setActiveTab('catalog');
  };

  const handleSearchPatrons = (query) => {
    if (query) {
      showToast(`Searching patrons for: "${query}"`, 'info');
    }
    setActiveTab('patrons');
  };

  // Circulation Action: Check Out
  const handleCheckOutItem = (patron, book, dueDate) => {
    const newTx = {
      id: 'TX-' + Math.floor(100 + Math.random() * 900),
      itemBarcode: book.barcode,
      bookTitle: book.title,
      patronCardNum: patron.cardNum,
      patronName: patron.name,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate,
      status: 'Issued',
      branch: selectedBranch
    };

    setTransactions((prev) => [newTx, ...prev]);

    setBooks((prev) =>
      prev.map((b) => {
        if (b.id === book.id) {
          const newAvail = Math.max(0, b.availableCopies - 1);
          return {
            ...b,
            availableCopies: newAvail,
            status: newAvail === 0 ? 'Checked Out' : 'Available'
          };
        }
        return b;
      })
    );

    setPatrons((prev) =>
      prev.map((p) => {
        if (p.id === patron.id) {
          return { ...p, borrowedCount: p.borrowedCount + 1 };
        }
        return p;
      })
    );
  };

  // Circulation Action: Check In
  const handleCheckInItem = (transaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === transaction.id ? { ...t, status: 'Returned' } : t))
    );

    setBooks((prev) =>
      prev.map((b) => {
        if (b.barcode === transaction.itemBarcode) {
          const newAvail = b.availableCopies + 1;
          return {
            ...b,
            availableCopies: newAvail,
            status: 'Available'
          };
        }
        return b;
      })
    );

    setPatrons((prev) =>
      prev.map((p) => {
        if (p.cardNum === transaction.patronCardNum && p.borrowedCount > 0) {
          return { ...p, borrowedCount: p.borrowedCount - 1 };
        }
        return p;
      })
    );
  };

  // Add Book Record
  const handleAddBook = (newBook) => {
    setBooks((prev) => [newBook, ...prev]);
  };

  // Save MARC Tag Fields
  const handleSaveMarc = (bookId, updatedMarc) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, marc: updatedMarc } : b))
    );
  };

  // Add Patron
  const handleAddPatron = (newPatron) => {
    setPatrons((prev) => [newPatron, ...prev]);
  };

  // Open Circulation tab prefilled for item
  const handleOpenCheckOutForItem = (book) => {
    setPreselectedCheckOutBook(book);
    setCircSubTab('checkout');
    setActiveTab('circulation');
  };

  // Compute live statistics
  const activeLoans = transactions.filter((t) => t.status === 'Issued' || t.status === 'Overdue').length;

  return (
    <div className={`app-container layout-set-${activeLayoutSet} shell-${effectiveLayout.shellLayout} density-${effectiveLayout.density} theme-${effectiveLayout.themeStyle}`}>
      {/* Authentic Koha Staff Navbar with Multi-Tab Search Bar & Layout Set Selector */}
      <Navbar
        systemPrefs={systemPrefs}
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
        onNavigateHome={() => setActiveTab('dashboard')}
        onDirectCheckOut={handleDirectCheckOut}
        onDirectCheckIn={handleDirectCheckIn}
        onDirectRenew={handleDirectRenew}
        onSearchCatalog={handleSearchCatalog}
        onSearchPatrons={handleSearchPatrons}
        activeLoansCount={activeLoans}
        activeLayoutSet={activeLayoutSet}
        onSelectLayoutSet={handleSelectLayoutSet}
        layoutSets={LAYOUT_SETS}
        effectiveLayout={effectiveLayout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={{
          activeLoans,
          totalBooks: books.length,
          totalPatrons: patrons.length
        }}
      />

      {/* Koha Breadcrumbs Bar */}
      <Breadcrumbs
        activeTab={activeTab}
        onNavigateHome={() => setActiveTab('dashboard')}
        circSubTab={activeTab === 'circulation' ? circSubTab : null}
        selectedBookTitle={activeTab === 'catalog' && selectedBook ? selectedBook.title : null}
      />

      {/* Main App Workspace */}
      <div className="main-wrapper">
        {/* Module Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          circSubTab={circSubTab}
          setCircSubTab={setCircSubTab}
          onOpenAddBook={() => setShowAddBookModal(true)}
          onOpenAddPatron={() => setActiveTab('patrons')}
          stats={{
            activeLoans,
            totalBooks: books.length,
            totalPatrons: patrons.length
          }}
          shellLayout={effectiveLayout.shellLayout}
        />

        {/* Dynamic Content View */}
        <main className="content-area">
          {activeTab === 'dashboard' && (
            <DashboardView
              books={books}
              patrons={patrons}
              transactions={transactions}
              setActiveTab={setActiveTab}
              onNavigateModule={handleNavigateModule}
              onOpenCheckOut={() => {
                setActiveTab('circulation');
                setCircSubTab('checkout');
              }}
              onOpenCheckIn={() => {
                setActiveTab('circulation');
                setCircSubTab('checkin');
              }}
              onOpenAddBook={() => setShowAddBookModal(true)}
              onOpenAddPatron={() => setActiveTab('patrons')}
              onSelectBook={(bk) => setSelectedBook(bk)}
              onOpenCheckOutForItem={handleOpenCheckOutForItem}
              onCheckInItem={handleCheckInItem}
              selectedBranch={selectedBranch}
              systemPrefs={systemPrefs}
              effectiveLayout={effectiveLayout}
              activeLayoutSet={activeLayoutSet}
              showToast={showToast}
            />
          )}

          {activeTab === 'catalog' && (
            <CatalogView
              books={books}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedBook={selectedBook}
              setSelectedBook={setSelectedBook}
              onOpenAddBook={() => setShowAddBookModal(true)}
              onOpenCheckOutForItem={handleOpenCheckOutForItem}
              systemPrefs={systemPrefs}
              effectiveLayout={effectiveLayout}
              activeLayoutSet={activeLayoutSet}
            />
          )}

          {activeTab === 'circulation' && (
            <CirculationView
              books={books}
              patrons={patrons}
              transactions={transactions}
              onCheckOutItem={handleCheckOutItem}
              onCheckInItem={handleCheckInItem}
              preselectedBook={preselectedCheckOutBook}
              circSubTab={circSubTab}
              setCircSubTab={setCircSubTab}
              incomingBarcode={incomingBarcode}
              incomingPatron={incomingPatron}
              showToast={showToast}
            />
          )}

          {activeTab === 'marc' && (
            <MarcEditorView
              books={books}
              onSaveMarc={handleSaveMarc}
              showToast={showToast}
            />
          )}

          {activeTab === 'patrons' && (
            <PatronsView
              patrons={patrons}
              onAddPatron={handleAddPatron}
              systemPrefs={systemPrefs}
              showToast={showToast}
            />
          )}

          {activeTab === 'serials' && (
            <SerialsView showToast={showToast} />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              books={books}
              patrons={patrons}
              transactions={transactions}
              showToast={showToast}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              systemPrefs={systemPrefs}
              setSystemPrefs={setSystemPrefs}
              showToast={showToast}
              activeLayoutSet={activeLayoutSet}
              onSelectLayoutSet={handleSelectLayoutSet}
              layoutSets={LAYOUT_SETS}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      {showAddBookModal && (
        <AddBookModal
          onClose={() => setShowAddBookModal(false)}
          onAddBook={handleAddBook}
          systemPrefs={systemPrefs}
          showToast={showToast}
        />
      )}

      {/* Toast Notifications */}
      <Toast toasts={toasts} />
    </div>
  );
}
