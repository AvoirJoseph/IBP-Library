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

export default function App() {
  // Main Data States
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [patrons, setPatrons] = useState(INITIAL_PATRONS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [systemPrefs, setSystemPrefs] = useState(KOHA_SYSTEM_PREFS);

  // App UI States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [circSubTab, setCircSubTab] = useState('checkout');
  const [incomingBarcode, setIncomingBarcode] = useState('');
  const [incomingPatron, setIncomingPatron] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('Main Library');
  const [darkMode, setDarkMode] = useState(false); // Default to clean classic Koha staff light theme

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

  // Toggle Theme Class on body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [darkMode]);

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
    <div className="app-container">
      {/* Authentic Koha Staff Navbar with Multi-Tab Search Bar */}
      <Navbar
        systemPrefs={systemPrefs}
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onNavigateHome={() => setActiveTab('dashboard')}
        onDirectCheckOut={handleDirectCheckOut}
        onDirectCheckIn={handleDirectCheckIn}
        onDirectRenew={handleDirectRenew}
        onSearchCatalog={handleSearchCatalog}
        onSearchPatrons={handleSearchPatrons}
        activeLoansCount={activeLoans}
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
              onCheckInItem={handleCheckInItem}
              selectedBranch={selectedBranch}
              systemPrefs={systemPrefs}
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
