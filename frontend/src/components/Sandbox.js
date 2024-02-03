import axios from 'axios';
import React, { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import './Sandbox.css';

const Sandbox = ({ userId }) => {
  const [code, setCode] = useState('');
  const [isCodeRunning, setIsCodeRunning] = useState(false);

  
  const handleAcknowledgeEnd = async () => {
    setIsCodeRunning(true); 
  };

  
  const saveSandbox = async (output) => {
    try {
      
      const cleanedOutput = output.replace(/document.write\(['"](.*?)['"]\);?/, '$1');

      const response = await axios.post('http://localhost:5000/api/sandbox', {
        userId: userId,
        code: code,
        output: cleanedOutput || '' 
      });
      console.log(response.data); 
      alert('Sandbox saved successfully!');
    } catch (error) {
      console.error('Error saving sandbox:', error);
    }
  };

  
  useEffect(() => {
    if (isCodeRunning) {
    
      const iframe = document.getElementById('sandbox-output');

      
      iframe.contentWindow.document.body.innerHTML = '';

      
      iframe.contentWindow.eval(code);

    
      const output = iframe.contentWindow.document.body.textContent;

  
      saveSandbox(output);
    }
  }, [isCodeRunning]);

  return (
    <div className="sandbox-container">
      <div className="sandbox-editor">
        <MonacoEditor
          height="500px"
          language="javascript"
          theme="vs-dark"
          value={code}
          onChange={setCode}
        />
      </div>
      <div className="sandbox-output">
        <h2>Output</h2>
        <button onClick={handleAcknowledgeEnd}>Run and Save</button>
        <iframe
          id="sandbox-output"
          title="sandbox-output"
          className="output-frame"
          srcDoc={`<html><body></body></html>`} 
        ></iframe>
      </div>
    </div>
  );
};

export default Sandbox;

