const path = require('path');
const fs = require('fs');
const sequelize = require('../models').sequelize;

async function isAnyTableEmpty(tables) {
    for (let table of tables) {
        const [results] = await sequelize.query(`SELECT COUNT(*) AS count FROM \`${table}\``);
        if (results[0].count === 0) {
            return true; // Found an empty table
        }
    }
    return false; // No empty tables found
}

async function populateDatabase() {
    try { 
        // Read and execute queries from JSON files
        const jsonFiles = ['types', 'roles', 'colours', 'makes', 'models', 'features', 'users', 'vehicles', 'vehicle_features', 'rentals'];
        for (let file of jsonFiles) {
            const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'json', `${file}.json`), 'utf-8'));
            for (let record of data) {
                await sequelize.query(record.query);
            }
        }
        console.log('Database populated successfully.');
    } catch (error) {
        console.error('Error populating database:', error);
        throw error;
    }
}

async function run() {
    try {
        await sequelize.sync({ force: false });
        console.log('All models were synchronized successfully.');
        const essentialTables = ['users', 'vehicles']; 
        if (await isAnyTableEmpty(essentialTables)) {
            console.log('Populating database...');
            await populateDatabase(); 
        } else {
            console.log('Database is already populated.');
        }
    } catch (error) {
        console.error('Error checking or populating database:', error);
        throw error;
    }
}

module.exports = { run, populateDatabase };