import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const ResumeList = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    const checkAuthAndFetchResumes = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      try {
        const response = await axios.get('/api/resume/', { headers });
        setResumes(response.data);
      } catch (err) {
        console.error(err.response ? err.response.data.detail : err.message);
        navigate('/login', { replace: true });
      }
    };

    checkAuthAndFetchResumes();
  }, []);

  return (
    <Container className="mt-5">
      <h2>Список резюме:</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {resumes.map((resume) => (
          <Col key={resume.id}>
            <Card style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>{resume.title}</Card.Title>
                <Card.Text>{resume.content.slice(0, 100)}...</Card.Text>
                <Button variant="info" as={RouterLink} to={`/view-resume/${resume.id}`}>
                  Посмотреть подробнее
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ResumeList;