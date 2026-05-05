let loggedin;
let uid;
let displayName;
let email;
let profileLink;
let phoneNumber;
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
       displayName = user.displayName;
       profileLink = user.photoURL;
       email = user.email;
       phoneNumber = user.phoneNumber;
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
                uid: uid,
                name: displayName,
                favoriteFruit: document.getElementById('favoriteFruit').value,
                fruitQuantity: document.getElementById('fruitQuantity').value,
                email: email,
                phoneNumber: phoneNumber,
                profilePicture:profileLink
            }
        firebase.database().ref('/salsStrawberry/users/'+ uid).set(
            {
                inputTable
            }
        );
    } else{
        alert("PLease log in with your google account to continue")
    }
}