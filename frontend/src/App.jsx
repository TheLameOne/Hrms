import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import AddEmployee from './pages/AddEmployee'
import Attendance from './pages/Attendance'
import EmployeeAttendance from './pages/EmployeeAttendance'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="employees/add" element={<AddEmployee />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="employees/:id/attendance" element={<EmployeeAttendance />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
