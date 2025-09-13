import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminPageType } from './constants';

interface AdminDashboardProps {
  onBackToMain?: () => void;
}

export function AdminDashboard({ onBackToMain }: AdminDashboardProps = {}) {
  const { user, logout } = useAuth();
  const [currentAdminPage, setCurrentAdminPage] = useState<AdminPageType>('overview');

  const handleBackToMain = () => {
    if (onBackToMain) {
      onBackToMain();
    } else {
      window.location.href = '/';
    }
  };

  const handleSignOut = async () => {
    try {
      if (logout) {
        await logout();
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const renderAdminPage = () => {
    switch (currentAdminPage) {
      case 'overview':
        return <DashboardOverview />;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'gmail-accounts':
        return <GmailAccountManagement />;
      case 'ios-accounts':
        return <IOSAccountManagement />;
      case 'cards':
        return <VirtualCardManagement />;
      case 'analytics':
        return <DataAnalytics />;
      case 'settings':
        return <SystemSettings />;
      case 'franxx-management':
        return <FranxxManagement />;
      case 'address-management':
        return <AddressManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <SidebarProvider>
      <AdminSidebar
        currentAdminPage={currentAdminPage}
        setCurrentAdminPage={setCurrentAdminPage}
        onBackToMain={handleBackToMain}
        onSignOut={handleSignOut}
      />
      
      <SidebarInset>
        <AdminHeader currentAdminPage={currentAdminPage} />
        
        {/* 主要内容区域 */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {renderAdminPage()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

// 动态加载各子页面，减少首次进入后台的 JS 体积与解析时间
const Loading = () => <div className="p-6 text-muted-foreground">加载中...</div>;

const DashboardOverview = dynamic(
  () => import('./DashboardOverview').then(m => ({ default: m.DashboardOverview })),
  { ssr: false, loading: Loading }
)

const ProductManagement = dynamic(
  () => import('./ProductManagement').then(m => ({ default: m.ProductManagement })),
  { ssr: false, loading: Loading }
)

const OrderManagement = dynamic(
  () => import('./OrderManagement').then(m => ({ default: m.OrderManagement })),
  { ssr: false, loading: Loading }
)

const GmailAccountManagement = dynamic(
  () => import('./GmailAccountManagement').then(m => ({ default: m.GmailAccountManagement })),
  { ssr: false, loading: Loading }
)

const IOSAccountManagement = dynamic(
  () => import('./IOSAccountManagement').then(m => ({ default: m.IOSAccountManagement })),
  { ssr: false, loading: Loading }
)

const VirtualCardManagement = dynamic(
  () => import('./VirtualCardManagement').then(m => ({ default: m.VirtualCardManagement })),
  { ssr: false, loading: Loading }
)

const DataAnalytics = dynamic(
  () => import('./DataAnalytics').then(m => ({ default: m.DataAnalytics })),
  { ssr: false, loading: Loading }
)

const SystemSettings = dynamic(
  () => import('./SystemSettings').then(m => ({ default: m.SystemSettings })),
  { ssr: false, loading: Loading }
)

const FranxxManagement = dynamic(
  () => import('./FranxxManagement').then(m => ({ default: m.FranxxManagement })),
  { ssr: false, loading: Loading }
)

const AddressManagement = dynamic(
  () => import('./AddressManagement').then(m => ({ default: m.AddressManagement })),
  { ssr: false, loading: Loading }
)
