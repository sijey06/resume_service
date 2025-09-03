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
  const [improvedContent, setImprovedContent] = useState('');
  const [showConfirmationButtons, setShowConfirmationButtons] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchResumeWithHistory = async () => {
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
    fetchResumeWithHistory();
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
      const response = await axios.post(`/api/resume/${resumeId}/improve`, {}, { headers });
      if (response.data) {
        setImprovedContent(response.data.content);
        setShowConfirmationButtons(true);
      } else {
        alert('Ошибка улучшения резюме: Данные не получены');
      }
    } catch (err) {
      alert('Ошибка улучшения резюме');
    }
  };

  const handleSaveChanges = () => {
    setResume({ ...resume, content: improvedContent });
    setHistory([...history, { content: improvedContent }]);
    setImprovedContent('');
    setShowConfirmationButtons(false);
  };

  const handleCancel = () => {
    setImprovedContent('');
    setShowConfirmationButtons(false);
  };

  if (loading) return <div>Загрузка...</div>;
  if (errorMessage) return <Alert variant="danger">{errorMessage}</Alert>;

  return (
    <Container className="mt-5">
      <Card className="w-50 mx-auto p-4 shadow-sm rounded">
        <Card.Header><h2>{resume?.title || ''}</h2></Card.Header>
        <Card.Body>
          <p>{resume?.content || ''}</p>
          {resume?.history && resume.history.length > 0 && (
            <>
              <hr/>
              <h4>История изменений:</h4>
              <ul style={{ listStyleType: 'none' }}>
                {resume.history.map((item, idx) => (
                  <li key={idx}>{item.content}</li>
                ))}
              </ul>
            </>
          )}
          {showConfirmationButtons && (
            <>
              <hr/>
              <h4>Улучшенное резюме:</h4>
              <p>{improvedContent}</p>
              <Button variant="primary" size="sm" onClick={handleSaveChanges}>Сохранить</Button> 
              <Button variant="secondary" size="sm" onClick={handleCancel}>Отменить</Button>
            </>
          )}
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