import React from 'react';
import { render } from 'react-dom';
import './i18n';

import App from './components/App.jsx';

const maindiv = document.createElement('div');
maindiv.className = 'wrapper-size-specifier';
document.body.appendChild(maindiv);
render(<App />, maindiv);