import firebase from 'firebase';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyC_JxL3jHcGbQgYCe_nOt_Xw_V3lP4Znvg",
    authDomain: "project-6-56d58.firebaseapp.com",
    databaseURL: "https://project-6-56d58.firebaseio.com",
    projectId: "project-6-56d58",
    storageBucket: "project-6-56d58.appspot.com",
    messagingSenderId: "755252815506"
};
firebase.initializeApp(config);

export default firebase;