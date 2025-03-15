import React, { useEffect } from 'react';
import './App.css';
import { useNavigate, useLocation } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/NavBar/Navbar';
import Footer from './Components/Footer/Footer';
import AboutUs from './Components/AbouUs/AboutUs';
import Home from './Home';
import Register from './Components/Login & Register/Register';
import Login from './Components/Login & Register/Login';
import LandDetails from './Components/LandDetails/LandDetails';
import LandUpload from './Components/LandUpload/LandUpload';
import ProfileDashboard from './Components/ProfileDashboard/ProfileDashboard';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import UserDashboard from './Pages/User/UserDashboard';
import PrivateRoute from './Components/PrivateRoutes';
import ManageUsers from './Components/AdminManage/ManageUsers';
import AllLands from './Components/LandList/AllLands';
import SearchResults from './Components/LandList/SearchResults';
import FilteredLands from './Components/LandList/FilteredLands';
import PublicProfile from './Components/ProfileDashboard/PublicProfile';
import Contact from './Components/Contact Page/Contact';



function App() {

  const AuthRedirector = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));
    const role = localStorage.getItem("role");
  
    useEffect(() => {
      if (!user && location.pathname === "/") {
        navigate("/");
      } else if (user) {
        if (role === "admin" && location.pathname === "/") {
          navigate("/admin");
        } else if (role === "user" && location.pathname === "/") {
          navigate("/dashboard");
        }
      }
    }, [location.pathname, navigate]);
  
    return null; // No UI, only handles redirection
  };


  return (
      <Router>
        <div className="App wrapper">
          <Navbar/>
          <div className='content'>
          <Routes>
            <Route path="*" element={<AuthRedirector />} />
            <Route path='/' element={<Home/>} />
            <Route path="/profile/:userId" element={<PublicProfile />} />
            <Route path='/about' element={<AboutUs/>} />
            <Route path='/landUpload' element={<LandUpload/>} />
            <Route path='/login' element={<Login/>} />
            <Route path="/lands/:category" element={<FilteredLands />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<PrivateRoute element={<AdminDashboard />} allowedRole="admin" />} />
            <Route path="/profile" element={<ProfileDashboard />} />
            <Route path="/dashboard" element={<PrivateRoute element={<UserDashboard />} allowedRole="user" />} /> 
            <Route path="/usersList" element={<PrivateRoute element={<ManageUsers />} allowedRole="admin" /> } />
            <Route path='/register' element={<Register/>} />
            <Route path="/all-lands" element={<AllLands />} />
            <Route path="/land/:id" element={<LandDetails />} />
          </Routes>
          </div>
          <div className="mt-4">
          <Footer/>
          </div>
        </div>
      </Router>
  );
}

export default App;
