document.addEventListener("DOMContentLoaded", () => {
    const moodIcons = [
        { mood: "happy", icon: "/emotions/happy.png" },
        { mood: "sad", icon: "/emotions/sad.png" },
        { mood: "angry", icon: "/emotions/angry.png" },
        { mood: "neutural", icon: "/emotions/neutural.png" },
        { mood: "depressed", icon: "/emotions/depressed.png" },
        { mood: "exited", icon: "/emotions/exited.png" },
    ];

    const moodSelectorContainer = document.getElementById("mood-selector-container");
    const moodSelector = document.getElementById("mood-selector");
    const saveMoodButton = document.getElementById("save-mood");
    let selectedMood = null;
    let selectedDate = null;

    const handleMoodClick = (mood, imgElement) => {
        if (selectedMood) {
            selectedMood.classList.remove("selected");
        }
        imgElement.classList.add("selected");
        selectedMood = imgElement;

        console.log("Selected mood:", mood);
    };

    moodIcons.forEach(({ mood, icon }) => {
        const img = document.createElement("img");
        img.src = icon;
        img.alt = mood;
        img.className = "mood-icon";
        img.addEventListener("click", () => handleMoodClick(mood, img));
        moodSelector.appendChild(img);
    });

    const calendarDays = document.querySelector('.calendar-days');

    calendarDays.addEventListener('click', (event) => {
        if (event.target.innerHTML) {
            selectedDate = event.target.innerHTML;
            moodSelectorContainer.classList.remove('hidden');
        }
    });

    saveMoodButton.addEventListener('click', () => {
        if (selectedMood && selectedDate) {
            console.log(`Mood for ${selectedDate}: ${selectedMood.alt}`);
            moodSelectorContainer.classList.add('hidden');
            selectedMood.classList.remove("selected");
            selectedMood = null;

           
        }
    });
});
