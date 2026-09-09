import React, { useState } from 'react';
import { X, PlusCircle, BookOpen } from 'lucide-react';

export default function AddBookModal({ onClose, onAddBook, systemPrefs, showToast }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [callNumber, setCallNumber] = useState('');
  const [copies, setCopies] = useState(3);
  const [publisher, setPublisher] = useState('');
  const [year, setYear] = useState('2026');
  const [itemType, setItemType] = useState('Book');
  const [branch, setBranch] = useState(systemPrefs.branches[0].name);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !author) {
      showToast('Please specify title and author!', 'warning');
      return;
    }

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const barcode = '39999' + randomNum;
    const generatedIsbn = isbn || `978-${Math.floor(100000000 + Math.random() * 900000000)}`;
    const generatedCall = callNumber || `QA${Math.floor(10 + Math.random() * 90)}.${Math.floor(10 + Math.random() * 90)} .K${randomNum.toString().slice(0, 3)} ${year}`;

    const newBook = {
      id: 'B-' + Math.floor(1000 + Math.random() * 9000),
      title,
      author,
      isbn: generatedIsbn,
      callNumber: generatedCall,
      barcode,
      publisher: publisher || 'Koha Press',
      year,
      itemType,
      branch,
      location: 'Stacks / General Collection',
      copies: Number(copies),
      availableCopies: Number(copies),
      coverColor: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
      status: 'Available',
      subjects: [itemType, 'General Collection'],
      description: `Bibliographic record created in Koha ILS.`,
      marc: [
        { tag: '001', ind1: ' ', ind2: ' ', value: `000${randomNum}` },
        { tag: '020', ind1: ' ', ind2: ' ', value: `$a ${generatedIsbn}` },
        { tag: '100', ind1: '1', ind2: ' ', value: `$a ${author}, $e author.` },
        { tag: '245', ind1: '1', ind2: '0', value: `$a ${title} / $c ${author}.` },
        { tag: '260', ind1: ' ', ind2: ' ', value: `$a City : $b ${publisher || 'Koha Press'}, $c ${year}.` },
        { tag: '852', ind1: '8', ind2: ' ', value: `$b ${branch.slice(0, 4).toUpperCase()} $c STACKS $h ${generatedCall} $p ${barcode}` }
      ]
    };

    onAddBook(newBook);
    showToast(`Added new bibliographic record "${title}" to Koha catalog!`, 'success');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={20} className="text-primary" />
            New Koha Bibliographic Record
          </span>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Title Statement ($a Title)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Modern Software Architecture Manual"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Primary Author ($a Main Entry)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Dr. Arthur Pendelton"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">ISBN / ISSN</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 978-0123456789 (Auto if blank)"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Call Number (LC / Dewey)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. QA76.76.A1 (Auto if blank)"
                  value={callNumber}
                  onChange={(e) => setCallNumber(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Item Type</label>
                <select
                  className="form-select"
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value)}
                >
                  <option value="Book">Book</option>
                  <option value="Journal">Journal</option>
                  <option value="E-Book">E-Book</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Publication Year</label>
                <input
                  type="text"
                  className="form-input"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Number of Copies</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={copies}
                  onChange={(e) => setCopies(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Holding Branch</label>
              <select
                className="form-select"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              >
                {systemPrefs.branches.map((b) => (
                  <option key={b.code} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <PlusCircle size={16} /> Save & Generate MARC21 Tag
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
