import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './Main';
import reportWebVitals from './reportWebVitals';

import {BrowserRouter} from 'react-router-dom'

import firebase from './firebase/config'
firebase.auth().onAuthStateChanged((user)=>{
  if (user) {
    const displayName = user.displayName;
    const photoURL = user.photoURL;
    const uid = user.uid;
    const userData = {photoURL:photoURL,displayName:displayName,uid:uid}
    localStorage.setItem('user',JSON.stringify(userData))
  }else{
    sessionStorage.removeItem('bookmark')
    localStorage.removeItem('user')
  }
});
sessionStorage.removeItem('user')


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
