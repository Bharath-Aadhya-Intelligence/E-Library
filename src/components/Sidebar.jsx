import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  ArrowLeftRight, 
  LogOut,
  Library
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const fullName = localStorage.getItem('fullName');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, adminOnly: true },
    { name: 'Books', path: '/books', icon: BookOpen, adminOnly: false },
    { name: 'Students', path: '/students', icon: Users, adminOnly: true },
    { name: 'Issue Book', path: '/issue-book', icon: Library, adminOnly: true },
    { name: 'Transactions', path: '/transactions', icon: ArrowLeftRight, adminOnly: false },
  ];

  const filteredItems = navItems.filter(item => !item.adminOnly || role === 'admin');

  return (
    <aside style={styles.sidebar}>
      <div style={styles.header}>
        <Library size={24} color="var(--accent-2)" />
        <h1 style={styles.title}>E-Library</h1>
      </div>
      
      <div style={styles.userProfile}>
        <div style={styles.avatar}>
          {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
        </div>
        <div style={styles.userInfo}>
          <p style={styles.userName}>{fullName || 'User'}</p>
          <p style={styles.userRole}>{role === 'admin' ? 'Administrator' : 'Student'}</p>
        </div>
      </div>

      <nav style={styles.nav}>
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.navLink,
              backgroundColor: isActive ? 'var(--paper-3)' : 'transparent',
              color: isActive ? 'var(--accent)' : 'var(--ink-2)',
              borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
            })}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <button onClick={handleLogout} style={styles.logoutBtn}>
        <LogOut size={18} />
        <span>Sign Out</span>
      </button>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '260px',
    background: 'var(--paper-2)',
    borderRight: '1px solid var(--rule)',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 0',
    height: '100vh',
    position: 'sticky',
    top: 0,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 24px',
    marginBottom: '40px',
  },
  title: {
    fontFamily: 'var(--serif)',
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--ink)',
    letterSpacing: '-0.02em',
  },
  userProfile: {
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'var(--ink)',
    color: 'var(--paper)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--mono)',
    fontWeight: '600',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--ink)',
    margin: 0,
    lineHeight: 1.2,
  },
  userRole: {
    fontSize: '11px',
    fontFamily: 'var(--mono)',
    color: 'var(--ink-4)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginTop: '2px',
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 24px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  logoutBtn: {
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 24px',
    background: 'transparent',
    border: 'none',
    color: 'var(--ink-3)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
};

export default Sidebar;
