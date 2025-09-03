import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  CreditCard, 
  Settings, 
  Home, 
  Mail,
  Smartphone,
  Bot,
  MapPin
} from 'lucide-react';

export type AdminPageType = 'overview' | 'products' | 'orders' | 'gmail-accounts' | 'cards' | 'analytics' | 'settings' | 'ios-accounts' | 'franxx-management' | 'address-management';

export const menuItems = [
  {
    title: '总览',
    items: [
      { title: '仪表板', icon: Home, page: 'overview' as AdminPageType }
    ]
  },
  {
    title: '业务管理',
    items: [
      { title: '商品管理', icon: Package, page: 'products' as AdminPageType },
      { title: '订单管理', icon: ShoppingCart, page: 'orders' as AdminPageType }
    ]
  },
  {
    title: '资源管理',
    items: [
      { title: '虚拟卡管理', icon: CreditCard, page: 'cards' as AdminPageType },
      { title: 'Gmail账号管理', icon: Mail, page: 'gmail-accounts' as AdminPageType },
      { title: 'iOS账号管理', icon: Smartphone, page: 'ios-accounts' as AdminPageType },
      { title: '地址管理', icon: MapPin, page: 'address-management' as AdminPageType },
      { title: '机体管理', icon: Bot, page: 'franxx-management' as AdminPageType }
    ]
  },
  {
    title: '数据中心',
    items: [
      { title: '数据分析', icon: BarChart3, page: 'analytics' as AdminPageType }
    ]
  },
  {
    title: '系统',
    items: [
      { title: '系统设置', icon: Settings, page: 'settings' as AdminPageType }
    ]
  }
];

export const getCurrentPageTitle = (currentAdminPage: AdminPageType) => {
  const allItems = menuItems.flatMap(group => group.items);
  const currentItem = allItems.find(item => item.page === currentAdminPage);
  return currentItem?.title || '仪表板';
};