import { useState } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useOutletContext } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import WorkforceInsightsPage from './pages/WorkforceInsightsPage'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />

          <Route element={<ProtectedLayout />}>
            <Route
              path="/dashboard"
              element={<WorkforceRoute section="overview" />}
            />

            <Route
              path="/attrition"
              element={<WorkforceRoute section="attrition" />}
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

function ProtectedLayout() {
  const { user } = useAuth()
  const [filters, setFilters] = useState({
    department: 'All',
    timeframe: 'FY 2026',
  })

  if (!user) return <Navigate to="/" replace />

  const handleFilterChange = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:pl-72">
      <Sidebar />
      <Navbar onFilterChange={handleFilterChange} />
      <Outlet context={{ filters }} />
    </div>
  )
}

function WorkforceRoute({ section }) {
  const { filters } = useOutletContext()

  return (
    <WorkforceInsightsPage
      section={section}
      filters={filters}
    />
  )
}

export default App
