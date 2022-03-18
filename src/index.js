import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './Main';
import reportWebVitals from './reportWebVitals';

import {BrowserRouter} from 'react-router-dom'

// import firebase from './firebase/config'
// firebase.auth().onAuthStateChanged((user)=>{
//   if (user !== null) {
//     const displayName = user.displayName;
//     const photoURL = user.photoURL;
//     const uid = user.uid;
//     console.log({displayName,photoURL,uid})
//     return {displayName,photoURL,uid}
//   }else{
//     // return null
//   }
// });

// sessionStorage.clear()

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
