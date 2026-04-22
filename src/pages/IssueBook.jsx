import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Library, 
  User, 
  Search, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';

const IssueBook = () => {
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Set default due date to 7 days from now
    const date = new Date();
    date.setDate(date.getDate() + 7);
    setDueDate(date.toISOString().split('T')[0]);
    
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [stuRes, bookRes] = await Promise.all([
        api.get('/students/'),
        api.get('/books/')
      ]);
      setStudents(stuRes.data);
      setBooks(bookRes.data.filter(b => b.available_copies > 0));
    } catch (err) {
      setError('Failed to fetch necessary data');
    } finally {
      setFetching(false);
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/transactions/issue', {
        student_id: selectedStudent,
        book_id: selectedBook,
        due_date: new Date(dueDate).toISOString()
      });
      setSuccess(true);
      setTimeout(() => navigate('/transactions'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to issue book');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={styles.loading}>Loading circulation module...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerIcon}><Library size={28} /></div>
        <div>
          <h2 style={styles.title}>Issue New Book</h2>
          <p style={styles.subtitle}>Register a new book issuance for a student.</p>
        </div>
      </header>

      <div style={styles.formCard}>
        {success ? (
          <div style={styles.successState}>
            <CheckCircle2 size={48} color="var(--teal)" />
            <h3 style={styles.successTitle}>Book Issued Successfully!</h3>
            <p style={styles.successDesc}>The transaction has been recorded. Redirecting to history...</p>
          </div>
        ) : (
          <form onSubmit={handleIssue} style={styles.form}>
            {error && (
              <div style={styles.errorContainer}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>Select Student</label>
              <div style={styles.selectWrapper}>
                <User size={18} style={styles.selectIcon} />
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  required
                  style={styles.select}
                >
                  <option value="">Choose a student...</option>
                  {students.map(s => (
                    <option key={s.student_id} value={s.student_id}>
                      {s.full_name} ({s.student_id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Select Book</label>
              <div style={styles.selectWrapper}>
                <BookOpen size={18} style={styles.selectIcon} />
                <select
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  required
                  style={styles.select}
                >
                  <option value="">Choose a book...</option>
                  {books.map(b => (
                    <option key={b._id} value={b._id}>
                      {b.title} by {b.author}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Return Due Date</label>
              <div style={styles.selectWrapper}>
                <Calendar size={18} style={styles.selectIcon} />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  style={styles.dateInput}
                />
              </div>
              <p style={styles.helpText}>Default is 7 days from today.</p>
            </div>

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Processing...' : (
                <>
                  <span>Confirm Issuance</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}
      </div>

      <div style={styles.infoBox}>
        <div style={styles.infoTitle}>Policy Reminder</div>
        <p style={styles.infoText}>
          Students are allowed a maximum of 3 active issues. Fines are calculated at ₹5.00 per day after the due date.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '600px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' },
  headerIcon: { width: '56px', height: '56px', background: 'var(--accent-pale)', color: 'var(--accent)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: '700' },
  subtitle: { color: 'var(--ink-3)', fontSize: '15px' },
  formCard: { background: 'white', padding: '40px', borderRadius: 'var(--r)', border: '1px solid var(--rule)', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' },
  form: { display: 'flex', flexDirection: 'column', gap: '24px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontFamily: 'var(--mono)', fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-4)', letterSpacing: '0.05em' },
  selectWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  selectIcon: { position: 'absolute', left: '16px', color: 'var(--ink-4)' },
  select: { width: '100%', padding: '12px 16px 12px 48px', border: '1px solid var(--rule)', borderRadius: 'var(--r)', background: 'var(--paper-2)', fontSize: '14px', appearance: 'none' },
  dateInput: { width: '100%', padding: '12px 16px 12px 48px', border: '1px solid var(--rule)', borderRadius: 'var(--r)', background: 'var(--paper-2)', fontSize: '14px' },
  helpText: { fontSize: '12px', color: 'var(--ink-4)', fontStyle: 'italic' },
  submitBtn: { marginTop: '12px', padding: '14px', background: 'var(--ink)', color: 'white', border: 'none', borderRadius: 'var(--r)', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', transition: 'all 0.2s' },
  loading: { textAlign: 'center', padding: '100px', color: 'var(--ink-4)', fontFamily: 'var(--mono)' },
  errorContainer: { background: '#fef2f2', color: '#991b1b', padding: '12px 16px', borderRadius: 'var(--r)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #fecaca' },
  successState: { textAlign: 'center', padding: '20px 0' },
  successTitle: { fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: '700', margin: '16px 0 8px' },
  successDesc: { color: 'var(--ink-3)', fontSize: '14px' },
  infoBox: { marginTop: '32px', padding: '20px', background: 'var(--navy-pale)', borderRadius: 'var(--r)', borderLeft: '4px solid var(--navy)' },
  infoTitle: { fontFamily: 'var(--mono)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--navy)', marginBottom: '8px' },
  infoText: { fontSize: '13px', color: 'var(--ink-2)', lineHeight: '1.5' },
};

export default IssueBook;
