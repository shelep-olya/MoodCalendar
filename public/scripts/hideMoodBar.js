document.addEventListener("DOMContentLoaded", () => {
    const hideButton = document.getElementById("hideButton");
    const moodSelectorContainer = document.getElementById("mood-selector-container");

    hideButton.addEventListener("click", () => {
      moodSelectorContainer.classList.toggle("hidden");
    });
  });