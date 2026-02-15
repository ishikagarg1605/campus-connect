/* ================================
   CAMPUSCONNECT – LOCAL STORAGE JS
   ================================ */

/* ========= SIGNUP ========= */
function signupUser() {
  let name = document.getElementById("signupName").value;
  let email = document.getElementById("signupEmail").value;
  let password = document.getElementById("signupPassword").value;

  if (!name || !email || !password) {
    alert("All fields are required!");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if email already exists
  if (users.some(u => u.email === email)) {
    alert("User already exists!");
    return;
  }

  let newUser = {
    name,
    email,
    password,
    skills: [],
    groups: [],
    profile: {}
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  alert("Signup successful! You can now login.");
  window.location.href = "login.html";
}

/* ========= LOGIN ========= */
function loginUser() {
  let email = document.getElementById("loginEmail").value;
  let password = document.getElementById("loginPassword").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  let user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid email or password!");
    return;
  }

  localStorage.setItem("loggedInUser", email);
  window.location.href = "dashboard.html";
}

/* ========= CHECK LOGIN ========= */
function getLoggedInUser() {
  let email = localStorage.getItem("loggedInUser");
  if (!email) return null;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  return users.find(u => u.email === email) || null;
}

/* ========= LOGOUT ========= */
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

/* ========= UPDATE USER (HELPER) ========= */
function updateUser(updatedUser) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let index = users.findIndex(u => u.email === updatedUser.email);
  if (index !== -1) {
    users[index] = updatedUser;
    localStorage.setItem("users", JSON.stringify(users));
  }
}

/* ========= LOAD DASHBOARD ========= */
function loadDashboard() {
  let user = getLoggedInUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const nameEl = document.getElementById("userName");
  const emailEl = document.getElementById("userEmail");

  if (nameEl) nameEl.innerText = user.name;
  if (emailEl) emailEl.innerText = user.email;

  loadSkills();
  loadGroups();
}

/* ========= SKILLS: ADD ========= */
function addSkill() {
  let user = getLoggedInUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  let skill = document.getElementById("skillInput").value.trim();

  if (skill === "") {
    alert("Enter a skill!");
    return;
  }

  if (!Array.isArray(user.skills)) user.skills = [];
  user.skills.push(skill);

  updateUser(user);
  loadSkills();

  document.getElementById("skillInput").value = "";
}

/* ========= SKILLS: LOAD ========= */
function loadSkills() {
  let user = getLoggedInUser();
  if (!user) return;

  let box = document.getElementById("skillsList");
  if (!box) return;

  box.innerHTML = "";

  (user.skills || []).forEach((skill, index) => {
    box.innerHTML += `
      <div class="skill-item">
        ${skill}
        <button onclick="deleteSkill(${index})">X</button>
      </div>
    `;
  });
}

/* ========= SKILLS: DELETE ========= */
function deleteSkill(index) {
  let user = getLoggedInUser();
  if (!user) return;

  if (!Array.isArray(user.skills)) user.skills = [];
  user.skills.splice(index, 1);

  updateUser(user);
  loadSkills();
}

/* ========= GROUPS: ADD (FROM DASHBOARD) ========= */
function addGroup() {
  let user = getLoggedInUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  let gname = document.getElementById("groupInput").value.trim();

  if (gname === "") {
    alert("Enter group name!");
    return;
  }

  if (!Array.isArray(user.groups)) user.groups = [];
  user.groups.push(gname);

  updateUser(user);
  loadGroups();

  document.getElementById("groupInput").value = "";
}

/* ========= GROUPS: LOAD (DASHBOARD) ========= */
function loadGroups() {
  let user = getLoggedInUser();
  if (!user) return;

  let box = document.getElementById("groupsList");
  if (!box) return;

  box.innerHTML = "";

  (user.groups || []).forEach((g, index) => {
    box.innerHTML += `
      <div class="group-item">
        ${g}
        <button onclick="deleteGroup(${index})">X</button>
      </div>
    `;
  });
}

/* ========= GROUPS: DELETE (DASHBOARD) ========= */
function deleteGroup(i) {
  let user = getLoggedInUser();
  if (!user) return;

  if (!Array.isArray(user.groups)) user.groups = [];
  user.groups.splice(i, 1);

  updateUser(user);
  loadGroups();
}

/* ========= GROUPS: JOIN FROM GROUPS PAGE ========= */
function joinGroup(groupName) {
  let user = getLoggedInUser();
  if (!user) {
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  if (!Array.isArray(user.groups)) user.groups = [];

  if (user.groups.includes(groupName)) {
    alert("You already joined this group!");
    return;
  }

  user.groups.push(groupName);
  updateUser(user);

  alert("Joined " + groupName + "!");
}

/* ========= STUDENT DIRECTORY ========= */
function loadDirectory() {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let box = document.getElementById("studentsBox");

  if (!box) return;

  box.innerHTML = "";

  users.forEach(u => {
    box.innerHTML += `
      <div class="student-card">
        <h3>${u.name}</h3>
        <p>Email: ${u.email}</p>
        <p>Skills: ${u.skills && u.skills.length ? u.skills.join(", ") : "No skills added"}</p>
      </div>
    `;
  });
}

/* ========= PROFILE PAGE: LOAD DATA FROM STORAGE ========= */
function loadProfile() {
  let user = getLoggedInUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // BASIC TEXT
  const nameEl = document.getElementById("profileName");
  const deptEl = document.getElementById("profileDept"); // if you use department
  const groupCountEl = document.getElementById("groupCount");
  const previewTagsEl = document.getElementById("previewTags"); // where you show chips

  if (nameEl) nameEl.textContent = user.name;
  if (groupCountEl) groupCountEl.textContent = (user.groups || []).length;

  // SKILLS + GROUPS as tags (preview section)
  if (previewTagsEl) {
    previewTagsEl.innerHTML = "";
    const skills = user.skills || [];
    const groups = user.groups || [];

    skills.forEach(skill => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = skill;
      previewTagsEl.appendChild(span);
    });

    groups.forEach(group => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = group;
      previewTagsEl.appendChild(span);
    });
  }

  // OPTIONAL: if you want a separate list only for skills on profile
  const skillBox = document.getElementById("profileSkills");
  if (skillBox) {
    skillBox.innerHTML = "";
    (user.skills || []).forEach(skill => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = skill;
      skillBox.appendChild(span);
    });
  }

  // OPTIONAL: if you want a separate list only for groups on profile
  const groupBox = document.getElementById("profileGroups");
  if (groupBox) {
    groupBox.innerHTML = "";
    (user.groups || []).forEach(group => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = group;
      groupBox.appendChild(span);
    });
  }
}