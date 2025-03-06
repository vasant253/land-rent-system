import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from './i18n';  // Import i18n setup
import Navbar from './Components/NavBar/Navbar';
import Footer from './Components/Footer/Footer';
import AboutUs from './Components/AbouUs/AboutUs';
import Home from './Home';
import Register from './Components/Login & Register/Register';
import Login from './Components/Login & Register/Login';
import LandDetails from './Components/LandDetails/LandDetails';
import LandUpload from './Components/LandUpload/LandUpload';
import ProfileDashboard from './Components/ProfileDashboard/ProfileDashboard';


function App() {
  const { i18n } = useTranslation();

  // Load language preference from localStorage on startup
  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "en";
    i18n.changeLanguage(savedLang);
  }, [i18n]);

  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <div className="App">
          <Navbar/>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/about' element={<AboutUs/>} />
            <Route path='/landUpload' element={<LandUpload/>} />
            <Route path='/login' element={<Login/>} />
            <Route path="/profile" element={<ProfileDashboard />} />
            <Route path='/register' element={<Register/>} />
            <Route path="/land/:id" element={<LandDetails />} />
          </Routes>
          <Footer/>
        </div>
      </Router>
    </I18nextProvider>
  );
}

export default App;
