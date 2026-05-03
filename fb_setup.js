/**************************************************************/
// fb_initialise()
// Initialize firebase, connect to the Firebase project.
// 
// Find the config data in the Firebase console. Cog wheel > Project Settings > General > Your Apps > SDK setup and configuration > Config
//
// Input:  n/a
// Return: n/a
/**************************************************************/
  const firebaseConfig = {
    apiKey: "AIzaSyBqEGxEAIyZf0FYWQExN9kQf-DeW-ricAk",
    authDomain: "cameronjohns12comp.firebaseapp.com",
    databaseURL: "https://cameronjohns12comp-default-rtdb.firebaseio.com",
    projectId: "cameronjohns12comp",
    storageBucket: "cameronjohns12comp.firebasestorage.app",
    messagingSenderId: "709847310417",
    appId: "1:709847310417:web:5611dd24bcbfdda7e45870"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
