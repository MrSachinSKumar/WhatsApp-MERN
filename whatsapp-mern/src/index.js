import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { StateProvider } from './components/config/firebase/StateProvider';
import reducer, { initialState } from './components/config/firebase/reducer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

<StateProvider initialState={initialState} reducer={reducer}>
    <App />
</StateProvider>

);

reportWebVitals();
