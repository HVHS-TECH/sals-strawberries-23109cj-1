let loggedin;
let uid;
let profileLink;
console.log("Running Sal's Strawberries")

function writeForm(){
    // Get the form data
    const favoriteFruit = document.getElementById("favoriteFruit").value;
}

function fb_authenticate(){
    firebase.auth().onAuthStateChanged((user) => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    });
    if (user) {
        loggedin = true;
      console.log('loggedin')
      console.log(user)
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/v8/firebase.User
       uid = user.uid;
       profileLink = user.photoURL;
      // ...
    } else {
      console.log('not logged in')
      loggedin = false
      // User is signed out
      // ...
    }
  });
}

function fb_write(){
    if(loggedin){
        let inputTable = {
            users:{
                uid: uid,
                    input:{
                        name: document.getElementById('name').value,
                        favoriteFruit: document.getElementById('favoriteFruit').value,
                        fruitQuantity: document.getElementById('fruitQuantity').value,
                        email: document.getElementById('email').value
                }
            }
        }
        firebase.database().ref('/salsStrawberry').set(
            {
                inputTable
            }
        );
    }
}