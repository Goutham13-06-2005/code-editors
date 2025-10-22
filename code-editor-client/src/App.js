import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router-dom'; // Import hook to read URL

// We will get this URL from Render after we deploy the backend
//const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";
//const socket = io(backendURL);
const socket = io();

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [code, setCode] = useState("// Loading...");

  const { roomId } = useParams(); // Get the 'roomId' from the URL
  const editorRef = useRef(null); 

  useEffect(() => {
    // --- NEW CODE STARTS HERE ---

    // 1. Tell the server which room we want to join
    socket.emit('join-room', roomId);

    // --- NEW CODE ENDS HERE ---

    socket.on('connect', () => {
      setIsConnected(true);
    });
    socket.on('disconnect', () => {
      setIsConnected(false);
    });
    socket.on('receive-code-change', (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('receive-code-change');
    };
  }, [roomId]); // Re-run effect if roomId changes

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function handleEditorChange(value) {
    setCode(value);

    // --- NEW CODE STARTS HERE ---

    // 2. Send the roomId along with the code change
    socket.emit('code-change', { roomId, newCode: value });

    // --- NEW CODE ENDS HERE ---
  }

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
        Status: 
        {isConnected ? 
          <span style={{ color: 'green' }}> Connected</span> : 
          <span style={{ color: 'red' }}> Disconnected</span>
        }
        <span style={{ marginLeft: '20px', color: '#555' }}>
          Room ID: {roomId}
        </span>
      </div>

      <Editor
        height="100%"
        defaultLanguage="javascript"
        theme="vs-dark"
        value={code}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
      />
    </div>
  );
}

export default App;