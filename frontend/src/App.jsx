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

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" />}></Route>
        <Route path="/login" element={<Login />}></Route>
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
          <Route index element={<AdminSummary />}></Route>
          <Route
            path="/admin-dashboard/departments"
            element={<DepartmentList />}
          ></Route>
          <Route
            path="/admin-dashboard/add-department"
            element={<AddDepartment />}
          ></Route>
          <Route
            path="/admin-dashboard/departments/viewemployees/:_id"
            element={<ViewDepartment />}
          ></Route>
          <Route
            path="/admin-dashboard/departments/:_id"
            element={<EditDepartment />}
          ></Route>

          <Route
            path="/admin-dashboard/employees"
            element={<EmployeeList />}
          ></Route>

          <Route
            path="/admin-dashboard/employees/:_id"
            element={<ViewEmployee />}
          ></Route>

          <Route
            path="/admin-dashboard/employees/edit/:_id"
            element={<EditEmployee />}
          ></Route>

          <Route
            path="/admin-dashboard/employees/salary/:_id"
            element={<ViewEmployeeSalaryAdmin />}
          ></Route>

          <Route
            path="/admin-dashboard/employees/leave/:_id"
            element={<ViewEmployeeLeave />}
          ></Route>

          <Route
            path="/admin-dashboard/add-employee"
            element={<AddEmployee />}
          ></Route>

          <Route
            path="/admin-dashboard/salary"
            element={<SalaryOptions />}
          ></Route>
          <Route
            path="/admin-dashboard/salary/add"
            element={<AddSalary />}
          ></Route>
          <Route
            path="/admin-dashboard/salary/edit"
            element={<EditSalary />}
          ></Route>
          <Route
            path="/admin-dashboard/allowances"
            element={<ViewAllAllowances />}
          ></Route>
          <Route
            path="/admin-dashboard/leave"
            element={<ViewAllLeaves />}
          ></Route>
        </Route>

        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["employee"]}>
                <EmployeeDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<EmployeeSummary />}></Route>
          <Route
            path="/employee-dashboard/salary"
            element={<ViewEmployeeSalary />}
          ></Route>

          <Route
            path="/employee-dashboard/allowances"
            element={<ViewEmployeeAllowance />}
          ></Route>

          <Route
            path="/employee-dashboard/allowances/add"
            element={<ApplyAllowance />}
          ></Route>

          <Route
            path="/employee-dashboard/allowances/edit/:_id"
            element={<EditAllowances />}
          ></Route>

          <Route
            path="/employee-dashboard/leave"
            element={<ViewLeaveHistory />}
          ></Route>

          <Route
            path="/employee-dashboard/leave/apply"
            element={<ApplyLeave />}
          ></Route>

          <Route
            path="/employee-dashboard/leave/edit/:_id"
            element={<EditLeave />}
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
