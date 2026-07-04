import {
  LayoutDashboard,
  Wallet,
  Receipt,
  Tags,
  PieChart,
  Target,
  BarChart3,
  Settings,
} from 'lucide-react';

export interface NavItemType {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
}

export const NAVIGATION_ITEMS: NavItemType[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Accounts',
    href: '/accounts',
    icon: Wallet,
  },
  {
    title: 'Transactions',
    href: '/transactions',
    icon: Receipt,
  },
  {
    title: 'Categories',
    href: '/categories',
    icon: Tags,
  },
  {
    title: 'Budgets',
    href: '/budgets',
    icon: PieChart,
  },
  {
    title: 'Goals',
    href: '/goals',
    icon: Target,
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: BarChart3,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];
