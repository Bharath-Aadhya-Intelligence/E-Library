import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  Clock, 
  CircleDollarSign, 
  Library,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.loading}>Loading library statistics...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h2 style={styles.title}>Library Overview</h2>
          <p style={styles.subtitle}>Real-time monitoring of inventory and circulation.</p>
        </div>
        <div style={styles.dateBadge}>
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </header>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.grid}>
        <StatCard 
          icon={<BookOpen size={24} />} 
          label="Total Books" 
          value={stats?.totalBooks || 0} 
          color="var(--navy)" 
          bg="var(--navy-pale)" 
        />
        <StatCard 
          icon={<Users size={24} />} 
          label="Active Students" 
          value={stats?.totalStudents || 0} 
          color="var(--teal)" 
          bg="var(--teal-pale)" 
        />
        <StatCard 
          icon={<Library size={24} />} 
          label="Books Issued" 
          value={stats?.issuedBooks || 0} 
          color="var(--accent)" 
          bg="var(--accent-pale)" 
        />
        <StatCard 
          icon={<AlertTriangle size={24} />} 
          label="Overdue Returns" 
          value={stats?.overdueCount || 0} 
          color="var(--gold)" 
          bg="var(--gold-pale)" 
          warning={stats?.overdueCount > 0}
        />
      </div>

      <div style={styles.fineSection}>
        <div style={styles.fineCard}>
          <div style={styles.fineInfo}>
            <CircleDollarSign size={32} color="var(--accent)" />
            <div>
              <h3 style={styles.fineTitle}>Total Fines Collected</h3>
              <p style={styles.fineDesc}>Revenue from overdue book returns</p>
            </div>
          </div>
          <div style={styles.fineValue}>
            ₹{stats?.totalFines?.toFixed(2) || '0.00'}
          </div>
        </div>
      </div>

      <div style={styles.recentActivity}>
        <h3 style={styles.sectionTitle}>System Status</h3>
        <div style={styles.statusGrid}>
          <StatusItem label="Database" status="Connected" color="var(--teal)" />
          <StatusItem label="API Gateway" status="Operational" color="var(--teal)" />
          <StatusItem label="Auth Service" status="Stateless / JWT" color="var(--navy)" />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, bg, warning }) => (
  <div style={{...styles.card, borderTop: warning ? '3px solid var(--gold)' : '1px solid var(--rule)'}}>
    <div style={{...styles.iconWrapper, background: bg, color: color}}>
      {icon}
    </div>
    <div style={styles.cardContent}>
      <p style={styles.cardLabel}>{label}</p>
      <h3 style={styles.cardValue}>{value}</h3>
    </div>
    <div style={styles.cardTrend}>
      <TrendingUp size={14} />
      <span>Live</span>
    </div>
  </div>
);

const StatusItem = ({ label, status, color }) => (
  <div style={styles.statusItem}>
    <span style={styles.statusLabel}>{label}</span>
    <div style={styles.statusIndicator}>
      <div style={{...styles.dot, background: color}}></div>
      <span style={{color: color, fontWeight: '600'}}>{status}</span>
    </div>
  </div>
);

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  loading: {
    fontFamily: 'var(--mono)',
    color: 'var(--ink-4)',
    textAlign: 'center',
    padding: '100px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '40px',
  },
  title: {
    fontFamily: 'var(--serif)',
    fontSize: '32px',
    fontWeight: '700',
    color: 'var(--ink)',
    marginBottom: '4px',
  },
  subtitle: {
    color: 'var(--ink-3)',
    fontSize: '16px',
  },
  dateBadge: {
    fontFamily: 'var(--mono)',
    fontSize: '12px',
    background: 'var(--paper-3)',
    padding: '6px 16px',
    borderRadius: '20px',
    color: 'var(--ink-2)',
    fontWeight: '500',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  card: {
    background: 'white',
    padding: '24px',
    borderRadius: 'var(--r)',
    border: '1px solid var(--rule)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  iconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  cardContent: {
    marginBottom: '16px',
  },
  cardLabel: {
    fontFamily: 'var(--mono)',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--ink-4)',
    marginBottom: '4px',
  },
  cardValue: {
    fontFamily: 'var(--serif)',
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--ink)',
  },
  cardTrend: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    color: 'var(--teal)',
    fontFamily: 'var(--mono)',
  },
  fineSection: {
    marginBottom: '40px',
  },
  fineCard: {
    background: 'var(--ink)',
    padding: '32px',
    borderRadius: 'var(--r)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
  },
  fineInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  fineTitle: {
    fontFamily: 'var(--serif)',
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '4px',
  },
  fineDesc: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.5)',
  },
  fineValue: {
    fontFamily: 'var(--serif)',
    fontSize: '36px',
    fontWeight: '700',
    color: 'var(--accent-2)',
  },
  recentActivity: {
    background: 'var(--paper-2)',
    padding: '32px',
    borderRadius: 'var(--r)',
    border: '1px solid var(--rule)',
  },
  sectionTitle: {
    fontFamily: 'var(--serif)',
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px',
    color: 'var(--ink)',
  },
  statusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '32px',
  },
  statusItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  statusLabel: {
    fontFamily: 'var(--mono)',
    fontSize: '11px',
    textTransform: 'uppercase',
    color: 'var(--ink-4)',
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  error: {
    padding: '16px',
    background: '#fef2f2',
    color: '#991b1b',
    borderRadius: 'var(--r)',
    marginBottom: '24px',
    fontSize: '14px',
    border: '1px solid #fecaca',
  },
};

export default Dashboard;
