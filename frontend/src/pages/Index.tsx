import React, { useState, useEffect } from "react";
import {
  Users,
  Building2,
  DollarSign,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
} from "lucide-react";

import Layout from "../components/Layout";
// import AppSidebar from "../components/AppSidebar";
import {AppSidebar} from "../components/app-sidebar.tsx";
import SlideModal from "../components/SlideModal";
import EmployeeViewModal from "../components/EmployeeViewModal";

// import Page from "../components/dashboard.tsx";

interface Employee {
  EmployeeID: number;
  FirstName: string;
  LastName: string;
  JobTitle: string;
  Department: string;
  HireDate: string;
  BankAccountNumber: string;
  Salary: string;
  Email: string;
  Phone: string;
  TaxID: string;
}

interface Department {
  id: number;
  name: string;
  manager: string;
  employeeCount: number;
}

interface PayrollRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  month: string;
  basicPay: number;
  overtime: number;
  benefits: number;
  tax: number;
  deductions: number;
  netPay: number;
}

interface LeaveRequest {
  LeaveID: number;
  FirstName: string;
  LastName: string;
  LeaveType: string;
  StartDate: string;
  EndDate: string;
  // reason: string;
  Status: "Pending" | "Approved" | "Rejected";
}

const HRPayrollSystem = () => {
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [slideModalType, setSlideModalType] = useState("");
  const [showEmployeeView, setShowEmployeeView] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  // Sample data
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/resources/layouts/employees.php")
      .then((res) => res.json())
      .then((data) => setEmployees(data[0]))
      .catch((err) => console.error("Failed to fetch employees:", err));
  }, []);

  const [departments, setDepartments] = useState<Department[]>([
    { id: 1, name: "Engineering", manager: "John Doe", employeeCount: 12 },
    { id: 2, name: "Product", manager: "Jane Smith", employeeCount: 8 },
    { id: 3, name: "Design", manager: "Mike Johnson", employeeCount: 5 },
    {
      id: 4,
      name: "Human Resources",
      manager: "Sarah Wilson",
      employeeCount: 3,
    },
  ]);

  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([
    {
      id: 1,
      employeeId: 1,
      employeeName: "John Doe",
      month: "2024-01",
      basicPay: 6250,
      overtime: 500,
      benefits: 200,
      tax: 1250,
      deductions: 100,
      netPay: 5600,
    },
    {
      id: 2,
      employeeId: 2,
      employeeName: "Jane Smith",
      month: "2024-01",
      basicPay: 7083,
      overtime: 0,
      benefits: 250,
      tax: 1400,
      deductions: 150,
      netPay: 5783,
    },
    {
      id: 3,
      employeeId: 3,
      employeeName: "Mike Johnson",
      month: "2024-01",
      basicPay: 5417,
      overtime: 200,
      benefits: 180,
      tax: 1120,
      deductions: 80,
      netPay: 4597,
    },
  ]);

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

  // { id: 3, employeeName: 'Mike Johnson', type: 'Personal Leave', startDate: '2024-02-25', endDate: '2024-02-26', reason: 'Personal matters', status: 'Rejected' }

  useEffect(() => {
    fetch("http://localhost:8000/resources/layouts/leaves.php")
      .then((res) => res.json())
      .then((data) => setLeaveRequests(data))
      .catch((err) => console.error("Failed to fetch leaves:", err));
  }, []);

  const [payrollForm, setPayrollForm] = useState({
    employeeId: "",
    month: "",
    basicPay: "",
    overtime: "",
    benefits: "",
    tax: "",
    deductions: "",
  });

  const [employeeForm, setEmployeeForm] = useState({
    EmployeeID: "",
    FirstName: "",
    LastName: "",
    JobTitle: "",
    Department: "",
    HireDate: "",
    BankAccountNumber: "",
    Salary: "",
    Email: "",
    Phone: "",
    TaxID: "",
  });

  const calculateNetPay = () => {
    const basic = parseFloat(payrollForm.basicPay) || 0;
    const overtime = parseFloat(payrollForm.overtime) || 0;
    const benefits = parseFloat(payrollForm.benefits) || 0;
    const tax = parseFloat(payrollForm.tax) || 0;
    const deductions = parseFloat(payrollForm.deductions) || 0;

    const grossPay = basic + overtime + benefits;
    const netPay = grossPay - tax - deductions;
    return { grossPay, netPay };
  };

  const handlePayrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { grossPay, netPay } = calculateNetPay();
    const employee = employees.find(
      (emp) => emp.EmployeeID === parseInt(payrollForm.employeeId)
    );

    if (employee) {
      const newRecord: PayrollRecord = {
        id: Date.now(),
        employeeId: parseInt(payrollForm.employeeId),
        employeeName: employee.FirstName,
        month: payrollForm.month,
        basicPay: parseFloat(payrollForm.basicPay),
        overtime: parseFloat(payrollForm.overtime) || 0,
        benefits: parseFloat(payrollForm.benefits) || 0,
        tax: parseFloat(payrollForm.tax) || 0,
        deductions: parseFloat(payrollForm.deductions) || 0,
        netPay,
      };

      setPayrollRecords([...payrollRecords, newRecord]);
      setPayrollForm({
        employeeId: "",
        month: "",
        basicPay: "",
        overtime: "",
        benefits: "",
        tax: "",
        deductions: "",
      });
      setShowSlideModal(false);
    }
  };

  const handleEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEmployee: Employee = {
      EmployeeID: Date.now(),
      FirstName: employeeForm.FirstName,
      LastName: employeeForm.LastName,
      JobTitle: employeeForm.JobTitle,
      Department: employeeForm.Department,
      HireDate: employeeForm.HireDate,
      BankAccountNumber: employeeForm.BankAccountNumber,
      Salary: employeeForm.Salary,
      Email: employeeForm.Email,
      Phone: employeeForm.Phone,
      TaxID: employeeForm.TaxID,
    };

    
      try {
        const response = await fetch(
          "http://localhost:8000/resources/layouts/add_employee.php",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newEmployee),
          }
        );

        const result = await response.json();
        console.log("Server Response:", result);
      } catch (error) {
        console.error("Error submitting employee:", error);
      }

    setEmployees([...employees, newEmployee]);
    setEmployeeForm({
      EmployeeID: "",
      FirstName: "",
      LastName: "",
      JobTitle: "",
      Department: "",
      HireDate: "",
      BankAccountNumber: "",
      Salary: "",
      Email: "",
      Phone: "",
      TaxID: "",
    });
    setShowSlideModal(false);
  };

  const openSlideModal = (type: string) => {
    setSlideModalType(type);
    setShowSlideModal(true);
  };

  const closeSlideModal = () => {
    setShowSlideModal(false);
    setSlideModalType("");
  };

  const viewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeView(true);
  };

  const renderDashboard = () => (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stats Cards with modern gradient design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl shadow-sm border border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Total Employees
              </p>
              <p className="text-3xl font-bold text-blue-900">
                {employees.length}
              </p>
              <p className="text-sm text-blue-700 mt-1">+2 this month</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-2xl shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl shadow-sm border border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Departments</p>
              <p className="text-3xl font-bold text-green-900">
                {departments.length}
              </p>
              <p className="text-sm text-green-700 mt-1">All active</p>
            </div>
            <div className="p-3 bg-green-500 rounded-2xl shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl shadow-sm border border-yellow-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">
                Monthly Payroll
              </p>
              <p className="text-3xl font-bold text-yellow-900">$47,980</p>
              <p className="text-sm text-yellow-700 mt-1">
                +5.2% from last month
              </p>
            </div>
            <div className="p-3 bg-yellow-500 rounded-2xl shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl shadow-sm border border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">
                Pending Leaves
              </p>
              <p className="text-3xl font-bold text-purple-900">
                {
                  (Array.isArray(leaveRequests) ? leaveRequests : []).filter(
                    (l) => l.Status === "Pending"
                  ).length
                }
              </p>
              <p className="text-sm text-purple-700 mt-1">Requires attention</p>
            </div>
            <div className="p-3 bg-purple-500 rounded-2xl shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity with modern cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Employees
          </h3>
          <div className="space-y-3">
            {employees.slice(0, 3).map((employee) => (
              <div
                key={employee.EmployeeID}
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-blue-50 hover:to-blue-100 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {/* {employee.FirstName.split(' ').map(n => n[0]).join('')} */}
                  {employee.FirstName}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {employee.FirstName}
                  </p>
                  <p className="text-sm text-gray-600">{employee.JobTitle}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{employee.Department}</p>
                  <p className="text-xs text-gray-400">{employee.HireDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Leave Requests
          </h3>
          <div className="space-y-3">
            {leaveRequests.slice(0, 3).map((leave) => (
              // console.log(Object.values(leaveRequests));

              <div
                key={leave.LeaveID}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {leave.FirstName}
                    {leave.LastName}
                  </p>
                  <p className="text-sm text-gray-600">{leave.LeaveType}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                      leave.Status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : leave.Status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {leave.Status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {leave.StartDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmployees = () => (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Employees
        </h1>
        <button
          onClick={() => openSlideModal("add-employee")}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          <span>Add Employee</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hire Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salary
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr
                  key={employee.EmployeeID}
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {employee.FirstName.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.FirstName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.Email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.JobTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.Department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.HireDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    ${employee.Salary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => viewEmployee(employee)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-100 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPayroll = () => (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Payroll
        </h1>
        <button
          onClick={() => openSlideModal("add-payroll")}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="h-4 w-4" />
          <span>New Payrun</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Basic Pay
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Overtime
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Benefits
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deductions
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Pay
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payrollRecords.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.employeeName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${record.basicPay.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${record.overtime.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${record.benefits.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    -${record.tax.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    -${record.deductions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    ${record.netPay.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-100 transition-colors">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSlideModalContent = () => {
    if (slideModalType === "add-payroll") {
      const { grossPay, netPay } = calculateNetPay();

      return (
        <form onSubmit={handlePayrollSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employee
            </label>
            <select
              value={payrollForm.employeeId}
              onChange={(e) =>
                setPayrollForm({ ...payrollForm, employeeId: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.EmployeeID} value={emp.EmployeeID}>
                  {emp.FirstName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Month
            </label>
            <input
              type="month"
              value={payrollForm.month}
              onChange={(e) =>
                setPayrollForm({ ...payrollForm, month: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Basic Pay
            </label>
            <input
              type="number"
              value={payrollForm.basicPay}
              onChange={(e) =>
                setPayrollForm({ ...payrollForm, basicPay: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="0.00"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overtime
              </label>
              <input
                type="number"
                value={payrollForm.overtime}
                onChange={(e) =>
                  setPayrollForm({ ...payrollForm, overtime: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefits
              </label>
              <input
                type="number"
                value={payrollForm.benefits}
                onChange={(e) =>
                  setPayrollForm({ ...payrollForm, benefits: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax
              </label>
              <input
                type="number"
                value={payrollForm.tax}
                onChange={(e) =>
                  setPayrollForm({ ...payrollForm, tax: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deductions
              </label>
              <input
                type="number"
                value={payrollForm.deductions}
                onChange={(e) =>
                  setPayrollForm({ ...payrollForm, deductions: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="0.00"
              />
            </div>
          </div>

          {(payrollForm.basicPay ||
            payrollForm.overtime ||
            payrollForm.benefits ||
            payrollForm.tax ||
            payrollForm.deductions) && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Gross Pay:</span>
                <span className="font-semibold text-blue-900">
                  ${grossPay.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Net Pay:</span>
                <span className="font-bold text-green-600 text-lg">
                  ${netPay.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg"
            >
              Create Payrun
            </button>
            <button
              type="button"
              onClick={closeSlideModal}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      );
    }

    if (slideModalType === "add-employee") {
      return (
        <form onSubmit={handleEmployeeSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={employeeForm.FirstName}
              onChange={(e) =>
                setEmployeeForm({ ...employeeForm, FirstName: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={employeeForm.LastName}
              onChange={(e) =>
                setEmployeeForm({ ...employeeForm, LastName: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <input
              type="text"
              value={employeeForm.JobTitle}
              onChange={(e) =>
                setEmployeeForm({ ...employeeForm, JobTitle: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Job title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={employeeForm.Department}
              onChange={(e) =>
                setEmployeeForm({ ...employeeForm, Department: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hire Date
              </label>
              <input
                type="date"
                value={employeeForm.HireDate}
                onChange={(e) =>
                  setEmployeeForm({ ...employeeForm, HireDate: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary
              </label>
              <input
                type="number"
                value={employeeForm.Salary}
                onChange={(e) =>
                  setEmployeeForm({ ...employeeForm, Salary: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Monthly salary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={employeeForm.Email}
              onChange={(e) =>
                setEmployeeForm({ ...employeeForm, Email: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="email@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Account Number
            </label>
            <input
              type="text"
              value={employeeForm.BankAccountNumber}
              onChange={(e) =>
                setEmployeeForm({
                  ...employeeForm,
                  BankAccountNumber: e.target.value,
                })
              }
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="A9H28HI2342UE"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax ID
            </label>
            <input
              type="text"
              value={employeeForm.TaxID}
              onChange={(e) =>
                setEmployeeForm({ ...employeeForm, TaxID: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="TAX001"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={employeeForm.Phone}
              onChange={(e) =>
                setEmployeeForm({ ...employeeForm, Phone: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="+1-555-0123"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg"
            >
              Add Employee
            </button>
            <button
              type="button"
              onClick={closeSlideModal}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      );
    }

    return null;
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case "dashboard":
        return renderDashboard();
      case "employees":
        return renderEmployees();
      case "payroll":
        return renderPayroll();
      case "departments":
        return (
          <div className="space-y-6 p-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Departments
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {dept.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Manager: {dept.manager}
                  </p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {dept.employeeCount} employees
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      case "leave":
        return (
          <div className="space-y-6 p-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Leave Management
            </h1>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        End Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaveRequests.map((leave) => (
                      <tr
                        key={leave.LeaveID}
                        className="hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 transition-all duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {leave.FirstName}
                          {leave.LastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {leave.LeaveType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {leave.StartDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {leave.EndDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                              leave.Status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : leave.Status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {leave.Status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-100 transition-colors">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-6 p-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Settings
            </h1>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Company Profile
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    defaultValue="TechCorp Solutions"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="admin@techcorp.com"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <Layout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="flex min-h-screen">
        <AppSidebar/>

        {/* Main content with proper left margin for sidebar */}
        <main className="flex-1 lg:ml-64">{renderCurrentSection()}</main>
      </div>

      {/* Slide Modal */}
      <SlideModal
        isOpen={showSlideModal}
        onClose={closeSlideModal}
        title={
          slideModalType === "add-employee" ? "Add New Employee" : "New Payrun"
        }
      >
        {renderSlideModalContent()}
      </SlideModal>

      {/* Employee View Modal */}
      {/* <EmployeeViewModal
        isOpen={showEmployeeView}
        onClose={() => setShowEmployeeView(false)}
        employee={selectedEmployee}
      /> */}
    </Layout>
  );
};

export default HRPayrollSystem;
