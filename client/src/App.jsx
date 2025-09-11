

import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/authContext'
import Auth from './pages/Auth'
import Seller from './pages/Seller'
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Navigate to="/auth" />} />
            <Route path="/seller" element={<Seller/>}></Route>
          </Routes>
        </div>
      </Router>

    </AuthProvider>

  )
}
export default App