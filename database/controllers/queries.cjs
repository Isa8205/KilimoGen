const { Farmers } = require('../models')

async function query() {
    // Create a new user
    const newUser = await Farmers.create({
        name: 'JohnDoe',
        email: 'john.doe@example.com',
    });

    console.log('New user created:', newUser.toJSON());

    // Retrieve all users
    const users = await Farmers.findAll();
    console.log('All users:', users);
};

export default query