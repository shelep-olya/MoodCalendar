const User = require("../models/userModel");
exports.saveMood = async(req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { date, mood } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
      
        const currentDate = new Date();
        const selectedDate = new Date(date);

        const daysDifference = Math.floor((currentDate - selectedDate) / (1000 * 60 * 60 * 24));
        if (daysDifference < 0 || daysDifference > 5) {
            return res.status(400).json({ error: 'Invalid date. You can only select today or the past 5 days.' });
        }

        user.moodEntries.push({ date: selectedDate, mood: mood });
        await user.save(); 

        res.status(200).json({ message: "Mood saved successfully" });
    } catch (err) {
        console.log(`An error occurred with mood saving: ${err.message}`);
        res.status(500).json({ error: 'An error occurred while saving mood.' });
    }
}