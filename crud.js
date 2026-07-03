// API Configuration
const API_CONFIG = {
  BASE_URL: "https://jsonplaceholder.typicode.com/users",
  HEADERS: {
    "Content-Type": "application/json",
  },
};

// DOM Elements
const elements = {
  tableBody: document.getElementById("table-row"),
  idInput: document.getElementById("sno"),
  nameInput: document.getElementById("name"),
  emailInput: document.getElementById("email"),
  cityInput: document.getElementById("city"),
  pinInput: document.getElementById("pin"),
  submitBtn: document.getElementById("btn"),
  deleteModal: new bootstrap.Modal(document.getElementById("deleteModal")),
  confirmDeleteBtn: document.getElementById("confirm-button"),
};

let userIdToDelete = null;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadUsers();
  setupEventListeners();
});

// Load all users from API
const loadUsers = async () => {
  try {
    const response = await fetch(API_CONFIG.BASE_URL);
    const users = await response.json();
    renderUserTable(users);
  } catch (error) {
    console.error("Error loading users:", error);
    alert("Failed to load users. Please refresh the page.");
  }
};

// Render users in table
const renderUserTable = (users) => {
  const formRow = elements.tableBody.querySelector(".form-row");
  
  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.address?.city || "N/A"}</td>
      <td>${user.address?.zipcode || "N/A"}</td>
      <td>
        <button type="button" class="edit" data-id="${user.id}">Edit</button>
        <button type="button" class="delete" data-id="${user.id}">Delete</button>
      </td>
    `;
    elements.tableBody.insertBefore(row, formRow);
  });
};

// Setup event listeners
const setupEventListeners = () => {
  elements.submitBtn.addEventListener("click", handleSubmit);
  
  // Event delegation for Edit and Delete buttons
  elements.tableBody.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit")) {
      const userId = event.target.dataset.id;
      editData(userId);
    } else if (event.target.classList.contains("delete")) {
      const userId = event.target.dataset.id;
      showDeleteConfirmation(userId);
    }
  });
  
  elements.confirmDeleteBtn.addEventListener("click", deleteUser);
};

// Handle form submission (Create or Update)
const handleSubmit = () => {
  if (elements.submitBtn.textContent === "Create") {
    addUser();
  } else {
    updateData();
  }
};

// Validate form inputs
const validateForm = () => {
  if (!elements.nameInput.value.trim()) {
    alert("Please enter name");
    return false;
  }
  if (!elements.emailInput.value.trim()) {
    alert("Please enter email");
    return false;
  }
  if (!elements.cityInput.value.trim()) {
    alert("Please enter city");
    return false;
  }
  if (!elements.pinInput.value.trim()) {
    alert("Please enter zipcode");
    return false;
  }
  return true;
};

// Get form data object
const getFormData = () => ({
  name: elements.nameInput.value.trim(),
  email: elements.emailInput.value.trim(),
  address: {
    city: elements.cityInput.value.trim(),
    zipcode: elements.pinInput.value.trim(),
  },
});

// Clear form
const clearForm = () => {
  elements.idInput.value = "";
  elements.nameInput.value = "";
  elements.emailInput.value = "";
  elements.cityInput.value = "";
  elements.pinInput.value = "";
  elements.submitBtn.textContent = "Create";
};

// Add new user
const addUser = async () => {
  if (!validateForm()) return;

  try {
    const response = await fetch(API_CONFIG.BASE_URL, {
      method: "POST",
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify(getFormData()),
    });

    const newUser = await response.json();
    console.log("User created:", newUser);
    clearForm();
    alert("User created successfully!");
  } catch (error) {
    console.error("Error creating user:", error);
    alert("Failed to create user. Please try again.");
  }
};

// Edit user - load user data into form
const editData = async (id) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/${id}`);
    const user = await response.json();

    elements.idInput.value = user.id;
    elements.nameInput.value = user.name;
    elements.emailInput.value = user.email;
    elements.cityInput.value = user.address?.city || "";
    elements.pinInput.value = user.address?.zipcode || "";
    elements.submitBtn.textContent = "Update";
    
    // Scroll to form
    elements.nameInput.focus();
  } catch (error) {
    console.error("Error loading user for edit:", error);
    alert("Failed to load user data. Please try again.");
  }
};

// Update user
const updateData = async () => {
  if (!validateForm()) return;

  const id = elements.idInput.value;
  if (!id) {
    alert("No user selected for update");
    return;
  }

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/${id}`, {
      method: "PUT",
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify(getFormData()),
    });

    const updatedUser = await response.json();
    console.log("User updated:", updatedUser);
    clearForm();
    alert("User updated successfully!");
  } catch (error) {
    console.error("Error updating user:", error);
    alert("Failed to update user. Please try again.");
  }
};

// Show delete confirmation modal
const showDeleteConfirmation = (id) => {
  userIdToDelete = id;
  elements.deleteModal.show();
};

// Delete user
const deleteUser = async () => {
  if (!userIdToDelete) return;

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/${userIdToDelete}`, {
      method: "DELETE",
      headers: API_CONFIG.HEADERS,
    });

    console.log(`User ${userIdToDelete} deleted successfully`);
    alert("User deleted successfully!");
    userIdToDelete = null;
    location.reload(); // Reload to refresh table
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("Failed to delete user. Please try again.");
  }
};
