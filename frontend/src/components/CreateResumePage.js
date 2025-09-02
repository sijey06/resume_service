import React from 'react';
import CreateResumeForm from './CreateResumeForm';
import { Container } from 'react-bootstrap';

const CreateResumePage = () => {
  const handleSuccess = () => {
  };

  return (
    <Container fluid>
<div className="row justify-content-center align-items-center m-5">
  <div className="col-md-6 col-lg-4 border p-4 shadow-sm rounded">
    <h1 className="mb-4">Создание резюме</h1>
    <CreateResumeForm onSuccess={handleSuccess}/>
  </div>
</div>
    </Container>
  );
};

export default CreateResumePage;