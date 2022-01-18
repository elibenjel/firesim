import React from 'react';
import { render } from 'react-dom';

import App from './App.jsx';

function component() {
    const element = document.createElement('div');
   const btn = document.createElement('button');
 
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
 
   btn.innerHTML = 'Click me and check the console!';
   btn.onclick = printMe;
 
   element.appendChild(btn);
 
    return element;
  }

const maindiv = document.createElement('div');
maindiv.className = 'wrapper-size-specifier';
document.body.appendChild(maindiv);
render(<App />, maindiv);