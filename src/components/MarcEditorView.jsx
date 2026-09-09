import React, { useState } from 'react';
import {
  FileCode,
  Save,
  Plus,
  Trash2,
  Download,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

export default function MarcEditorView({ books, onSaveMarc, showToast }) {
  const [selectedBookId, setSelectedBookId] = useState(books[0]?.id || '');
  const activeBook = books.find((b) => b.id === selectedBookId) || books[0];

  const [marcFields, setMarcFields] = useState(
    activeBook ? [...activeBook.marc] : []
  );

  const handleBookChange = (id) => {
    setSelectedBookId(id);
    const bk = books.find((b) => b.id === id);
    if (bk) setMarcFields([...bk.marc]);
  };

  const handleAddField = () => {
    setMarcFields([
      ...marcFields,
      { tag: '500', ind1: ' ', ind2: ' ', value: '$a General note.' }
    ]);
  };

  const handleRemoveField = (index) => {
    setMarcFields(marcFields.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...marcFields];
    updated[index][field] = value;
    setMarcFields(updated);
  };

  const handleSave = () => {
    onSaveMarc(activeBook.id, marcFields);
    showToast(`MARC21 record for "${activeBook.title}" successfully updated!`, 'success');
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(marcFields, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `marc21_${activeBook.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported MARC21 JSON file', 'info');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FileCode size={28} className="text-primary" />
            Koha MARC21 Cataloging Tool
          </h1>
          <p className="page-subtitle">
            Edit ISO 2709 / MARC21 tags, indicators, subfields ($a, $b, $c), and holdings
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={handleExportJson}>
            <Download size={16} />
            Export MARC21 JSON
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} />
            Save MARC Record
          </button>
        </div>
      </div>

      {/* Book Selector */}
      <div className="koha-card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <label className="form-label">Select Bibliographic Record to Edit</label>
        <select
          className="form-select"
          style={{ fontSize: '1rem', fontWeight: 600 }}
          value={selectedBookId}
          onChange={(e) => handleBookChange(e.target.value)}
        >
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.id} — {b.title} ({b.author})
            </option>
          ))}
        </select>
      </div>

      {/* MARC Tag Editor Grid */}
      <div className="koha-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileCode size={18} style={{ color: '#38bdf8' }} />
            MARC21 Tag Specification Editor
          </h3>
          <button className="btn btn-secondary btn-sm" onClick={handleAddField}>
            <Plus size={14} /> Add MARC Tag Field
          </button>
        </div>

        <div className="table-wrapper">
          <table className="marc-table">
            <thead>
              <tr>
                <th style={{ width: '90px' }}>Tag #</th>
                <th style={{ width: '70px' }}>Ind 1</th>
                <th style={{ width: '70px' }}>Ind 2</th>
                <th>Subfields & Field Content</th>
                <th style={{ width: '60px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {marcFields.map((field, idx) => (
                <tr key={idx}>
                  <td>
                    <input
                      type="text"
                      className="form-input mono-text"
                      style={{ padding: '0.25rem 0.5rem', width: '100%', fontWeight: 700 }}
                      value={field.tag}
                      onChange={(e) => handleFieldChange(idx, 'tag', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-input mono-text"
                      style={{ padding: '0.25rem 0.5rem', width: '100%', textAlign: 'center' }}
                      value={field.ind1}
                      onChange={(e) => handleFieldChange(idx, 'ind1', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-input mono-text"
                      style={{ padding: '0.25rem 0.5rem', width: '100%', textAlign: 'center' }}
                      value={field.ind2}
                      onChange={(e) => handleFieldChange(idx, 'ind2', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-input mono-text"
                      style={{ padding: '0.25rem 0.5rem', width: '100%' }}
                      value={field.value}
                      onChange={(e) => handleFieldChange(idx, 'value', e.target.value)}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="icon-btn"
                      style={{ color: 'var(--danger)', margin: '0 auto' }}
                      onClick={() => handleRemoveField(idx)}
                      title="Delete Field Tag"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
