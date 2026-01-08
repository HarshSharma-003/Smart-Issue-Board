const firebaseConfig = {
  apiKey: "AIzaSyBHh6BQwWi3v8HjmunWonEFQ8_FaBfMEY0",
  authDomain: "smart-issue-board-b7dda.firebaseapp.com",
  projectId: "smart-issue-board-b7dda",
  storageBucket: "smart-issue-board-b7dda.firebasestorage.app",
  messagingSenderId: "132970116912",
  appId: "1:132970116912:web:995d3d9a625c881cd3baf5",
  measurementId: "G-PEX0FJ9YD2"
};

firebase.initializeApp(firebaseConfig);


const auth = firebase.auth();
const db = firebase.firestore();


function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("Signup successful!");
      window.location.href = "dashboard.html";
    })
    .catch(err => alert(err.message));
}


function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(err => alert(err.message));
}


auth.onAuthStateChanged(user => {
  if (!user && window.location.pathname.includes("dashboard.html")) {
    window.location.href = "index.html";
  }
});


function addIssue() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const priority = document.getElementById("priority").value;
  const user = auth.currentUser;

  if (!title || !description) {
    alert("Please enter title and description");
    return;
  }

 
  db.collection("issues").get().then(snapshot => {
    let isSimilar = false;

    snapshot.forEach(doc => {
      const existingTitle = doc.data().title.toLowerCase();
      const newTitle = title.toLowerCase();

      if (
        existingTitle.includes(newTitle) ||
        newTitle.includes(existingTitle)
      ) {
        isSimilar = true;
      }
    });

    if (isSimilar) {
      const confirmCreate = confirm(
        "Issue Already Exist!!!"
      );
      if (!confirmCreate) return;
    }


    db.collection("issues").add({
      title,
      description,
      priority,
      status: "Open",
      createdAt: new Date(),
      createdBy: user.email
    }).then(() => {
      alert("Issue added successfully!");
      document.getElementById("title").value = "";
      document.getElementById("description").value = "";
    });
  });
}
// DISPLAY ISSUES

db.collection("issues")
  .orderBy("createdAt", "desc")
  .onSnapshot(snapshot => {
    const issuesDiv = document.getElementById("issues");
    if (!issuesDiv) return;

    issuesDiv.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();
      issuesDiv.innerHTML += `
        <div class="issue-card">
          <b>${data.title}</b> (${data.priority})<br>
          Status: ${data.status}<br>
          Created By: ${data.createdBy}<br>
          ${data.description}
        </div>
      `;
    });
  });

// LOGOUT
function logout() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}
