// data.js - shared lesson data (array of objects) used by lessons.js and contact.js
const LESSONS = [
  { id: "beginner-basics", level: "Beginner", title: "Beginner: Trail Basics", duration: "2 hours", price: 65,
    description: "Braking, gear shifting, balance, and reading simple terrain on flat, wide trails." },
  { id: "beginner-kids", level: "Beginner", title: "Beginner: Kids Intro (ages 8-12)", duration: "90 minutes", price: 55,
    description: "A relaxed, game-based intro to bike handling and trail safety for younger riders." },
  { id: "intermediate-skills", level: "Intermediate", title: "Intermediate: Skills Builder", duration: "3 hours", price: 95,
    description: "Cornering, climbing technique, and controlled descents on moderate single-track." },
  { id: "intermediate-climbing", level: "Intermediate", title: "Intermediate: Climbing Clinic", duration: "2 hours", price: 80,
    description: "Gear choice, pedaling efficiency, and body position for steep, sustained climbs." },
  { id: "advanced-technical", level: "Advanced", title: "Advanced: Technical Terrain", duration: "Half day", price: 140,
    description: "Rock gardens, drops, and technical descents, with video review of your riding." },
  { id: "advanced-jumps", level: "Advanced", title: "Advanced: Jumps & Drops Clinic", duration: "3 hours", price: 120,
    description: "Progressive jump and drop practice with a focus on safe takeoffs and landings." }
];

const STORAGE_KEYS = {
  favorite: "mtbFavoriteLesson",
  filter: "mtbLessonFilter",
  contact: "mtbContactInfo"
};

// Safe wrappers so the site still works if storage is blocked
function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Could not save to storage:", error);
  }
}

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored === null ? fallback : JSON.parse(stored);
  } catch (error) {
    return fallback;
  }
}

function findLessonById(id) {
  return LESSONS.find(function (lesson) { return lesson.id === id; });
}
