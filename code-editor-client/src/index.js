import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { nanoid } from 'nanoid'; // We'll use nanoid to create new document IDs

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={`/doc/${nanoid(7)}`} replace />} // Auto-redirect to a new doc
        />
        <Route path="/doc/:roomId" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);