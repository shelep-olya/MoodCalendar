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
    let currentEmotionId = null;

    moodIcons.forEach(({ mood, icon }) => {
        const img = document.createElement("img");
        img.src = icon;
        img.alt = mood;
        img.className = "mood-icon";
        img.addEventListener("click", () => {
            if (selectedMood) {
                selectedMood.classList.remove("selected");
            }
            img.classList.add("selected");
            selectedMood = img;
        });
        moodSelector.appendChild(img);
    });

    document.querySelectorAll('.change-btn').forEach(button => {
        button.addEventListener('click', function() {
            currentEmotionId = this.dataset.id;
            moodSelectorContainer.classList.remove('hidden');
        });
    });

    saveMoodButton.addEventListener('click', () => {
        if (selectedMood && currentEmotionId) {
            const newMood = selectedMood.alt;

            fetch(`/moods/${currentEmotionId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mood: newMood })
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === "Emotion updated successfully") {
                    document.querySelector(`.date [data-id="${currentEmotionId}"] ~ .mood-icon`).src = `/emotions/${newMood}.png`;
                    document.querySelector(`.date [data-id="${currentEmotionId}"] ~ p:last-child`).textContent = `Mood: ${newMood}`;
                    moodSelectorContainer.classList.add('hidden');
                    selectedMood.classList.remove("selected");
                    selectedMood = null;
                } else {
                    console.error("Failed to update emotion:", data.message);
                }
            })
            .catch(error => console.error("Error:", error));
        }
    });
});
