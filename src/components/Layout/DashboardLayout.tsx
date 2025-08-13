import React, { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Building2, 
  Package, 
  CreditCard, 
  Users, 
  Settings, 
  LogOut,
  BarChart3,
  Home
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, tenant, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isSuperAdmin = user?.role === 'super_admin';

  const sidebarItems = isSuperAdmin 
    ? [
        { icon: Home, label: 'Dashboard', path: '/super-admin' },
        { icon: Building2, label: 'Tenants', path: '/super-admin/tenants' },
        { icon: BarChart3, label: 'Analytics', path: '/super-admin/analytics' },
        { icon: Settings, label: 'Settings', path: '/super-admin/settings' },
      ]
    : [
        { icon: Home, label: 'Dashboard', path: '/dashboard' },
        { icon: Package, label: 'Products', path: '/products' },
        { icon: Users, label: 'Team', path: '/team' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
        { icon: Settings, label: 'Settings', path: '/settings' },
      ];

  return (
    <div className="dashboard-container">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="dashboard-sidebar w-64 flex flex-col">
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">
                  {isSuperAdmin ? 'Super Admin' : tenant?.name || 'SaaS Platform'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isSuperAdmin ? 'System Administration' : 'Management Portal'}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-custom ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3 mb-4 p-3 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-primary-foreground">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.email}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-card border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">
                {isSuperAdmin ? 'Super Admin Portal' : 'Dashboard'}
              </h1>
              
              {!isSuperAdmin && tenant && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span>{tenant.name}</span>
                </div>
              )}
            </div>
          </header>

          <main className="dashboard-content flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;