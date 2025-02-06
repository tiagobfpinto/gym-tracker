/********** Login Functionality **********/
// Dummy credentials (for demonstration purposes only)
const dummyUser = "user";
const dummyPass = "password";

// Check login status on page load
function checkLogin() {
  if (sessionStorage.getItem("loggedIn") === "true") {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("calendar-container").style.display = "block";
    loadCalendar();
  } else {
    document.getElementById("login-container").style.display = "flex";
    document.getElementById("calendar-container").style.display = "none";
  }
}

document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === dummyUser && password === dummyPass) {
    sessionStorage.setItem("loggedIn", "true");
    checkLogin();
  } else {
    alert("Invalid credentials");
  }
});

document.getElementById("logout-btn").addEventListener("click", function () {
  sessionStorage.removeItem("loggedIn");
  location.reload();
});

/********** Calendar Functionality **********/
const calendarEl = document.getElementById("calendar");
const currentYear = new Date().getFullYear();
const startDate = new Date(currentYear, 0, 1);
const endDate = new Date(currentYear, 11, 31);

// Helper: Format Date as YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

let currentEditingDate = null; // holds the date (YYYY-MM-DD) being edited

// Create and return a day element for the calendar
function createDayElement(date) {
  const dayEl = document.createElement("div");
  dayEl.classList.add("day");
  const dateStr = formatDate(date);
  dayEl.dataset.date = dateStr;

  // Date label (top-right)
  const dateLabel = document.createElement("span");
  dateLabel.classList.add("date");
  dateLabel.textContent = date.getDate();
  dayEl.appendChild(dateLabel);

  // Container for training details
  const trainingDiv = document.createElement("div");
  trainingDiv.classList.add("training");
  dayEl.appendChild(trainingDiv);

  // Load saved training info (if any)
  const savedTraining = localStorage.getItem(dateStr);
  if (savedTraining) {
    trainingDiv.textContent = savedTraining;
    dayEl.classList.add("blue");
  }

  // On click, open the modal to edit training details
  dayEl.addEventListener("click", function () {
    currentEditingDate = dateStr;
    const modal = document.getElementById("editModal");
    const trainingInput = document.getElementById("trainingInput");
    trainingInput.value = localStorage.getItem(dateStr) || "";
    modal.style.display = "flex";
  });

  return dayEl;
}

// Load the calendar grid (one box for each day)
function loadCalendar() {
  calendarEl.innerHTML = "";
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayEl = createDayElement(new Date(d));
    calendarEl.appendChild(dayEl);
  }
}

/********** Modal Functionality **********/
document.getElementById("cancelBtn").addEventListener("click", function () {
  document.getElementById("editModal").style.display = "none";
  currentEditingDate = null;
});

document.getElementById("saveBtn").addEventListener("click", function () {
  const trainingInput = document.getElementById("trainingInput").value.trim();
  const modal = document.getElementById("editModal");
  if (trainingInput === "") {
    // Clear the training info if input is empty
    localStorage.removeItem(currentEditingDate);
  } else {
    localStorage.setItem(currentEditingDate, trainingInput);
  }
  // Update the corresponding day box
  const dayElements = document.querySelectorAll(`.day[data-date="${currentEditingDate}"]`);
  dayElements.forEach(function (dayEl) {
    const trainingDiv = dayEl.querySelector(".training");
    trainingDiv.textContent = trainingInput;
    if (trainingInput !== "") {
      dayEl.classList.add("blue");
    } else {
      dayEl.classList.remove("blue");
    }
  });
  modal.style.display = "none";
  currentEditingDate = null;
});

// Close modal if clicking outside its content
window.addEventListener("click", function (event) {
  const modal = document.getElementById("editModal");
  if (event.target === modal) {
    modal.style.display = "none";
    currentEditingDate = null;
  }
});

// Check login status on initial load
checkLogin();
