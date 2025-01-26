import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Login from "./pages/Login";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";
import AdminSummary from "./components/dashboard/AdminSummary";
import DepartmentList from "./components/department/DepartmentList";
import AddDepartment from "./components/department/AddDepartment";
import EditDepartment from "./components/department/EditDepartment";
import EmployeeList from "./components/employee/EmployeeList";
import AddEmployee from "./components/employee/AddEmployee";
import EditEmployee from "./components/employee/EditEmployee";
import ViewEmployee from "./components/employee/ViewEmployee";
import AddSalary from "./components/salary/AddSalary";
import EditSalary from "./components/salary/EditSalary";
import SalaryOptions from "./components/salary/ViewSalary";
import EmployeeSummary from "./components/employee-dashboard/EmployeeSummary";
import ViewEmployeeSalary from "./components/employee-dashboard/ViewEmployeeSalary";
import ApplyLeave from "./components/leave/ApplyLeave";
import EditLeave from "./components/leave/EditLeave";
import ViewLeaveHistory from "./components/leave/ViewLeaveHistory";
import ViewAllLeaves from "./components/leave-admin/ViewAllLeaves";
import ViewEmployeeSalaryAdmin from "./components/salary/ViewEmployeeSalaryAdmin";
import ViewEmployeeLeave from "./components/leave/ViewEmployeeLeave";
import ViewAllAllowances from "./components/allowances/ViewAllAllowances";
import ApplyAllowance from "./components/allowances/ApplyAllowances";
import ViewEmployeeAllowance from "./components/allowances/ViewEmployeeAllowance";
import EditAllowances from "./components/allowances/EditAllowances";
import ViewDepartment from "./components/department/ViewDepartment";
import ApproveAllowances from "./components/allowances/ApproveAllowances";
import ApplyAllowancesAdmin from "./components/allowances/ApplyAllowancesAdmin";
import EditAllowancesAdmin from "./components/allowances/EditAllowancesAdmin";
import ViewEmployeesLeaveCount from "./components/leave/ViewEmployeesLeaveCount";
import AccountsDashboard from "./pages/AccountsDashboard";
import HrDashboard from "./pages/HrDashboard";
import EditLeaveBalances from "./components/leave/EditLeaveBalances";
import UsersData from "./components/hr-dashboard/UsersData";
import Helpdesk from "./components/hr-dashboard/Helpdesk";
import EmployeeHelpdesk from "./components/helpdesk/EmployeeHelpdesk";
import ApplyHelp from "./components/helpdesk/ApplyHelp";
import EditHelp from "./components/helpdesk/EditHelp";
import AlterHoliday from "./components/holiday/AlterHoliday";
import ViewPerformanceAdmin from "./components/performance/ViewPerformanceAdmin";
import ViewPerformanceEmployee from "./components/performance/ViewPerformanceEmployee";
import ViewHoliday from "./components/holiday/ViewHoliday";
import ViewAllFixedAllowance from "./components/fixed-allowances/ViewAllFixedAllowance";
import AddFixedAllowanceAdmin from "./components/fixed-allowances/AddFixedAllowancesAdmin";
import OnboardingOffboarding from "./components/hr-dashboard/OnboardingOffboarding";
import Password from "./components/employee-dashboard/Password";
import EditFixedAllowancesAdmin from "./components/fixed-allowances/EditFixedAllowancesAdmin";
import ViewEmployeeCTC from "./components/employee-dashboard/ViewEmployeeCTC";
import ViewAppliedLeavesTeamLead from "./components/leave/ViewAppliedLeavesTeamLead";
import HrChangePassword from "./components/hr-dashboard/HrChangePassword";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Dashboard Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin"]}>
                <AdminDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<AdminSummary />} />
          <Route
            path="/admin-dashboard/departments"
            element={<DepartmentList />}
          />
          <Route
            path="/admin-dashboard/add-department"
            element={<AddDepartment />}
          />
          <Route
            path="/admin-dashboard/departments/viewemployees/:_id"
            element={<ViewDepartment />}
          />
          <Route
            path="/admin-dashboard/departments/:_id"
            element={<EditDepartment />}
          />
          <Route path="/admin-dashboard/employees" element={<EmployeeList />} />
          <Route
            path="/admin-dashboard/employees/:_id"
            element={<ViewEmployee />}
          />
          <Route
            path="/admin-dashboard/employees/edit/:_id"
            element={<EditEmployee />}
          />
          <Route
            path="/admin-dashboard/employees/salary/:_id"
            element={<ViewEmployeeSalaryAdmin />}
          />
          <Route
            path="/admin-dashboard/employees/leave/:_id"
            element={<ViewEmployeeLeave />}
          />
          <Route
            path="/admin-dashboard/add-employee"
            element={<AddEmployee />}
          />
          <Route path="/admin-dashboard/salary" element={<SalaryOptions />} />
          <Route path="/admin-dashboard/salary/add" element={<AddSalary />} />
          <Route path="/admin-dashboard/salary/edit" element={<EditSalary />} />
          <Route
            path="/admin-dashboard/allowances"
            element={<ViewAllAllowances />}
          />
          <Route
            path="/admin-dashboard/allowances/add-allowances"
            element={<ApplyAllowancesAdmin />}
          />
          <Route
            path="/admin-dashboard/allowances/edit-allowances"
            element={<EditAllowancesAdmin />}
          />
          <Route
            path="/admin-dashboard/allowances/approve-allowances"
            element={<ApproveAllowances />}
          />
          <Route path="/admin-dashboard/leave" element={<ViewAllLeaves />} />
          <Route
            path="/admin-dashboard/leave/employeesLeaveBalances"
            element={<ViewEmployeesLeaveCount />}
          />
          <Route
            path="/admin-dashboard/performance"
            element={<ViewPerformanceAdmin />}
          />
          <Route path="/admin-dashboard/ctc" element={<ViewEmployeeCTC />} />

          <Route
            path="/admin-dashboard/fixed-allowances"
            element={<ViewAllFixedAllowance />}
          />

          <Route
            path="/admin-dashboard/fixed-allowances/add-allowances"
            element={<AddFixedAllowanceAdmin />}
          />

          <Route
            path="/admin-dashboard/fixed-allowances/edit-allowances"
            element={<EditFixedAllowancesAdmin />}
          />
        </Route>

        {/* Accounts Dashboard Routes */}
        <Route
          path="/accounts-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["accounts"]}>
                <AccountsDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<AdminSummary />} />
          <Route
            path="/accounts-dashboard/departments"
            element={<DepartmentList />}
          />
          <Route
            path="/accounts-dashboard/add-department"
            element={<AddDepartment />}
          />
          <Route
            path="/accounts-dashboard/departments/viewemployees/:_id"
            element={<ViewDepartment />}
          />
          <Route
            path="/accounts-dashboard/departments/:_id"
            element={<EditDepartment />}
          />
          <Route
            path="/accounts-dashboard/employees"
            element={<EmployeeList />}
          />
          <Route
            path="/accounts-dashboard/employees/:_id"
            element={<ViewEmployee />}
          />
          <Route
            path="/accounts-dashboard/employees/edit/:_id"
            element={<EditEmployee />}
          />
          <Route
            path="/accounts-dashboard/employees/salary/:_id"
            element={<ViewEmployeeSalaryAdmin />}
          />
          <Route
            path="/accounts-dashboard/employees/leave/:_id"
            element={<ViewEmployeeLeave />}
          />
          <Route
            path="/accounts-dashboard/add-employee"
            element={<AddEmployee />}
          />
          <Route path="/accounts-dashboard/ctc" element={<ViewEmployeeCTC />} />
          <Route
            path="/accounts-dashboard/salary"
            element={<SalaryOptions />}
          />
          <Route
            path="/accounts-dashboard/salary/add"
            element={<AddSalary />}
          />
          <Route
            path="/accounts-dashboard/salary/edit"
            element={<EditSalary />}
          />
          <Route
            path="/accounts-dashboard/allowances"
            element={<ViewAllAllowances />}
          />
          <Route
            path="/accounts-dashboard/allowances/add-allowances"
            element={<ApplyAllowancesAdmin />}
          />
          <Route
            path="/accounts-dashboard/allowances/edit-allowances"
            element={<EditAllowancesAdmin />}
          />
          <Route
            path="/accounts-dashboard/allowances/approve-allowances"
            element={<ApproveAllowances />}
          />

          <Route
            path="/accounts-dashboard/fixed-allowances"
            element={<ViewAllFixedAllowance />}
          />

          <Route
            path="/accounts-dashboard/fixed-allowances/add-allowances"
            element={<AddFixedAllowanceAdmin />}
          />

          <Route
            path="/accounts-dashboard/fixed-allowances/edit-allowances"
            element={<EditFixedAllowancesAdmin />}
          />

          <Route
            path="/accounts-dashboard/leave"
            element={<ViewEmployeesLeaveCount />}
          />
          <Route
            path="/accounts-dashboard/performance"
            element={<ViewPerformanceAdmin />}
          />
        </Route>

        <Route
          path="/hr-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["hr"]}>
                <HrDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<AdminSummary />} />
          <Route
            path="/hr-dashboard/departments"
            element={<DepartmentList />}
          />
          <Route
            path="/hr-dashboard/add-department"
            element={<AddDepartment />}
          />
          <Route
            path="/hr-dashboard/departments/viewemployees/:_id"
            element={<ViewDepartment />}
          />
          <Route
            path="/hr-dashboard/departments/:_id"
            element={<EditDepartment />}
          />
          <Route path="/hr-dashboard/employees" element={<EmployeeList />} />
          <Route
            path="/hr-dashboard/employees/:_id"
            element={<ViewEmployee />}
          />
          <Route
            path="/hr-dashboard/employees/edit/:_id"
            element={<EditEmployee />}
          />
          <Route
            path="/hr-dashboard/employees/leave/:_id"
            element={<ViewEmployeeLeave />}
          />

          <Route path="/hr-dashboard/holiday" element={<AlterHoliday />} />
          <Route path="/hr-dashboard/add-employee" element={<AddEmployee />} />
          <Route path="/hr-dashboard/leave" element={<EditLeaveBalances />} />
          <Route path="/hr-dashboard/users" element={<UsersData />} />
          <Route path="/hr-dashboard/helpdesk" element={<Helpdesk />} />
          <Route
            path="/hr-dashboard/performance"
            element={<ViewPerformanceAdmin />}
          />
          <Route
            path="/hr-dashboard/onboarding-offboarding"
            element={<OnboardingOffboarding />}
          />
          <Route
            path="/hr-dashboard/change-password"
            element={<HrChangePassword />}
          />
        </Route>

        {/* Employee Dashboard Routes */}
        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["employee", "Lead"]}>
                <EmployeeDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<EmployeeSummary />} />
          <Route
            path="/employee-dashboard/salary"
            element={<ViewEmployeeSalary />}
          />
          <Route
            path="/employee-dashboard/allowances"
            element={<ViewEmployeeAllowance />}
          />
          <Route
            path="/employee-dashboard/allowances/add"
            element={<ApplyAllowance />}
          />
          <Route
            path="/employee-dashboard/allowances/edit/:_id"
            element={<EditAllowances />}
          />
          <Route
            path="/employee-dashboard/leave"
            element={<ViewLeaveHistory />}
          />
          <Route
            path="/employee-dashboard/leave/apply"
            element={<ApplyLeave />}
          />
          <Route
            path="/employee-dashboard/leave/approve-leaves/:userId"
            element={
              <RoleBaseRoutes requiredRole={["Lead"]}>
                <ViewAppliedLeavesTeamLead />
              </RoleBaseRoutes>
            }
          />
          <Route
            path="/employee-dashboard/leave/edit/:_id"
            element={<EditLeave />}
          />

          <Route
            path="/employee-dashboard/performance"
            element={<ViewPerformanceEmployee />}
          />

          <Route
            path="/employee-dashboard/helpdesk"
            element={<EmployeeHelpdesk />}
          />

          <Route
            path="/employee-dashboard/helpdesk/apply-help"
            element={<ApplyHelp />}
          />

          <Route
            path="/employee-dashboard/helpdesk/edit-help/:_id"
            element={<EditHelp />}
          />

          <Route path="/employee-dashboard/holiday" element={<ViewHoliday />} />
          <Route
            path="/employee-dashboard/change-password"
            element={<Password />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
