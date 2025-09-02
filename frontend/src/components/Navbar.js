import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const NavigationBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let email = '';

  if (token) {
    email = localStorage.getItem('email') || '';
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
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
          {!token ? (
            <Nav>
              <Nav.Link as={Link} to="/login">Вход</Nav.Link>
              <Nav.Link as={Link} to="/register">Регистрация</Nav.Link>
            </Nav>
          ) : (
            <Nav>
              <span className="navbar-text text-white">{email}</span>
              <Button variant="outline-danger" onClick={handleLogout}>Выход</Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;