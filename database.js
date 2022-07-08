const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'data/database.sqlite',
});


module.exports = {
    Users: sequelize.define('users', {
        discordTag: {
            type: Sequelize.STRING,
            unique: true,
        },
        riotTag: Sequelize.STRING,
    })
}


