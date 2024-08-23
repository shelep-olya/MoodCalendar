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

exports.getMoodStatisctics = catchAsync(async(req, res) => {
    const user = await User.findById(req.user._id);
    const emotions = user.moodEntries;
    let sad = [];
    let angry = [];
    let depressed = [];
    let exited = [];
    let happy = [];
    let neutural = [];
    emotions.forEach(emotion => {
        if(emotion.mood === "sad"){
            sad.push(emotion)
        };
        if(emotion.mood === "angry"){
            angry.push(emotion)
        };
        if(emotion.mood === "depressed"){
            depressed.push(emotion)
        };
        if(emotion.mood === "exited"){
            exited.push(emotion)
        };
        if(emotion.mood === "happy"){
            happy.push(emotion)
        };
        if(emotion.mood === "neutural"){
            neutural.push(emotion)
        };
    });
    const negativeEmotions = sad.concat(angry).concat(depressed);
    if(negativeEmotions.length >= 10){
        res.status(200).render("statistics", {
            layout: authLayout,
            message: "bad",
            sad,
            depressed,
            angry,
            happy,
            exited,
            neutural,
        });
    }
    res.status(200).render("statistics", {
        layout: authLayout,
        message: "okay",
        sad,
        depressed,
        angry,
        happy,
        exited,
        neutural,
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
        { mood: "excited", icon: "/emotions/excited.png" },
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

