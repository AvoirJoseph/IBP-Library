import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
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
  const [selectedBranch, setSelectedBranch] = useState('Main Library');
  const [darkMode, setDarkMode] = useState(true);

  // Search Bar States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('catalog');

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

  // Search Trigger Handler
  const handlePerformSearch = () => {
    if (!searchQuery) return;
    if (searchCategory === 'patron') {
      setActiveTab('patrons');
    } else {
      setActiveTab('catalog');
    }
  };

  // Circulation Action: Check Out
  const handleCheckOutItem = (patron, book, dueDate) => {
    // 1. Create Transaction
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

    // 2. Decrement available copies in book
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

    // 3. Increment patron borrowed count
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
    // 1. Mark transaction as Returned
    setTransactions((prev) =>
      prev.map((t) => (t.id === transaction.id ? { ...t, status: 'Returned' } : t))
    );

    // 2. Restore book copy count
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

    // 3. Decrement patron borrowed count
    setPatrons((prev) =>
      prev.map((p) => {
        if (p.cardNum === transaction.patronCardNum && p.borrowedCount > 0) {
          return { ...p, borrowedCount: p.borrowedCount - 1 };
        }
        return p;
      })
    );
  };

  // Fine Payment Action
  const handlePayFine = (patronId) => {
    setPatrons((prev) =>
      prev.map((p) => (p.id === patronId ? { ...p, fineBalance: 0.00, status: 'Active' } : p))
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
    setActiveTab('circulation');
  };

  // Compute live statistics
  const activeLoans = transactions.filter((t) => t.status === 'Issued' || t.status === 'Overdue').length;

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        systemPrefs={systemPrefs}
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchCategory={searchCategory}
        setSearchCategory={setSearchCategory}
        onPerformSearch={handlePerformSearch}
      />

      {/* Main App Workspace */}
      <div className="main-wrapper">
        {/* Module Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
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
              onOpenCheckOut={() => setActiveTab('circulation')}
              onOpenCheckIn={() => setActiveTab('circulation')}
              onOpenAddBook={() => setShowAddBookModal(true)}
              onOpenAddPatron={() => setActiveTab('patrons')}
              onSelectBook={(bk) => setSelectedBook(bk)}
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
              onPayFine={handlePayFine}
              preselectedBook={preselectedCheckOutBook}
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
              onPayFine={handlePayFine}
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
