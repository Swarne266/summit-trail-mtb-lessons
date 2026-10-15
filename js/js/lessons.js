// lessons.js - lesson filter + "My Pick" favorite (uses LESSONS from data.js)
const lessonList = document.getElementById("lesson-list");
const filterBar = document.getElementById("filter-bar");
const favoriteBanner = document.getElementById("favorite-banner");

let currentFilter = loadFromStorage(STORAGE_KEYS.filter, "All");
let favoriteId = loadFromStorage(STORAGE_KEYS.favorite, null);

function getFilteredLessons(level) {
  if (level === "All") return LESSONS;
  return LESSONS.filter(function (lesson) { return lesson.level === level; });
}

function createLessonCard(lesson) {
  const isFavorite = lesson.id === favoriteId;
  const card = document.createElement("div");
  card.className = "card" + (isFavorite ? " card-favorite" : "");
  card.innerHTML =
    "<h3>" + lesson.title + "</h3>" +
    "<p>" + lesson.description + "</p>" +
    "<p><strong>$" + lesson.price + " / rider</strong> &middot; " + lesson.duration + "</p>" +
    '<button type="button" class="btn btn-small save-btn" data-id="' + lesson.id + '">' +
    (isFavorite ? "&#9733; My Pick" : "Save as my pick") + "</button>";
  return card;
}

function renderLessons() {
  const lessons = getFilteredLessons(currentFilter);
  lessonList.innerHTML = "";
  lessons.forEach(function (lesson) {
    lessonList.appendChild(createLessonCard(lesson));
  });
  document.getElementById("result-count").textContent =
    "Showing " + lessons.length + " of " + LESSONS.length + " lessons";
}

function updateFilterButtons() {
  const buttons = filterBar.querySelectorAll("button");
  buttons.forEach(function (button) {
    const active = button.dataset.level === currentFilter;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", active);
  });
}

function updateFavoriteBanner() {
  const favorite = findLessonById(favoriteId);
  if (favorite) {
    favoriteBanner.innerHTML =
      "Your pick: <strong>" + favorite.title + "</strong>. " +
      '<a href="contact.html">Book this lesson</a> or <button type="button" id="clear-pick" class="link-btn">clear</button>';
  } else {
    favoriteBanner.textContent = "Save a lesson as your pick and we'll pre-select it on the booking form.";
  }
}

function handleFilterClick(event) {
  const button = event.target.closest("button[data-level]");
  if (!button) return;
  currentFilter = button.dataset.level;
  saveToStorage(STORAGE_KEYS.filter, currentFilter);
  updateFilterButtons();
  renderLessons();
}

function handleSaveClick(event) {
  const button = event.target.closest(".save-btn");
  if (!button) return;
  favoriteId = button.dataset.id;
  saveToStorage(STORAGE_KEYS.favorite, favoriteId);
  updateFavoriteBanner();
  renderLessons();
}

function handleClearPick(event) {
  if (event.target.id !== "clear-pick") return;
  favoriteId = null;
  saveToStorage(STORAGE_KEYS.favorite, null);
  updateFavoriteBanner();
  renderLessons();
}

function init() {
  updateFilterButtons();
  updateFavoriteBanner();
  renderLessons();
  filterBar.addEventListener("click", handleFilterClick);
  lessonList.addEventListener("click", handleSaveClick);
  favoriteBanner.addEventListener("click", handleClearPick);
}

init();
