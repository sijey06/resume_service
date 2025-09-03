import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const apiUrl = process.env.REACT_APP_API_URL || '/api/';

const NavigationBar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    checkAuthentication();
  }, []);

  async function checkAuthentication() {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await axios.get(`${apiUrl}check-token`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200 && response.data.isValid) {
        setIsAuthenticated(true);
        setEmail(response.data.email);
      } else {
        logout();
      }
    } catch (err) {
      logout();
    }
  }

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setIsAuthenticated(false);
    setEmail('');
    navigate('/');
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">
          <img
            alt=""
            src="/logo1.png"
            height="40"
            className="d-inline-block align-top mr-2"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Главная</Nav.Link>
            <Nav.Link as={Link} to="/create-resume">Создать резюме</Nav.Link>
          </Nav>
          {!isAuthenticated ? (
            <Nav>
              <Nav.Link as={Link} to="/login">Вход</Nav.Link>
              <Nav.Link as={Link} to="/register">Регистрация</Nav.Link>
            </Nav>
          ) : (
            <Nav>
              <span className="navbar-text text-white">{email}</span>
              <Button variant="outline-danger" onClick={logout}>
                Выход
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;