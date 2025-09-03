import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Calendar, Users, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null;

  const isDoctorRole = user.role === 'DOCTOR';
  const dashboardPath = isDoctorRole ? '/doctor/dashboard' : '/patient/dashboard';
  const appointmentsPath = isDoctorRole ? '/doctor/dashboard' : '/patient/appointments';

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href={dashboardPath} className="flex items-center space-x-2">
              <Calendar className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">MediCare</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href={dashboardPath}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                {isDoctorRole ? <Users className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                <span>Dashboard</span>
              </Link>
              
              {!isDoctorRole && (
                <Link
                  href={appointmentsPath}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>My Appointments</span>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {user.photo_url ? (
                <img
                  src={user.photo_url}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};