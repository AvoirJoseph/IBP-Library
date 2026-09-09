import React, { useState } from 'react';
import { BarChart3, Play, Database, Table, Download } from 'lucide-react';
import { MOCK_SQL_QUERIES } from '../mockData';

export default function ReportsView({ books, patrons, transactions, showToast }) {
  const [selectedQueryIndex, setSelectedQueryIndex] = useState(0);
  const [customSql, setCustomSql] = useState(MOCK_SQL_QUERIES[0].sql);
  const [queryResults, setQueryResults] = useState(null);

  const handleSelectQuery = (idx) => {
    setSelectedQueryIndex(idx);
    setCustomSql(MOCK_SQL_QUERIES[idx].sql);
    setQueryResults(null);
  };

  const handleExecuteQuery = () => {
    let result = [];
    if (selectedQueryIndex === 0) {
      // Overdue Loans & Calculated Fines
      result = transactions
        .filter((t) => t.status === 'Overdue')
        .map((t) => ({
          Transaction_ID: t.id,
          Book_Title: t.bookTitle,
          Patron_Name: t.patronName,
          Due_Date: t.dueDate,
          Estimated_Fine: '$3.50'
        }));
    } else if (selectedQueryIndex === 1) {
      // Top Borrowed Items
      result = books.map((b) => ({
        Title: b.title,
        Author: b.author,
        Call_Number: b.callNumber,
        Total_Checkouts: b.copies - b.availableCopies + 2,
        Status: b.status
      }));
    } else {
      // Patrons with Fine Balance > $0
      result = patrons
        .filter((p) => p.fineBalance > 0)
        .map((p) => ({
          Card_Number: p.cardNum,
          Patron_Name: p.name,
          Category: p.category,
          Fine_Balance: `$${p.fineBalance.toFixed(2)}`,
          Status: p.status
        }));
    }

    setQueryResults(result);
    showToast(`SQL Query executed successfully! Returned ${result.length} rows.`, 'success');
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <BarChart3 size={28} className="text-primary" />
            Koha Reports & SQL Query Runner
          </h1>
          <p className="page-subtitle">
            Execute SQL queries, generate circulation statistics, and export analytics
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Preset SQL Dropdown */}
        <div className="koha-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={18} className="text-primary" />
            Saved Koha SQL Query Library
          </h3>
          <div className="form-group">
            <label className="form-label">Select Pre-written Koha SQL Report</label>
            <select
              className="form-select"
              value={selectedQueryIndex}
              onChange={(e) => handleSelectQuery(Number(e.target.value))}
            >
              {MOCK_SQL_QUERIES.map((q, idx) => (
                <option key={idx} value={idx}>
                  {q.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Query Editor & Run Controls */}
        <div className="koha-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Play size={18} style={{ color: 'var(--success)' }} />
            SQL Console Controls
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Run direct SQL queries against database tables (biblio, items, borrowers, accountlines).
          </p>
          <button className="btn btn-success" style={{ width: '100%' }} onClick={handleExecuteQuery}>
            <Play size={16} /> Execute SQL Query
          </button>
        </div>
      </div>

      {/* SQL Editor Textarea */}
      <div className="koha-card" style={{ marginBottom: '1.5rem' }}>
        <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>SQL Statement Editor (ANSI SQL Syntax)</span>
          <span className="mono-text" style={{ fontSize: '0.75rem' }}>DB: koha_library_main</span>
        </label>
        <textarea
          className="form-textarea mono-text"
          rows={4}
          value={customSql}
          onChange={(e) => setCustomSql(e.target.value)}
          style={{ color: '#38bdf8', fontSize: '0.9rem' }}
        />
      </div>

      {/* SQL Results Table */}
      {queryResults && (
        <div className="koha-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Table size={18} className="text-primary" />
              Query Results ({queryResults.length} records returned)
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={() => showToast('Exported CSV file', 'info')}>
              <Download size={14} /> Export CSV
            </button>
          </div>

          <div className="table-wrapper">
            <table className="koha-table">
              <thead>
                <tr>
                  {Object.keys(queryResults[0] || {}).map((col) => (
                    <th key={col}>{col.replace(/_/g, ' ')}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {queryResults.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {Object.values(row).map((val, cIdx) => (
                      <td key={cIdx}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
