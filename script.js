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
        console.log('submit')
        let inputTable = {
                uid: uid,
                name: displayName,
                favoriteFruit: document.getElementById('favoriteFruit').value,
                "2ndfavoriteFruit": document.getElementById('2ndfavoriteFruit').value,
                "3rdfavoriteFruit": document.getElementById('3rdfavoriteFruit').value,
                fruitQuantity: document.getElementById('fruitQuantity').value,
                email: email,
                phoneNumber: phoneNumber,
                profilePicture:profileLink
            }
        let review = {

            review:document.getElementById('review').value
        }
        firebase.database().ref('/salsStrawberry/review/' + uid).set(
            review
        )
        firebase.database().ref('/salsStrawberry/users/'+ uid).set(
            {
                inputTable
            }
        );
    } else{
        alert("PLease log in with your google account to continue")
    }
}

function fb_email(){
    document.getElementById('emailGen').innerHTML = `<h1>Sal's New York Style Strawberries</h1>  <img src="`+profileLink+`"<br>
    <p>Dear` + displayName + ` @` + email + `<br>
    We have an offer on your 3 favorite fruits, `+ document.getElementById('favoriteFruit').value + `, ` +document.getElementById('2ndfavoriteFruit').value +`, and ` +document.getElementById('3rdfavoriteFruit').value + `<br>
    they are now buy `+ document.getElementById('fruitQuantity').value +` get 1 double price!!</p>`
}

function fb_readReviews(){
    firebase.database().ref('/salsStrawberry/review').once('value',fb_displayReviews)
}

function fb_displayReviews(snapshot){
    let reviews = snapshot.val()
    let reviewKeys = Object.keys(reviews)
    for(i=0;i<reviewKeys.length;i++){
        let key = reviewKeys[i];
        console.log(reviews[key])
        document.getElementById('reviewGen').innerHTML =document.getElementById('reviewGen').innerHTML + `<br><p>` + reviews[key].review + `</p>` 
    }
}

function fb_readPopularFruit(){
    firebase.database().ref('/salsStrawberry/users').once('value', fb_displayPopularFruits)
}

function fb_displayPopularFruits(snapshot){
    let popularFruits = []
    let users = snapshot.val();
    let userKeys = Object.keys(users);
    console.log(userKeys.length);
    for(i=0;i<userKeys.length; i++){
        let key = userKeys[i];
        let currentFruit = users[key].inputTable.favoriteFruit;

        console.log(popularFruits.length)
        if(popularFruits.length ==0){
            popularFruits.push({fruit : currentFruit, frequency:0});
        }

        for(i=0;i<popularFruits.length; i++){
            console.log(popularFruits)
            if(popularFruits[i].fruit == currentFruit){
                popularFruits[i].frequency +=1;
                break;
            }else if(i==popularFruits.length -1){
                popularFruits.push({fruit: currentFruit, frequency:0})
            }
        }
    }

console.log(popularFruits)
}