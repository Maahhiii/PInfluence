import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ Import createRoot
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
