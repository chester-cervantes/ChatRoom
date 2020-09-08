const users = [];

function userJoins(id, username, room) {
    const user = { id, username, room };

    users.push(user);

    return user;
}

function getCurrentUserById(id) {
    return users.find(user => user.id === id)
}

function userLeaves(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        const test = users.splice(index, 1)
        console.log(test[0])
        return users.splice(index, 1)[0];
    }
}

function getUsersByRoom(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoins,
    getCurrentUserById,
    userLeaves,
    getUsersByRoom
};