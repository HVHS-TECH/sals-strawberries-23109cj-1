let loggedin;
let uid;
let displayName;
let email;
let profileLink;
let phoneNumber;
let user;
let canLogIn = true;
console.log("Running Sal's Strawberries")

function writeForm() {
    // Get the form data
    const favoriteFruit = document.getElementById("favoriteFruit").value;
}

function fb_logout(){
    firebase.auth().signOut();
    loggedin = false;
    document.getElementById("login").innerHTML = `<button onclick="fb_login()">Login</button>`;
    document.getElementById("logout").innerHTML = ``;
}

function fb_login(){
    document.getElementById('login').innerHTML=`<button onclick="fb_authenticate()">Sign in with google</button>`;
    canLogIn =true;
}

function fb_authenticate() {
        if(canLogIn){
            var authentication = firebase.auth().onAuthStateChanged((user) => {

                var provider = new firebase.auth.GoogleAuthProvider();
                firebase.auth().signInWithPopup(provider).then(function (result) {
                    // This gives you a Google Access Token.
                    var token = result.credential.accessToken;
                    // The signed-in user info.
                    user = result.user;
                });
                if (user) {
                    loggedin = true;
                    canLogIn =false;

                    console.log('loggedin')
                    console.log(user)
                    // User is signed in, see docs for a list of available properties
                    // https://firebase.google.com/docs/reference/js/v8/firebase.User
                    uid = user.uid;
                    displayName = user.displayName;
                    profileLink = user.photoURL;
                    email = user.email;
                    phoneNumber = user.phoneNumber;
                    
                    document.getElementById('login').innerHTML = ``;
                    document.getElementById('logout').innerHTML =`<button onclick="fb_logout()">Logout</button>`;
                    authentication();
                    fb_checkBan(user.uid);

                } else {
                    console.log('not logged in')
                    loggedin = false;
                    canLogIn = true;
                    // User is signed out
                    // ...
                }
        });
}}


function fb_write() {
    let favoriteFruit = document.getElementById('favoriteFruit').value.trim();
    let secondFavoriteFruit = document.getElementById('2ndfavoriteFruit').value.trim();
    let thirdFavoriteFruit = document.getElementById('3rdfavoriteFruit').value.trim();
    let fruitQuantity = document.getElementById('fruitQuantity').value.trim();
    if (loggedin && (favoriteFruit != "") && (secondFavoriteFruit != "") && (thirdFavoriteFruit != "") && (fruitQuantity != "")) {
        console.log('submit')
        let inputTable = {
            uid: uid,
            name: displayName,
            favoriteFruit: favoriteFruit,
            secondFavoriteFruit: secondFavoriteFruit,
            thirdFavoriteFruit: thirdFavoriteFruit,
            fruitQuantity: fruitQuantity,
            email: email,
            phoneNumber: phoneNumber,
            profilePicture: profileLink
        }
        let review = {

            review: document.getElementById('review').value
        }
        firebase.database().ref('/salsStrawberry/review/' + uid).set(
            review
        )
        firebase.database().ref('/salsStrawberry/users/' + uid).set(
            {
                inputTable
            }
        );
    } else if (!loggedin) {
        alert("PLease log in with your google account to continue")
    } else {
        alert("Please ensure you have filled out all fields")
    }
}

async function fb_readEmail() {
    if (loggedin) {
        let snapshot = await firebase.database().ref('/salsStrawberry/users/' + uid).once('value')
        let userData = snapshot.val();
        uid = userData.inputTable.uid;
        displayName = userData.inputTable.name;
        let favoriteFruit = userData.inputTable.favoriteFruit;
        let secondFavoriteFruit = userData.inputTable.secondFavoriteFruit;
        let thirdFavoriteFruit = userData.inputTable.thirdFavoriteFruit;
        let fruitQuantity = userData.inputTable.fruitQuantity;
        email = userData.inputTable.email;
        profileLink = userData.inputTable.profilePicture

        document.getElementById('output').innerHTML = `<h1>Sal's New York Style Strawberries</h1>  <img src="` + profileLink + `" style="border-radius:60px"><br>
        <p>Dear` + displayName + ` @` + email + `<br>
        We have an offer on your 3 favorite fruits, `+ favoriteFruit + `, ` + secondFavoriteFruit + `, and ` + thirdFavoriteFruit + `<br>
        they are now buy `+ fruitQuantity + ` get 1 double price!!</p>`;
    } else {
        alert("PLease log in with your google account to continue")
    }
}

async function fb_readReviews() {
    document.getElementById('output').innerHTML = '';
    let snapshot = await firebase.database().ref('/salsStrawberry/review').once('value')
    let reviews = snapshot.val()
    let reviewKeys = Object.keys(reviews)
    for (i = 0; i < reviewKeys.length; i++) {
        let key = reviewKeys[i];
        console.log(reviews[key])
        document.getElementById('output').innerHTML = document.getElementById('output').innerHTML + `<br><p>` + reviews[key].review + `</p>`
    }
}

async function fb_readPopularFruit() {
    document.getElementById('output').innerHTML = '';
    let snapshot = await firebase.database().ref('/salsStrawberry/users').once('value')
    let popularFruits = []
    let users = snapshot.val();
    let userKeys = Object.keys(users);
    console.log(userKeys.length);
    for (i = 0; i < userKeys.length; i++) {
        let key = userKeys[i];
        let currentFruit = users[key].inputTable.favoriteFruit;

        //console.log(popularFruits.length);
        if (popularFruits.length == 0) {
            popularFruits.push({ fruit: currentFruit, frequency: 0 });
        }

        console.log(currentFruit)
        for (h = 0; h < popularFruits.length; h++) {
            //console.log(popularFruits)
            if (popularFruits[h].fruit == currentFruit) {
                popularFruits[h].frequency += 1;
                break;
            } else if (h == popularFruits.length - 1) {
                popularFruits.push({ fruit: currentFruit, frequency: 0 })
            }
        }
    }
    popularFruits.sort((a, b) => b.value - a.value)
    console.log(popularFruits)
    for (i = 0; i < popularFruits.length; i++) {
        document.getElementById('output').innerHTML = document.getElementById('output').innerHTML + `<p>` + popularFruits[i].fruit + `: ` + popularFruits[i].frequency + `</p><br>`;
    }
}


async function fb_checkBan(userUID){
    let snapshot = await firebase.database().ref('salsStrawberry/banList/' + userUID).once('value');
    let banned = snapshot.val();
    if(banned != null){
        window.location.href = 'https://en.wikipedia.org/wiki/Chinese_Communist_Party';
    }
}
