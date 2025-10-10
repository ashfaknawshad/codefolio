import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from './components/ui/button';

const Popup = () => {
  const handleGenerateResume = () => {
    // Logic to call the backend and generate the resume
  };

  return (
    <div>
      <h1>GitHub Resume Sync</h1>
      <Button onClick={handleGenerateResume}>Generate Resume</Button>
    </div>
  );
};

ReactDOM.render(<Popup />, document.getElementById('root'));