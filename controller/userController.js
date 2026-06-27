const userService = require("../service/userService");


async function getUserById(req, res){
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json(user);
    } catch(error){
        res.status(500).json({message: error.message});
    }

}

async function getStats(req, res) {
  try {
    const userId = req.headers['x-user-id'];
    const stats = await userService.getStats(userId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


module.exports = {
    getUserById,
    getStats
}