const User = require('../models/User');

async function createUser(name, username, hashedPassword) {
    const user = new User({
        name,
        username,
        hashedPassword
    });

    await user.save();

    return user;
}

async function getUserByUsername(username) {
    return await User.findOne({ username: { $regex: username, $options: 'i' } });
}
async function getUserByNames(name) {
    return await User.findOne({ name: { $regex: name, $options: 'i' } });
}



module.exports = {
    createUser,
    getUserByUsername,
    getUserByNames
}
