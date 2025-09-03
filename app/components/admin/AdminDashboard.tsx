import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SidebarProvider, SidebarInset } from '../ui/sidebar';
import { DashboardOverview } from './DashboardOverview';
import { ProductManagement } from './ProductManagement';
import { OrderManagement } from './OrderManagement';
import { GmailAccountManagement } from './GmailAccountManagement';
import { IOSAccountManagement } from './IOSAccountManagement';
import { VirtualCardManagement } from './VirtualCardManagement';
import { DataAnalytics } from './DataAnalytics';
import { SystemSettings } from './SystemSettings';
import { FranxxManagement } from './FranxxManagement';
import { AddressManagement } from './AddressManagement';
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
      handleBackToMain();
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