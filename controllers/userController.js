const User = require("../models/userModel");
const authLayout = "../views/layouts/auth";
const catchAsync = require("../utils/catchAsync");

exports.saveMood = catchAsync(async(req, res) => {
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
});

exports.getMoodStatisctics = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    const emotions = user.moodEntries;

    // Filter negative emotions and sort by date
    const negativeEmotions = emotions
        .filter(e => ["sad", "angry", "depressed"].includes(e.mood))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    let consecutiveCount = 0;
    for (let i = 1; i < negativeEmotions.length; i++) {
        const currentEmotionDate = new Date(negativeEmotions[i].date);
        const previousEmotionDate = new Date(negativeEmotions[i - 1].date);
        const differenceInDays = (currentEmotionDate - previousEmotionDate) / (1000 * 60 * 60 * 24);
        if (differenceInDays === 1) {
            consecutiveCount++;
            if (consecutiveCount >= 9) { 
                return res.status(200).render("statistics", {
                    layout: authLayout,
                    message: "bad",
                    sad: emotions.filter(e => e.mood === "sad"),
                    depressed: emotions.filter(e => e.mood === "depressed"),
                    angry: emotions.filter(e => e.mood === "angry"),
                    happy: emotions.filter(e => e.mood === "happy"),
                    exited: emotions.filter(e => e.mood === "exited"),
                    neutural: emotions.filter(e => e.mood === "neutural"),
                });
            }
        } else {
            consecutiveCount = 0; 
        }
    }

    res.status(200).render("statistics", {
        layout: authLayout,
        message: "okay",
        sad: emotions.filter(e => e.mood === "sad"),
        depressed: emotions.filter(e => e.mood === "depressed"),
        angry: emotions.filter(e => e.mood === "angry"),
        happy: emotions.filter(e => e.mood === "happy"),
        exited: emotions.filter(e => e.mood === "exited"),
        neutural: emotions.filter(e => e.mood === "neutural"),
    });
});

exports.getMyMoods = catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id).select('moodEntries');
    const emotions = user.moodEntries.map(emotion => {
        const formattedDate = new Date(emotion.date).toLocaleDateString('en-GB'); 
        return {
            ...emotion._doc, 
            date: formattedDate
        };
    });
    const moodIcons = [
        { mood: "happy", icon: "/emotions/happy.png" },
        { mood: "sad", icon: "/emotions/sad.png" },
        { mood: "angry", icon: "/emotions/angry.png" },
        { mood: "neutural", icon: "/emotions/neutural.png" },
        { mood: "depressed", icon: "/emotions/depressed.png" },
        { mood: "exited", icon: "/emotions/exited.png" },
    ];
    res.status(200).render('myMoods', {
        layout: authLayout,
        emotions,
        moodIcons
    });
});

exports.deleteEmotion = catchAsync(async(req, res) => {
    const userId = req.user._id;
        const emotionId = req.params.id;

        await User.findByIdAndUpdate(userId, {
            $pull: { moodEntries: { _id: emotionId } }
        });

        res.status(200).json({ message: "Emotion deleted successfully" });
    
});

exports.updateEmotion = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const emotionId = req.params.id;
    const { mood } = req.body;

    const moodIcons = [
        { mood: "happy", icon: "/emotions/happy.png" },
        { mood: "sad", icon: "/emotions/sad.png" },
        { mood: "angry", icon: "/emotions/angry.png" },
        { mood: "neutral", icon: "/emotions/neutral.png" },
        { mood: "depressed", icon: "/emotions/depressed.png" },
        { mood: "exited", icon: "/emotions/exited.png" },
    ];

    const selectedIcon = moodIcons.find(item => item.mood === mood)?.icon;

    if (!selectedIcon) {
        return res.status(400).json({ message: "Invalid mood selected" });
    }

    await User.findOneAndUpdate(
        { _id: userId, "moodEntries._id": emotionId },
        {
            $set: {
                "moodEntries.$.mood": mood,
                "moodEntries.$.icon": selectedIcon,
            },
        }
    );

    res.status(200).json({ message: "Emotion updated successfully" });
});

