const express = require('express');
const leaderboardRoutes = require('@/routes/leaderboard.routes');


const router = express.Router();


router.use('/leaderboard', leaderboardRoutes);


module.exports = router;