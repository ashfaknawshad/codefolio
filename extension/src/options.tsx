import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';

const Options = () => {
  const [personalInfo, setPersonalInfo] = useState({ name: '', email: '' });

  useEffect(() => {
    chrome.storage.sync.get('personalInfo', (data) => {
      if (data.personalInfo) {
        setPersonalInfo(data.personalInfo);
      }
    });
  }, []);

  const handleSave = () => {
    chrome.storage.sync.set({ personalInfo });
  };

  return (
    <div>
      <h1>Settings</h1>
      <Input
        placeholder="Name"
        value={personalInfo.name}
        onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
      />
      <Input
        placeholder="Email"
        value={personalInfo.email}
        onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
      />
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
};

ReactDOM.render(<Options />, document.getElementById('root'));