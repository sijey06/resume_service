import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import NavigationBar from './components/Navbar';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ResumeList from './components/ResumeList';
import CreateResumePage from './components/CreateResumePage';
import ViewResumePage from './components/ViewResumePage';
import EditResumePage from './components/EditResumePage';

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<ResumeList />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/create-resume" element={<CreateResumePage />} />
        <Route path="/view-resume/:resumeId" element={<ViewResumePage />} />
        <Route path="/edit-resume/:resumeId" element={<EditResumePage />} />
      </Routes>
    </Router>
  );
}

export default App;