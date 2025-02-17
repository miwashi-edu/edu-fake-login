document.addEventListener("DOMContentLoaded", function () {
    initializePage();
});

function initializePage() {
    const loginDiv = document.getElementById("login");
    const contentDiv = document.getElementById("content");
    const logoutDiv = document.getElementById("logout");
    const usersDiv = document.getElementById("users");
    const errorsDiv = document.getElementById("errors");
    const userSpan = document.getElementById("user");

    const user = sessionStorage.getItem("user");

    displayRegisteredUsers(usersDiv); // Ensure user list is always shown

    if (user) {
        showLoggedInView(loginDiv, contentDiv, logoutDiv, errorsDiv, userSpan, user);
    } else {
        showLoggedOutView(loginDiv, contentDiv, logoutDiv, errorsDiv, usersDiv);
    }
}

function showLoggedInView(loginDiv, contentDiv, logoutDiv, errorsDiv, userSpan, user) {
    loginDiv.style.display = "none";
    contentDiv.style.display = "block";
    logoutDiv.style.display = "block";
    errorsDiv.innerHTML = "";

    if (userSpan) {
        userSpan.innerHTML = `Welcome, ${user}! `;
    }

    logoutDiv.innerHTML = '<button id="logoutButton">Logout</button>';
    document.getElementById("logoutButton").addEventListener("click", logoutUser);
}

function showLoggedOutView(loginDiv, contentDiv, logoutDiv, errorsDiv, usersDiv) {
    loginDiv.style.display = "block";
    contentDiv.style.display = "none";
    logoutDiv.style.display = "none";
    errorsDiv.innerHTML = "";

    loginDiv.innerHTML = `
        <button id="toggleForm">Switch to Register</button>
        <div id="loginForm">
            <h2>Login</h2>
            <input type="text" id="username" placeholder="Username">
            <input type="password" id="password" placeholder="Password">
            <button id="loginButton">Login</button>
        </div>
        <div id="registerForm" style="display: none;">
            <h2>Register</h2>
            <input type="text" id="regUsername" placeholder="Username">
            <input type="password" id="regPassword" placeholder="Password">
            <button id="registerButton">Register</button>
        </div>
    `;

    setupFormToggle();
    setupLoginHandler(errorsDiv);
    setupRegisterHandler(errorsDiv);
    displayRegisteredUsers(usersDiv); // Ensure user list is displayed for logged out users
}

function setupFormToggle() {
    const toggleButton = document.getElementById("toggleForm");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    toggleButton.addEventListener("click", function () {
        const isLoginVisible = loginForm.style.display !== "none";
        loginForm.style.display = isLoginVisible ? "none" : "block";
        registerForm.style.display = isLoginVisible ? "block" : "none";
        toggleButton.textContent = isLoginVisible ? "Switch to Login" : "Switch to Register";
    });
}

function setupLoginHandler(errorsDiv) {
    document.getElementById("loginButton").addEventListener("click", function () {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const storedPassword = localStorage.getItem(username);

        if (storedPassword && storedPassword === password) {
            sessionStorage.setItem("user", username);
            location.reload();
        } else {
            showError(errorsDiv, "Invalid credentials");
        }
    });
}

function setupRegisterHandler(errorsDiv) {
    document.getElementById("registerButton").addEventListener("click", function () {
        const regUsername = document.getElementById("regUsername").value;
        const regPassword = document.getElementById("regPassword").value;

        if (localStorage.getItem(regUsername)) {
            showError(errorsDiv, "User already exists");
        } else {
            localStorage.setItem(regUsername, regPassword);
            alert("Registration successful");
            location.reload();
        }
    });
}

function logoutUser() {
    sessionStorage.removeItem("user");
    location.reload();
}

function showError(errorsDiv, message) {
    errorsDiv.innerHTML = `<p class="error">${message}</p>`;
}

function displayRegisteredUsers(usersDiv) {
    usersDiv.innerHTML = "<h3>Registered Users</h3>";
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key !== "user") {
            usersDiv.innerHTML += `<p>${key}</p>`;
        }
    }
}
