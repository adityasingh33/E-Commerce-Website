

// import React from 'react'
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// import { AuthProvider } from './context/authContext'
// import Auth from './pages/Auth'
// import Seller from './pages/Seller'
// const App = () => {
//   return (
//     <AuthProvider>
//       <Router>
//         <div>
//           <Routes>
//             <Route path="/auth" element={<Auth />} />
//             <Route path="/" element={<Navigate to="/auth" />} />
//             <Route path="/seller" element={<Seller/>}></Route>
//           </Routes>
//         </div>
//       </Router>

//     </AuthProvider>

//   )
// }
// export default App


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';
import Auth from './pages/Auth';
import Seller from './pages/Seller';
import LandingPage from './pages/LandingPage'; // Import the new landing page
import Navbar from './components/Navbar';

/**
 * A wrapper component to protect routes that require authentication.
 * If the user is not logged in, it redirects them to the /auth page.
 */
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        // Redirect them to the /auth page, but save the current location they were
        // trying to go to. This allows us to send them back there after they log in.
        return <Navigate to="/auth" replace />;
    }

    return children;
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
              <Navbar />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth" element={<Auth />} />

                    {/*
                      Protected Seller Route.
                      Only authenticated users can access the /seller path.
                    */}
                    <Route 
                        path="/seller" 
                        element={
                            <ProtectedRoute>
                                <Seller />
                            </ProtectedRoute>
                        } 
                    />

                    {/* Optional: Add a catch-all route to redirect to home if a page is not found */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;

