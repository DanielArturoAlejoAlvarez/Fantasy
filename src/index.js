import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import firebase from 'firebase';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// Initialize Firebase

firebase.initializeApp({
    apiKey: "AIzaSyDmxdd2IVwzw0feN9MZTUGHALlOTsun4l8",
    authDomain: "fantasy-bd312.firebaseapp.com",
    databaseURL: "https://fantasy-bd312.firebaseio.com",
    projectId: "fantasy-bd312",
    storageBucket: "fantasy-bd312.appspot.com",
    messagingSenderId: "82793551477"
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
