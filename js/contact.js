// contact.js - form validation + pre-filling from localStorage
const form = document.getElementById("booking-form");
const fields = {
  name: document.getElementById("name"),
  email: document.getElementById("email"),
  phone: document.getElementById("phone"),
  package: document.getElementById("package"),
  message: document.getElementById("message")
};

// Each validator returns an error message, or "" if the value is valid
const validators = {
  name: function (value) {
    if (value.trim() === "") return "Please enter your full name.";
    if (value.trim().length < 2) return "Name must be at least 2 characters.";
    return "";
  },
  email: function (value) {
    if (value.trim() === "") return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "Enter a valid email like name@example.com.";
    return "";
  },
  phone: function (value) {
    if (value.trim() === "") return ""; // optional
    if (!/^[0-9\s\-().+]{10,}$/.test(value.trim())) return "Enter a phone number with at least 10 digits.";
    return "";
  },
  package: function (value) {
    return value === "" ? "Please choose a lesson package." : "";
  },
  message: function (value) {
    return value.length > 300 ? "Message must be 300 characters or less (currently " + value.length + ")." : "";
  }
};

function showError(fieldName, message) {
  const errorEl = document.getElementById(fieldName + "-error");
  const field = fields[fieldName];
  errorEl.textContent = message;
  field.setAttribute("aria-invalid", message !== "");
  field.classList.toggle("invalid", message !== "");
}

function validateField(fieldName) {
  const message = validators[fieldName](fields[fieldName].value);
  showError(fieldName, message);
  return message === "";
}

function validateForm() {
  let allValid = true;
  Object.keys(fields).forEach(function (fieldName) {
    if (!validateField(fieldName)) allValid = false;
  });
  return allValid;
}

function populatePackages() {
  LESSONS.forEach(function (lesson) {
    const option = document.createElement("option");
    option.value = lesson.id;
    option.textContent = lesson.title + " ($" + lesson.price + ")";
    fields.package.appendChild(option);
  });
}

function prefillFromStorage() {
  const favoriteId = loadFromStorage(STORAGE_KEYS.favorite, null);
  if (favoriteId && findLessonById(favoriteId)) {
    fields.package.value = favoriteId;
    document.getElementById("prefill-note").textContent =
      "We pre-selected your saved pick from the Lessons page.";
  }
  const contact = loadFromStorage(STORAGE_KEYS.contact, null);
  if (contact) {
    fields.name.value = contact.name || "";
    fields.email.value = contact.email || "";
  }
}

function handleSubmit(event) {
  event.preventDefault();
  const success = document.getElementById("form-success");
  success.textContent = "";
  if (!validateForm()) {
    const firstInvalid = form.querySelector(".invalid");
    if (firstInvalid) firstInvalid.focus();
    return;
  }
  saveToStorage(STORAGE_KEYS.contact, { name: fields.name.value.trim(), email: fields.email.value.trim() });
  const lesson = findLessonById(fields.package.value);
  success.textContent = "Thanks, " + fields.name.value.trim() + "! We received your request for \"" +
    lesson.title + "\" and will email you within one business day.";
  fields.phone.value = "";
  fields.message.value = "";
  fields.package.value = "";
}

function init() {
  populatePackages();
  prefillFromStorage();
  form.addEventListener("submit", handleSubmit);
  fields.package.addEventListener("change", function () {
    document.getElementById("prefill-note").textContent = "";
  });
  Object.keys(fields).forEach(function (fieldName) {
    fields[fieldName].addEventListener("blur", function () { validateField(fieldName); });
    // Re-check on input only if an error is already showing, so users can fix it live
    fields[fieldName].addEventListener("input", function () {
      if (fields[fieldName].classList.contains("invalid")) validateField(fieldName);
    });
  });
}

init();
