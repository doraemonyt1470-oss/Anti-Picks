import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Star,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLayout({ children }) {
  const { adminUser, isAuthenticated, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-mono">Verifying admin session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/adashishmin/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { label: 'Dashboard', path: '/adashishmin', icon: LayoutDashboard },
    { label: 'Products', path: '/adashishmin/products', icon: Package },
    { label: 'Categories', path: '/adashishmin/categories', icon: FolderTree },
    { label: 'Ratings', path: '/adashishmin/ratings', icon: Star },
    { label: 'Analytics', path: '/adashishmin/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/adashishmin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/adashishmin/login');
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] flex flex-col lg:flex-row text-neutral-900 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-black text-white shrink-0 border-r border-neutral-800 justify-between">
        <div className="p-6">
          {/* Admin Header */}
          <div className="flex items-center gap-3 pb-6 border-b border-neutral-800">
            <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-display font-black text-lg">
              A
            </div>
            <div>
              <h1 className="font-display font-bold text-base tracking-tight leading-tight m-0 text-white">ANTI PICKS</h1>
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                Control Room
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/adashishmin'
                  ? location.pathname === '/adashishmin'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-white text-black shadow-xs'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-neutral-800 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              Public Website
            </span>
          </Link>

          <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
            <div className="text-[11px] truncate max-w-[130px] text-neutral-400">
              {adminUser?.email || 'admin@antipicks.com'}
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-neutral-400 hover:text-red-400 rounded-lg hover:bg-neutral-900 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-black text-white border-b border-neutral-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center font-display font-black text-sm">
            A
          </div>
          <span className="font-display font-bold text-base">ANTI PICKS ADMIN</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-neutral-400 hover:text-white rounded-lg"
          aria-label="Open Admin Menu"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-xs flex"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            className="w-3/4 max-w-xs h-full bg-black text-white p-6 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <span className="font-display font-bold text-lg">Admin Navigation</span>
                <button onClick={() => setMobileSidebarOpen(false)}>
                  <X className="w-5 h-5 text-neutral-400" />
                </button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.path === '/adashishmin'
                      ? location.pathname === '/adashishmin'
                      : location.pathname.startsWith(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                        isActive ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-neutral-800 space-y-3">
              <Link
                to="/"
                target="_blank"
                className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Live Site</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow p-4 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
