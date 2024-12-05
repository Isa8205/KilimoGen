const Farmers = require('../models/farmer')

const postFarmer = async () => {
    try {
        const farmer = await Farmers.create({
            firstname: 'Wesley',
            lastname: 'Too',
            Phone: '0723456935',
            produce: 'coffee|milk',
            email: 'wesleytoo58@gmail.com',
            payment_mode: 'Bank-012777368'
        })

        console.log('Success', farmer.toJSON())
    } catch (err) {
        throw err
    }
}

export default postFarmer;