import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const ViewResumePage = () => {
  const navigate = useNavigate();
  const { resumeId } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchResume = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const response = await axios.get(`/api/resume/${resumeId}/`, { headers });
        setResume(response.data);
        setLoading(false);
      } catch (err) {
        setErrorMessage(err.response?.data.detail || 'Ошибка загрузки резюме');
        setLoading(false);
      }
    };
    fetchResume();
  }, [resumeId]);

  const handleEdit = () => {
    navigate(`/edit-resume/${resumeId}`);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить это резюме?');
    if (!confirmed) return;

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    try {
      await axios.delete(`/api/resume/${resumeId}/`, { headers });
      navigate('/');
    } catch (err) {
      alert('Ошибка удаления резюме');
    }
  };

  const handleImprove = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const response = await axios.post(
        `/api/resume/${resumeId}/improve`,
        { title: resume.title, content: resume.content },
        { headers }
      );
      if (response.data.improved_resume) {
        setResume({
          title: resume.title,
          content: response.data.improved_resume,
        });
      } else {
        alert('Ошибка улучшения резюме: Данные не получены');
      }
    } catch (err) {
      alert('Ошибка улучшения резюме');
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (errorMessage) return <Alert variant="danger">{errorMessage}</Alert>;

  return (
    <Container className="mt-5">
      <Card className="w-50 mx-auto p-4 shadow-sm rounded">
        <Card.Header>
          <h2>{resume?.title || ''}</h2>
        </Card.Header>
        <Card.Body>
          <p>{resume?.content || ''}</p>
        </Card.Body>
        <Card.Footer>
          <Button variant="primary" size="sm" onClick={handleImprove}>Улучшить</Button>
          <Button variant="warning" size="sm" onClick={handleEdit}>Редактировать</Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>Удалить</Button>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default ViewResumePage;