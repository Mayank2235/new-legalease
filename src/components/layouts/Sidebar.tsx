import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  Scale, 
  Home, 
  Users, 
  Calendar, 
  User, 
  LogOut,
  Briefcase 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const clientNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ];

  const lawyerNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Cases', href: '/dashboard/cases', icon: Briefcase },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ];

  const navigation = user?.role === 'LAWYER' ? lawyerNavigation : clientNavigation;

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 lg:block hidden">
      <div className="flex h-16 items-center px-6 border-b">
        <Scale className="h-8 w-8 text-blue-600" />
        <span className="ml-2 text-xl font-semibold">LegalEase</span>
      </div>
      
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role.toLowerCase()}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={logout} className="w-full justify-start">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;


