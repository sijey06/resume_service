import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const EditResumePage = () => {
  const navigate = useNavigate();
  const { resumeId } = useParams();
  const [resume, setResume] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchResume = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const response = await axios.get(`/api/resume/${resumeId}`, { headers });
        setResume(response.data);
        setLoading(false);
      } catch (err) {
        setErrorMessage(err.response?.data.detail || 'Ошибка загрузки резюме');
        setLoading(false);
      }
    };
    fetchResume();
  }, [resumeId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await axios.put(`/api/resume/${resumeId}`, resume, { headers });
      navigate('/');
    } catch (err) {
      alert('Ошибка обновления резюме');
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (errorMessage) return <Alert variant="danger">{errorMessage}</Alert>;

  return (
    <Container className="mt-5">
      <Card className="w-50 mx-auto p-4 shadow-sm rounded">
        <Card.Header>
          <h2>Редактирование резюме</h2>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label>Название резюме</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите название резюме"
                value={resume.title}
                onChange={(e) => setResume({ ...resume, title: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group controlId="formContent">
              <Form.Label>Описание резюме</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Напишите описание резюме"
                value={resume.content}
                onChange={(e) => setResume({ ...resume, content: e.target.value })}
                required
              />
            </Form.Group>

            <Button variant="dark" type="submit">Сохранить изменения</Button>  
            <Button variant="secondary" href="/">Отмена</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditResumePage;