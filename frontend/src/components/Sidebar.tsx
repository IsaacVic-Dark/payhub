
import React from 'react';
import { 
  Building2, 
  X,
  Home,
  Users,
  DollarSign,
  Calendar,
  BarChart3,
  Settings
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  currentSection, 
  setCurrentSection 
}) => {
  const navigation = [
    { name: 'Dashboard', icon: Home, section: 'dashboard' },
    { name: 'Employees', icon: Users, section: 'employees' },
    { name: 'Departments', icon: Building2, section: 'departments' },
    { name: 'Payroll', icon: DollarSign, section: 'payroll' },
    { name: 'Leave Management', icon: Calendar, section: 'leave' },
    { name: 'Reports', icon: BarChart3, section: 'reports' },
    { name: 'Settings', icon: Settings, section: 'settings' },
    { name: 'Dash', icon: Settings, section: 'settings' }

  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">HR Portal</span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.section}
                onClick={() => {
                  setCurrentSection(item.section);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  currentSection === item.section
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:scale-105'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
