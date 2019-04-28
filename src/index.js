import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

/*
downward data flow. So only most parent component should be responsible for gettind data.
*/
ReactDOM.render(
    <App />,
    document.getElementById('root')
);
