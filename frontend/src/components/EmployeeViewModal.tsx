
import React from 'react';
import { X, Mail, Phone, Calendar, Building2, DollarSign, MapPin } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  hireDate: string;
  salary: number;
  email: string;
  phone: string;
}

interface EmployeeViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

const EmployeeViewModal: React.FC<EmployeeViewModalProps> = ({ isOpen, onClose, employee }) => {
  if (!employee) return null;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Modal */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
          <h3 className="text-lg font-semibold text-white">Employee Details</h3>
          <button 
            onClick={onClose} 
            className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto h-full pb-20">
          {/* Employee Header */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {employee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{employee.name}</h2>
              <p className="text-lg text-gray-600">{employee.position}</p>
              <p className="text-sm text-gray-500">{employee.department}</p>
            </div>
          </div>

          {/* Employee Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <Mail className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-gray-700">Email</span>
              </div>
              <p className="text-gray-900 ml-8">{employee.email}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <Phone className="h-5 w-5 text-green-500" />
                <span className="font-medium text-gray-700">Phone</span>
              </div>
              <p className="text-gray-900 ml-8">{employee.phone}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <Building2 className="h-5 w-5 text-purple-500" />
                <span className="font-medium text-gray-700">Department</span>
              </div>
              <p className="text-gray-900 ml-8">{employee.department}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <Calendar className="h-5 w-5 text-orange-500" />
                <span className="font-medium text-gray-700">Hire Date</span>
              </div>
              <p className="text-gray-900 ml-8">{employee.hireDate}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-700">Salary</span>
              </div>
              <p className="text-gray-900 ml-8 font-semibold">${employee.salary.toLocaleString()}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <MapPin className="h-5 w-5 text-red-500" />
                <span className="font-medium text-gray-700">Employee ID</span>
              </div>
              <p className="text-gray-900 ml-8">EMP-{employee.id.toString().padStart(4, '0')}</p>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Summary</h3>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.floor((new Date().getTime() - new Date(employee.hireDate).getTime()) / (1000 * 60 * 60 * 24 * 365))}
                  </p>
                  <p className="text-sm text-gray-600">Years of Service</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">Active</p>
                  <p className="text-sm text-gray-600">Status</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">Full-time</p>
                  <p className="text-sm text-gray-600">Employment Type</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeViewModal;
