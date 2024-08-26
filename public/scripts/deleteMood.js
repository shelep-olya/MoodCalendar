document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function() {
        const emotionId = this.dataset.id;

        if (confirm("Are you sure you want to delete this emotion?")) { // Optional confirmation
            fetch(`/moods/${emotionId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === "Emotion deleted successfully") {
                    this.closest('.date').remove();
                } else {
                    console.error("Failed to delete emotion:", data.message);
                }
            })
            .catch(error => console.error("Error:", error));
        }
    });
});
