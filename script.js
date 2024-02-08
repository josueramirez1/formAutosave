// Get the form element
let form = document.querySelector("#save-me");

// localStorage prefix
let prefix = "autosave_fields";

//Serialize into objects
function serialize(data) {
  let obj = {};
  for (let [key, value] of data) {
    if (obj[key] !== undefined) {
      if (!Array.isArray(obj[key])) {
        obj[key] = [obj[key]];
      }
      obj[key].push(value);
    } else {
      obj[key] = value;
    }
  }
  return obj;
}

let debounce;
let currentNotification;

function showStatus() {
  // Create a notification
  let notification = document.createElement("div");
  notification.setAttribute("aria-live", "polite");

  // Inject it into the DOM
  form.append(notification);

  clearTimeout(debounce);
  // Add text after it's in the UI

  debounce = setTimeout(function () {
    notification.textContent = "Saving form...";
  }, 1);

  if (currentNotification) {
    currentNotification.remove();
  }
  currentNotification = notification;

  // Remove it after 4 seconds
  debounce = setTimeout(function () {
    notification.remove();
  }, 4000);
}

//Handle input events
function inputHandler(event) {
  setTimeout(() => {
    let data = serialize(new FormData(form));

    // Stringify the object and save it to localStorage
    localStorage.setItem(prefix, JSON.stringify(data));

    showStatus();
  }, 1000);
}

//Clear all data from local storage
function clearStorage(e) {
  e.preventDefault();
  localStorage.removeItem(prefix);
  let fields = form.elements;
  for (let field of fields) {
    field.value = "";
  }
  let notification = document.createElement("div");
  notification.setAttribute("aria-live", "polite");

  // Inject it into the DOM

  form.append(notification);

  debounce = setTimeout(function () {
    notification.textContent = "Your information has been saved!";
  }, 1);

  if (currentNotification) {
    currentNotification.remove();
  }
  currentNotification = notification;

  // Remove it after 4 seconds
  debounce = setTimeout(function () {
    notification.remove();
  }, 4000);
}

//Load data from local storage
function loadSaved() {
  // Get saved data from localStorage
  // If there's nothing saved, exit the functiom
  let saved = JSON.parse(localStorage.getItem(prefix));
  if (!saved) return;

  // Get all of the fields in the form
  let fields = form.elements;

  // Loop through each one and load saved data if it exists
  for (let field of fields) {
    if (!saved[field.name]) continue;
    field.value = saved[field.name];
  }
}

// Load saved data from localStorage
loadSaved();

// Listen for DOM events
form.addEventListener("input", inputHandler);
form.addEventListener("submit", clearStorage);
