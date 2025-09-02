import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CreateResumeForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post('/api/resume/', { title, content }, { headers });
      if (response.status === 200 || response.status === 201) {
        onSuccess();
        navigate('/');
      }
    } catch (err) {
      console.error(err.response ? err.response.data.detail : err.message);
      alert('Ошибка сохранения резюме.');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formTitle">
        <Form.Label>Название резюме</Form.Label>
        <Form.Control
          type="text"
          placeholder="Введите название резюме"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="formContent">
        <Form.Label>Описание резюме</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          placeholder="Напишите описание резюме"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </Form.Group>

      <Button variant="dark" type="submit">
        Создать резюме
      </Button>
    </Form>
  );
};

export default CreateResumeForm;