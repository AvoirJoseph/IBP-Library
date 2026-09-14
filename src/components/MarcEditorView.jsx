import React, { useState, useEffect } from 'react';
import {
  FileCode,
  Save,
  Plus,
  Trash2,
  Download,
  BookOpen,
  CheckCircle2,
  Tag,
  Sparkles,
  Layers,
  Code
} from 'lucide-react';

export default function MarcEditorView({ books = [], onSaveMarc, showToast }) {
  const [selectedBookId, setSelectedBookId] = useState(books[0]?.id || '');
  const activeBook = books.find((b) => b.id === selectedBookId) || books[0];

  const [marcFields, setMarcFields] = useState(
    activeBook ? [...activeBook.marc] : []
  );

  useEffect(() => {
    if (activeBook) {
      setMarcFields([...activeBook.marc]);
    }
  }, [selectedBookId, activeBook]);

  const handleBookChange = (id) => {
    setSelectedBookId(id);
    const bk = books.find((b) => b.id === id);
    if (bk) setMarcFields([...bk.marc]);
  };

  const handleAddField = (tag = '500', value = '$a General note.') => {
    setMarcFields([
      ...marcFields,
      { tag, ind1: ' ', ind2: ' ', value }
    ]);
    if (showToast) showToast(`Added MARC21 tag [${tag}]`, 'info');
  };

  const handleRemoveField = (index) => {
    setMarcFields(marcFields.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index, field, val) => {
    const updated = [...marcFields];
    updated[index][field] = val;
    setMarcFields(updated);
  };

  const handleSave = () => {
    onSaveMarc(activeBook.id, marcFields);
    if (showToast) {
      showToast(`MARC21 record for "${activeBook.title}" successfully updated!`, 'success');
    }
  };

  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(marcFields, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `marc21_${activeBook.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    if (showToast) showToast('Exported ISO 2709 MARC JSON file', 'info');
  };

  // Derive preview title and author from active MARC fields
  const titleField = marcFields.find((f) => f.tag === '245')?.value || activeBook?.title;
  const authorField = marcFields.find((f) => f.tag === '100')?.value || activeBook?.author;

  return (
    <div className="marc-editor-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FileCode size={28} className="text-primary" />
            <span>Koha MARC21 Bibliographic Cataloging Tool</span>
          </h1>
          <p className="page-subtitle">
            Professional ISO 2709 cataloging editor with real-time MARC tag validation and live 3D preview
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-secondary" onClick={handleExportJson}>
            <Download size={16} />
            <span>Export JSON</span>
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            <Save size={16} />
            <span>Save MARC Record</span>
          </button>
        </div>
      </div>

      {/* Book Selector & Fast Tag Helper */}
      <div className="koha-card catalog-search-card" style={{ marginBottom: '1.5rem' }}>
        <label className="form-label" style={{ fontWeight: 700 }}>
          Select Bibliographic Volume to Catalog
        </label>
        <select
          className="form-select"
          style={{ fontSize: '1rem', fontWeight: 600, height: '44px' }}
          value={selectedBookId}
          onChange={(e) => handleBookChange(e.target.value)}
        >
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.id} — {b.title} ({b.author}) • Call: {b.callNumber}
            </option>
          ))}
        </select>

        {/* Quick Tag Adder Chips */}
        <div className="catalog-subject-chips-row" style={{ marginTop: '1rem' }}>
          <span className="catalog-subject-chip-label">
            <Tag size={13} />
            <span>Quick Add MARC Tag:</span>
          </span>
          <button
            type="button"
            className="catalog-subject-pill"
            onClick={() => handleAddField('020', '$a 978-0000000000')}
          >
            + 020 (ISBN)
          </button>
          <button
            type="button"
            className="catalog-subject-pill"
            onClick={() => handleAddField('100', '$a Author Name, $e author.')}
          >
            + 100 (Author)
          </button>
          <button
            type="button"
            className="catalog-subject-pill"
            onClick={() => handleAddField('245', '$a Title : $b Subtitle / $c Statement of resp.')}
          >
            + 245 (Title)
          </button>
          <button
            type="button"
            className="catalog-subject-pill"
            onClick={() => handleAddField('260', '$a City : $b Publisher, $c Year.')}
          >
            + 260 (Imprint)
          </button>
          <button
            type="button"
            className="catalog-subject-pill"
            onClick={() => handleAddField('500', '$a Bibliographical or general note.')}
          >
            + 500 (Note)
          </button>
          <button
            type="button"
            className="catalog-subject-pill"
            onClick={() => handleAddField('650', '$a Subject heading.')}
          >
            + 650 (Topical Term)
          </button>
        </div>
      </div>

      {/* Split Screen: Editor Table on Left, Live 3D Preview on Right */}
      <div className="marc-split-layout">
        {/* Left: MARC Fields Table */}
        <div className="koha-card marc-table-card">
          <div className="marc-table-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code size={18} className="text-primary" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Standard Tag Field Editor</h3>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleAddField()}
            >
              <Plus size={14} /> Add Custom Tag
            </button>
          </div>

          <div className="table-wrapper" style={{ maxHeight: '550px', overflowY: 'auto' }}>
            <table className="koha-table marc-interactive-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Tag</th>
                  <th style={{ width: '60px' }}>Ind 1</th>
                  <th style={{ width: '60px' }}>Ind 2</th>
                  <th>Subfield Data ($a, $b, $c, $h, $p)</th>
                  <th style={{ width: '50px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {marcFields.map((field, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        type="text"
                        className="form-input mono-text marc-tag-input"
                        value={field.tag}
                        maxLength={3}
                        onChange={(e) => handleFieldChange(idx, 'tag', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-input mono-text marc-ind-input"
                        value={field.ind1}
                        maxLength={1}
                        onChange={(e) => handleFieldChange(idx, 'ind1', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-input mono-text marc-ind-input"
                        value={field.ind2}
                        maxLength={1}
                        onChange={(e) => handleFieldChange(idx, 'ind2', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-input mono-text marc-val-input"
                        value={field.value}
                        onChange={(e) => handleFieldChange(idx, 'value', e.target.value)}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="icon-btn-danger"
                        onClick={() => handleRemoveField(idx)}
                        title="Delete Tag"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Live 3D Bibliographic Preview */}
        <div className="marc-live-preview-card">
          <div className="preview-card-header">
            <Sparkles size={16} className="text-primary" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Live Bibliographic 3D Preview</h4>
          </div>

          {activeBook && (
            <div className="marc-preview-content">
              <div
                className="marc-book-3d-preview"
                style={{ background: activeBook.coverColor }}
              >
                <div className="preview-spine-shadow" />
                <div className="preview-sheen" />
                <span className="preview-item-type">{activeBook.itemType}</span>
                <h3 className="preview-title">{titleField}</h3>
                <span className="preview-author">{authorField}</span>
                <span className="preview-year">{activeBook.year}</span>
              </div>

              <div className="preview-metadata-box">
                <div className="preview-meta-row">
                  <span className="meta-label">Control ID:</span>
                  <span className="meta-val mono-text">{activeBook.id}</span>
                </div>
                <div className="preview-meta-row">
                  <span className="meta-label">Barcode:</span>
                  <span className="meta-val mono-text">{activeBook.barcode}</span>
                </div>
                <div className="preview-meta-row">
                  <span className="meta-label">Call #:</span>
                  <span className="meta-val mono-text">{activeBook.callNumber}</span>
                </div>
                <div className="preview-meta-row">
                  <span className="meta-label">Holding:</span>
                  <span className="meta-val">{activeBook.branch}</span>
                </div>
              </div>

              <div className="preview-status-pill">
                <CheckCircle2 size={14} />
                <span>ISO 2709 Format Compliant</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
