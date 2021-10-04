const router = require('express').Router();
const db = require('../models');

// GET all workouts
router.get("/workouts", async (req, res) => {
    try {
        const workoutData = await db.Workout.aggregate([{
            $addFields: {
                totalDuration: { $sum: "$exercises.duration" }
            }
        }]);
        res.status(200).json(workoutData);
    } catch (err) {
        res.status(400).json(err);
    };
});

// ADD an exercise
router.put("/workouts/:id", async (req, res) => {
    try {
        const newExercise = req.body
        const workoutData = await db.Workout.findByIdAndUpdate(req.params.id, {
            $push: { exercises: req.body }
        });
        res.status(200).json(workoutData);
    } catch (err) {
        res.status(400).json(err);
    };
});

// ADD a workout
router.post("/workouts", async (req, res) => {
    try {
        const workoutData = await db.Workout.create({});
        res.status(200).json(workoutData);
    } catch (err) {
        res.status(400).json(err);
    };
});

// GET last 7 workouts
router.get("/workouts/range", async (req, res) => {
    try {
        const workoutData = await db.Workout.aggregate([{
            $addFields: {
                totalDuration: { $sum: "$exercises.duration" }
            }
        }]).skip(await db.Workout.count() - 7);
        res.status(200).json(workoutData);
    } catch (err) {
        res.status(400).json(err);
    };
});

module.exports = router;