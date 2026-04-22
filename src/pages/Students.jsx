import React, { useState, useEffect } from 'react';
import { Search, User, Mail, Phone, GraduationCap, Calendar, Hash, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students/');
      setStudents(response.data);
    } catch (err) {
      setError('Failed to fetch students list');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.student_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h2 style={styles.title}>Student Directory</h2>
          <p style={styles.subtitle}>Review and manage registered library members.</p>
        </div>
      </header>

      <div style={styles.controls}>
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name, email, or Student ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading student database...</div>
      ) : (
        <div style={styles.grid}>
          {filteredStudents.map(student => (
            <div key={student._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.avatar}>
                  {student.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={styles.studentName}>{student.full_name}</h3>
                  <div style={styles.studentId}>
                    <Hash size={12} />
                    <span>{student.student_id}</span>
                  </div>
                </div>
                {student.is_active && (
                  <div style={styles.statusBadge}>
                    <ShieldCheck size={12} />
                    <span>Active</span>
                  </div>
                )}
              </div>

              <div style={styles.cardBody}>
                <div style={styles.infoRow}>
                  <Mail size={14} style={styles.infoIcon} />
                  <span>{student.email}</span>
                </div>
                <div style={styles.infoRow}>
                  <Phone size={14} style={styles.infoIcon} />
                  <span>{student.phone}</span>
                </div>
                <div style={styles.divider}></div>
                <div style={styles.academicInfo}>
                  <div style={styles.academicItem}>
                    <label>Course</label>
                    <div style={styles.academicValue}>
                      <GraduationCap size={14} />
                      <span>{student.course}</span>
                    </div>
                  </div>
                  <div style={styles.academicItem}>
                    <label>Year</label>
                    <div style={styles.academicValue}>
                      <Calendar size={14} />
                      <span>{student.year}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredStudents.length === 0 && (
        <div style={styles.emptyState}>No students found matching your query.</div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto' },
  header: { marginBottom: '32px' },
  title: { fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: '700', color: 'var(--ink)' },
  subtitle: { color: 'var(--ink-3)', fontSize: '15px' },
  controls: { marginBottom: '32px' },
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  card: {
    background: 'white',
    borderRadius: 'var(--r)',
    border: '1px solid var(--rule)',
    padding: '24px',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', position: 'relative' },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'var(--paper-2)',
    color: 'var(--ink)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--serif)',
    fontSize: '20px',
    fontWeight: '700',
  },
  studentName: { fontSize: '16px', fontWeight: '700', color: 'var(--ink)', marginBottom: '4px' },
  studentId: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontFamily: 'var(--mono)', color: 'var(--ink-4)', textTransform: 'uppercase' },
  statusBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    background: 'var(--teal-pale)',
    color: 'var(--teal)',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    textTransform: 'uppercase',
  },
  cardBody: { display: 'flex', flexDirection: 'column', gap: '10px' },
  infoRow: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--ink-2)' },
  infoIcon: { color: 'var(--ink-4)' },
  divider: { height: '1px', background: 'var(--paper-3)', margin: '10px 0' },
  academicInfo: { display: 'flex', gap: '24px' },
  academicItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  academicValue: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: 'var(--ink)' },
  emptyState: { padding: '40px', textAlign: 'center', color: 'var(--ink-4)', fontStyle: 'italic' },
};

export default Students;
