const firebaseConfig = {
  apiKey: "AIzaSyBHh6BQwWi3v8HjmunWonEFQ8_FaBfMEY0",
  authDomain: "smart-issue-board-b7dda.firebaseapp.com",
  projectId: "smart-issue-board-b7dda",
  storageBucket: "smart-issue-board-b7dda.firebasestorage.app",
  messagingSenderId: "132970116912",
  appId: "1:132970116912:web:995d3d9a625c881cd3baf5"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// Sign up fn

function signup() {
  auth.createUserWithEmailAndPassword(
    email.value,
    password.value
  ).then(() => {
    window.location.href = "dashboard.html";
  }).catch(err => alert(err.message));
}

// Login fn

function login() {
  auth.signInWithEmailAndPassword(
    email.value,
    password.value
  ).then(() => {
    window.location.href = "dashboard.html";
  }).catch(err => alert(err.message));
}

//Logout fn

function logout() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}

auth.onAuthStateChanged(user => {
  if (!user && location.pathname.includes("dashboard.html")) {
    window.location.href = "index.html";
  }

  if (user && document.getElementById("userEmail")) {
    userEmail.innerText = "Logged in as: " + user.email;
    loadIssues();
  }
});

// Add fn

function addIssue() {
  const title = document.getElementById("title").value.trim();
  const desc = document.getElementById("description").value.trim();
  const priority = document.getElementById("priority").value;
  const assignedTo = document.getElementById("assignedTo").value;
  const user = auth.currentUser;

  if (!title || !desc) {
    alert("Title and description required");
    return;
  }

  db.collection("issues").get().then(snapshot => {
    let similar = false;

    snapshot.forEach(doc => {
      if (doc.data().title.toLowerCase().includes(title.toLowerCase())) {
        similar = true;
      }
    });

    if (similar && !confirm("Similar issue exists. Continue?")) return;

    db.collection("issues").add({
      title,
      description: desc,
      priority,
      status: "Open",
      assignedTo,
      createdBy: user.email,
      createdAt: new Date()
    }).then(() => {
      title.value = "";
      description.value = "";
      assignedTo.value = "";
      loadIssues();
    });
  });
}

// load issue and filter

function loadIssues() {
  const filter = document.getElementById("statusFilter").value;
  const box = document.getElementById("issues");

  box.innerHTML = "";

  db.collection("issues").orderBy("createdAt", "desc").get()
    .then(snapshot => {
      let found = false;

      snapshot.forEach(doc => {
        const issue = doc.data();

        if (filter && issue.status !== filter) return;

        found = true;

        let statusClass =
          issue.status === "Open" ? "status-open" :
          issue.status === "In Progress" ? "status-progress" :
          "status-done";

        box.innerHTML += `
          <div class="issue-card">
            <div class="issue-title">
              ${issue.title} (${issue.priority})
            </div>

            <span class="status ${statusClass}">
              ${issue.status}
            </span>

            <br>

            Change Status:
            <select onchange="changeStatus('${doc.id}','${issue.status}',this.value)">
              <option ${issue.status === "Open" ? "selected" : ""}>Open</option>
              <option ${issue.status === "In Progress" ? "selected" : ""}>In Progress</option>
              <option ${issue.status === "Done" ? "selected" : ""}>Done</option>
            </select>

            <br>
            Assigned To: ${issue.assignedTo || "Not Assigned"}<br>
            Created By: ${issue.createdBy}<br>
            ${issue.description}<br><br>

            <button onclick="deleteIssue('${doc.id}')">Delete</button>
          </div>
        `;
      });

      if (!found) {
        box.innerText = "No issues found";
      }
    });
}




function changeStatus(id, oldStatus, newStatus) {
  if (oldStatus === "Open" && newStatus === "Done") {
    alert("Move to In Progress first");
    loadIssues();
    return;
  }

  db.collection("issues").doc(id).update({ status: newStatus })
    .then(loadIssues);
}

// delete fn

function deleteIssue(id) {
  if (confirm("Delete this issue?")) {
    db.collection("issues").doc(id).delete().then(loadIssues);
  }
}
