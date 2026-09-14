import React, { useState } from 'react';
import {
  BarChart3,
  Play,
  Database,
  Table,
  Download,
  Terminal,
  Clock,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import { MOCK_SQL_QUERIES } from '../mockData';

export default function ReportsView({ books = [], patrons = [], transactions = [], showToast }) {
  const [selectedQueryIndex, setSelectedQueryIndex] = useState(0);
  const [customSql, setCustomSql] = useState(MOCK_SQL_QUERIES[0].sql);
  const [queryResults, setQueryResults] = useState(null);
  const [executionTime, setExecutionTime] = useState(null);

  const handleSelectQuery = (idx) => {
    setSelectedQueryIndex(idx);
    setCustomSql(MOCK_SQL_QUERIES[idx].sql);
    setQueryResults(null);
    setExecutionTime(null);
  };

  const handleExecuteQuery = () => {
    const start = performance.now();
    let result = [];
    if (selectedQueryIndex === 0) {
      result = transactions
        .filter((t) => t.status === 'Overdue')
        .map((t) => ({
          Transaction_ID: t.id,
          Book_Title: t.bookTitle,
          Patron_Name: t.patronName,
          Due_Date: t.dueDate,
          Days_Overdue: 14,
          Fine_Amount: '$7.00'
        }));
    } else if (selectedQueryIndex === 1) {
      result = books.map((b) => ({
        Title: b.title,
        Author: b.author,
        Call_Number: b.callNumber,
        Total_Checkouts: (Number(b.copies) || 1) - (Number(b.availableCopies) || 0) + 3,
        Branch: b.branch,
        Status: b.status
      }));
    } else {
      result = patrons
        .filter((p) => p.borrowedCount > 0)
        .map((p) => ({
          Card_Number: p.cardNum,
          Patron_Name: p.name,
          Category: p.category,
          Active_Loans: `${p.borrowedCount} items`,
          Home_Branch: p.branch,
          Status: p.status
        }));
    }

    const elapsed = (performance.now() - start).toFixed(1);
    setExecutionTime(elapsed);
    setQueryResults(result);
    if (showToast) {
      showToast(`Koha SQL query executed in ${elapsed}ms! Returned ${result.length} rows.`, 'success');
    }
  };

  const handleExportCsv = () => {
    if (!queryResults || queryResults.length === 0) return;
    const headers = Object.keys(queryResults[0]).join(',');
    const rows = queryResults.map((row) => Object.values(row).join(',')).join('\n');
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + '\n' + rows);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', csvContent);
    downloadAnchor.setAttribute('download', `koha_report_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    if (showToast) showToast('Exported CSV spreadsheet', 'info');
  };

  return (
    <div className="reports-module-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <BarChart3 size={28} className="text-primary" />
            <span>Koha Analytics & SQL Query Runner</span>
          </h1>
          <p className="page-subtitle">
            Execute SQL queries directly against Koha ILS tables (biblio, items, borrowers, issues), analyze circulation metrics, and export data
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Preset Query Library */}
        <div className="koha-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Database size={18} className="text-primary" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Saved Koha SQL Query Library</h3>
          </div>

          <div className="form-group">
            <label className="form-label">Select Pre-written Koha SQL Report</label>
            <select
              className="form-select"
              style={{ height: '42px', fontSize: '0.92rem' }}
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

          <div className="catalog-subject-chips-row" style={{ marginTop: '0.75rem' }}>
            <span className="catalog-subject-chip-label">Quick Preset:</span>
            {MOCK_SQL_QUERIES.map((q, idx) => (
              <button
                key={idx}
                type="button"
                className={`catalog-subject-pill ${selectedQueryIndex === idx ? 'active' : ''}`}
                onClick={() => handleSelectQuery(idx)}
              >
                {q.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Execution Terminal */}
        <div className="koha-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Terminal size={18} className="text-primary" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>SQL Execution Console</h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Run live transactional SQL queries against database tables (biblio, items, borrowers, accountlines).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={handleExecuteQuery}
            >
              <Play size={16} />
              <span>Execute SQL Query</span>
            </button>
            {queryResults && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleExportCsv}
              >
                <Download size={16} />
                <span>Export CSV</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Code Editor Box */}
      <div className="koha-card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            SQL Query Syntax
          </span>
          {executionTime && (
            <span className="badge badge-available">
              <Clock size={12} /> Executed in {executionTime}ms
            </span>
          )}
        </div>
        <textarea
          className="form-input mono-text"
          style={{
            minHeight: '120px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.88rem',
            background: 'var(--bg-input)',
            lineHeight: 1.5
          }}
          value={customSql}
          onChange={(e) => setCustomSql(e.target.value)}
        />
      </div>

      {/* Query Output Table */}
      {queryResults && (
        <div className="koha-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Table size={18} className="text-primary" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                Query Result Set ({queryResults.length} rows returned)
              </h3>
            </div>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleExportCsv}>
              <FileSpreadsheet size={14} /> Export to Spreadsheet
            </button>
          </div>

          <div className="table-wrapper">
            <table className="koha-table">
              <thead>
                <tr>
                  {Object.keys(queryResults[0] || {}).map((header, idx) => (
                    <th key={idx}>{header.replace(/_/g, ' ')}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {queryResults.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {Object.values(row).map((val, cIdx) => (
                      <td key={cIdx}>
                        {typeof val === 'string' && (val.includes('B-') || val.includes('3999') || val.includes('QA')) ? (
                          <span className="mono-text">{val}</span>
                        ) : (
                          val
                        )}
                      </td>
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
