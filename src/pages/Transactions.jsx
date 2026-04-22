import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  RotateCcw, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search,
  CircleDollarSign,
  Calendar
} from 'lucide-react';
import api from '../services/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const role = localStorage.getItem('role');
  const isAdmin = role === 'admin';

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const endpoint = isAdmin ? '/transactions/' : '/transactions/my';
      const response = await api.get(endpoint);
      setTransactions(response.data);
    } catch (err) {
      setError('Failed to fetch transaction history');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id) => {
    if (!window.confirm('Mark this book as returned?')) return;
    setProcessingId(id);
    try {
      await api.post(`/transactions/return/${id}`);
      fetchTransactions();
    } catch (err) {
      alert('Failed to process return');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredTransactions = transactions.filter(t => 
    t.student_id.toLowerCase().includes(search.toLowerCase()) ||
    t.book_id.toLowerCase().includes(search.toLowerCase()) ||
    t.status.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h2 style={styles.title}>Circulation History</h2>
          <p style={styles.subtitle}>Track book issuances, returns, and outstanding fines.</p>
        </div>
      </header>

      <div style={styles.controls}>
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by student ID, book ID, or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading history...</div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Fine</th>
                {isAdmin && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(t => (
                <tr key={t._id}>
                  <td style={styles.monoCell}>{t.student_id}</td>
                  <td>
                    <div style={styles.dateCell}>
                      <Calendar size={14} color="var(--ink-4)" />
                      <span>{formatDate(t.issue_date)}</span>
                    </div>
                  </td>
                  <td>
                    <div style={styles.dateCell}>
                      <Clock size={14} color={new Date(t.due_date) < new Date() && t.status === 'issued' ? 'var(--accent)' : 'var(--ink-4)'} />
                      <span style={{color: new Date(t.due_date) < new Date() && t.status === 'issued' ? 'var(--accent)' : 'inherit'}}>
                        {formatDate(t.due_date)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      ...styles.statusBadge,
                      background: t.status === 'returned' ? 'var(--teal-pale)' : 'var(--accent-pale)',
                      color: t.status === 'returned' ? 'var(--teal)' : 'var(--accent)'
                    }}>
                      {t.status === 'returned' ? <CheckCircle2 size={12} /> : <RotateCcw size={12} />}
                      {t.status}
                    </span>
                  </td>
                  <td>
                    {t.fine_amount > 0 ? (
                      <span style={styles.fineAmount}>₹{t.fine_amount.toFixed(2)}</span>
                    ) : (
                      <span style={styles.noFine}>-</span>
                    )}
                  </td>
                  {isAdmin && (
                    <td>
                      {t.status === 'issued' ? (
                        <button 
                          onClick={() => handleReturn(t._id)} 
                          disabled={processingId === t._id}
                          style={styles.returnBtn}
                        >
                          {processingId === t._id ? '...' : 'Process Return'}
                        </button>
                      ) : (
                        <span style={styles.completedText}>Completed</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <div style={styles.emptyState}>No transactions recorded.</div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto' },
  header: { marginBottom: '32px' },
  title: { fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: '700', color: 'var(--ink)' },
  subtitle: { color: 'var(--ink-3)', fontSize: '15px' },
  controls: { marginBottom: '24px' },
  searchWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  searchIcon: { position: 'absolute', left: '16px', color: 'var(--ink-4)' },
  searchInput: { width: '100%', padding: '12px 16px 12px 48px', background: 'white', border: '1px solid var(--rule)', borderRadius: 'var(--r)', fontSize: '14px' },
  loading: { textAlign: 'center', padding: '60px', color: 'var(--ink-4)', fontFamily: 'var(--mono)' },
  tableWrap: { background: 'white', borderRadius: 'var(--r)', border: '1px solid var(--rule)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' },
  monoCell: { fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--ink-2)' },
  dateCell: { display: 'flex', alignItems: 'center', gap: '8px' },
  statusBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' },
  fineAmount: { color: 'var(--accent)', fontWeight: '700', fontFamily: 'var(--mono)' },
  noFine: { color: 'var(--ink-4)' },
  returnBtn: { background: 'var(--navy)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' },
  completedText: { color: 'var(--teal)', fontSize: '12px', fontWeight: '500' },
  emptyState: { padding: '40px', textAlign: 'center', color: 'var(--ink-4)', fontStyle: 'italic' },
};

export default Transactions;
