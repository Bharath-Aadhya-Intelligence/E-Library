import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  BookOpen, 
  Hash, 
  User as UserIcon,
  Tag,
  AlertCircle,
  X
} from 'lucide-react';
import api from '../services/api';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [error, setError] = useState('');
  
  const role = localStorage.getItem('role');
  const isAdmin = role === 'admin';

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books/');
      setBooks(response.data);
    } catch (err) {
      setError('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await api.delete(`/books/${id}`);
      setBooks(books.filter(b => b._id !== id));
    } catch (err) {
      alert('Failed to delete book');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const bookData = Object.fromEntries(formData.entries());
    
    // Convert numeric fields
    bookData.total_copies = parseInt(bookData.total_copies);
    bookData.available_copies = parseInt(bookData.available_copies);

    try {
      if (currentBook) {
        await api.put(`/books/${currentBook._id}`, bookData);
      } else {
        await api.post('/books/', bookData);
      }
      setShowModal(false);
      fetchBooks();
    } catch (err) {
      alert('Failed to save book');
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase()) ||
    book.isbn.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h2 style={styles.title}>Book Catalogue</h2>
          <p style={styles.subtitle}>Manage your library inventory and stock levels.</p>
        </div>
        {isAdmin && (
          <button onClick={() => { setCurrentBook(null); setShowModal(true); }} style={styles.addBtn}>
            <Plus size={18} />
            <span>Add New Book</span>
          </button>
        )}
      </header>

      <div style={styles.controls}>
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading catalog...</div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Title & Author</th>
                <th>ISBN</th>
                <th>Category</th>
                <th>Stock</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map(book => (
                <tr key={book._id}>
                  <td>
                    <div style={styles.bookInfo}>
                      <div style={styles.bookIcon}><BookOpen size={16} /></div>
                      <div>
                        <div style={styles.bookTitle}>{book.title}</div>
                        <div style={styles.bookAuthor}>{book.author}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.monoCell}>{book.isbn}</td>
                  <td><span style={styles.badge}>{book.category}</span></td>
                  <td>
                    <div style={styles.stockInfo}>
                      <span style={{
                        ...styles.stockNum,
                        color: book.available_copies > 0 ? 'var(--teal)' : 'var(--accent)'
                      }}>
                        {book.available_copies} / {book.total_copies}
                      </span>
                      <div style={styles.stockBar}>
                        <div style={{
                          ...styles.stockProgress,
                          width: `${(book.available_copies / book.total_copies) * 100}%`,
                          background: book.available_copies > 0 ? 'var(--teal)' : 'var(--accent)'
                        }}></div>
                      </div>
                    </div>
                  </td>
                  {isAdmin && (
                    <td>
                      <div style={styles.actions}>
                        <button onClick={() => { setCurrentBook(book); setShowModal(true); }} style={styles.iconBtn}>
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(book._id)} style={{...styles.iconBtn, color: '#ef4444'}}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {filteredBooks.length === 0 && (
            <div style={styles.emptyState}>No books found matching your search.</div>
          )}
        </div>
      )}

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{currentBook ? 'Edit Book' : 'Add New Book'}</h3>
              <button onClick={() => setShowModal(false)} style={styles.closeBtn}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Book Title</label>
                <input name="title" defaultValue={currentBook?.title} required style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Author</label>
                <input name="author" defaultValue={currentBook?.author} required style={styles.input} />
              </div>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>ISBN</label>
                  <input name="isbn" defaultValue={currentBook?.isbn} required style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Category</label>
                  <input name="category" defaultValue={currentBook?.category} required style={styles.input} />
                </div>
              </div>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Total Copies</label>
                  <input name="total_copies" type="number" defaultValue={currentBook?.total_copies || 1} required style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Available Copies</label>
                  <input name="available_copies" type="number" defaultValue={currentBook?.available_copies || 1} required style={styles.input} />
                </div>
              </div>
              <button type="submit" style={styles.submitBtn}>
                {currentBook ? 'Update Book' : 'Add to Collection'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  title: { fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: '700', color: 'var(--ink)' },
  subtitle: { color: 'var(--ink-3)', fontSize: '15px' },
  addBtn: {
    background: 'var(--ink)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 'var(--r)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  controls: { marginBottom: '24px' },
  searchWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  searchIcon: { position: 'absolute', left: '16px', color: 'var(--ink-4)' },
  searchInput: {
    width: '100%',
    padding: '12px 16px 12px 48px',
    background: 'white',
    border: '1px solid var(--rule)',
    borderRadius: 'var(--r)',
    fontSize: '14px',
  },
  loading: { textAlign: 'center', padding: '60px', color: 'var(--ink-4)', fontFamily: 'var(--mono)' },
  tableWrap: { background: 'white', borderRadius: 'var(--r)', border: '1px solid var(--rule)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' },
  bookInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
  bookIcon: { width: '32px', height: '32px', background: 'var(--paper-2)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifycontent: 'center', color: 'var(--ink-3)' },
  bookTitle: { fontWeight: '600', color: 'var(--ink)' },
  bookAuthor: { fontSize: '12px', color: 'var(--ink-4)' },
  monoCell: { fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink-3)' },
  badge: { background: 'var(--navy-pale)', color: 'var(--navy)', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '500' },
  stockInfo: { width: '120px' },
  stockNum: { display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', textAlign: 'right' },
  stockBar: { height: '4px', background: 'var(--paper-3)', borderRadius: '2px', overflow: 'hidden' },
  stockProgress: { height: '100%', transition: 'width 0.3s' },
  actions: { display: 'flex', gap: '8px' },
  iconBtn: { padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-4)', transition: 'color 0.2s' },
  emptyState: { padding: '40px', textAlign: 'center', color: 'var(--ink-4)', fontStyle: 'italic' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: 'white', width: '100%', maxWidth: '500px', borderRadius: 'var(--r)', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  modalTitle: { fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: '700' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-4)' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  label: { fontFamily: 'var(--mono)', fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-4)' },
  input: { padding: '10px 12px', border: '1px solid var(--rule)', borderRadius: 'var(--r)', background: 'var(--paper-2)', fontSize: '14px' },
  submitBtn: { marginTop: '12px', padding: '12px', background: 'var(--ink)', color: 'white', border: 'none', borderRadius: 'var(--r)', fontWeight: '600', cursor: 'pointer' },
};

export default Books;
