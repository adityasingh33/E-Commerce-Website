

import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/authContext'
import Auth from './pages/Auth'
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Navigate to="/auth" />} />
          </Routes>
        </div>
      </Router>

    </AuthProvider>

  )
}
export default App