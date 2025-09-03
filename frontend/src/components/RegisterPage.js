import React, { useState } from 'react';
import axios from 'axios';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('/api/register', { email, password });
      window.location.href = '/';
    } catch (err) {
      const errorDetail = err.response ? err.response.data.detail : 'Ошибка регистрации';
      setAlertText(errorDetail);
      setShowAlert(true);
    }
  };

  return (
    <Container className="vh-100 d-flex align-items-center justify-content-center">
      <Card className="w-50 p-4 shadow-lg rounded">
        <Card.Body>
          <h1 className="text-center mb-4">Регистрация</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Электронная почта</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ваша электронная почта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ваш пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            {showAlert && (
              <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                {alertText}
              </Alert>
            )}

            <Button variant="dark" type="submit" block>
              Зарегистрироваться
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegisterPage;